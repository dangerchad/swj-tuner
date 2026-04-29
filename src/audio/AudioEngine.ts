import pitchWorkletUrl from './pitch-worklet?worker&url';
import { MedianFilter } from './smoothing';
import { computeChroma, polyphonyScore } from './ChromaAnalyzer';
import { detectChord } from './ChordDetector';
import { KeyFinder } from './KeyFinder';
import { freqToNote, noteToFreq } from '../lib/musicTheory';
import { useTunerStore } from '../state/tunerStore';
import { useDetectionStore } from '../state/detectionStore';
import { useSettingsStore } from '../state/settingsStore';
import type { TuningPreset } from '../data/presets';

const SILENCE_MS = 350;
const CHROMA_INTERVAL_MS = 50; // 20fps chroma analysis
const CHORD_CONFIRM_FRAMES = 5;
const POLY_TO_CHORD_FRAMES = 4;  // consecutive poly frames before switching to chord mode
const POLY_TO_NOTE_FRAMES  = 8;  // consecutive mono frames before switching back to note mode
const FFT_SIZE = 4096;

class AudioEngine {
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;
  private chromaTimer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  private pitchFilter = new MedianFilter(5);
  private keyFinder = new KeyFinder(40);
  private freqBuffer = new Float32Array(0);

  // Chord confirmation state
  private pendingChord = '';
  private pendingCount = 0;

  // Polyphony hysteresis counters
  private polyFrames = 0;
  private monoFrames = 0;

  async start(): Promise<void> {
    if (this.running) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
        },
      });

      this.context = new AudioContext({ sampleRate: 48000, latencyHint: 'interactive' });
      if (this.context.state === 'suspended') await this.context.resume();

      await this.context.audioWorklet.addModule(pitchWorkletUrl);
      this.workletNode = new AudioWorkletNode(this.context, 'pitch-processor');
      this.workletNode.port.onmessage = this.onPitchMessage;

      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = FFT_SIZE;
      this.analyser.smoothingTimeConstant = 0.75;
      this.freqBuffer = new Float32Array(this.analyser.frequencyBinCount);

      this.source = this.context.createMediaStreamSource(this.stream);
      this.source.connect(this.workletNode);
      this.source.connect(this.analyser);

      this.pitchFilter.reset();
      this.keyFinder.reset();
      this.pendingChord = '';
      this.pendingCount = 0;
      this.polyFrames = 0;
      this.monoFrames = 0;

      this.chromaTimer = setInterval(this.processChroma, CHROMA_INTERVAL_MS);
      this.running = true;
    } catch (err) {
      console.error('[AudioEngine] start failed:', err);
      this.stop();
      throw err;
    }
  }

  // ─── Pitch path (AudioWorklet → main thread) ───────────────────

  private onPitchMessage = ({ data }: MessageEvent<{ pitch: number; clarity: number }>) => {
    const { pitch, clarity } = data;
    const { a4 } = useSettingsStore.getState();
    const smoothed = this.pitchFilter.push(pitch);
    const { note, octave } = freqToNote(smoothed, a4);

    const { preset } = useTunerStore.getState();
    const stringIdx = this.closestString(smoothed, preset, a4);
    const targetFreq = noteToFreq(preset.notes[stringIdx], a4);
    const exactCents = Math.round(1200 * Math.log2(smoothed / targetFreq));

    useTunerStore.getState().setActiveString(stringIdx);
    useDetectionStore.getState().setDetection(
      Math.round(smoothed * 10) / 10,
      clarity,
      note,
      octave,
      exactCents,
    );

    this.resetSilenceTimer();
  };

  // ─── Chroma path (AnalyserNode → HPCP → chord/key) ────────────

  private processChroma = () => {
    if (!this.analyser || !this.context) return;

    this.analyser.getFloatFrequencyData(this.freqBuffer);

    const chroma = computeChroma(
      this.freqBuffer,
      this.context.sampleRate,
      FFT_SIZE,
    );

    const store = useDetectionStore.getState();

    // Energy gate — ignore silence
    const energy = chroma.reduce((s, v) => s + v, 0);
    if (energy < 0.1) {
      this.pendingChord = '';
      this.pendingCount = 0;
      return;
    }

    // Chord detection with confirmation gate
    const result = detectChord(chroma, 0.65);
    const chordName = result?.name ?? '';

    if (chordName && chordName === this.pendingChord) {
      this.pendingCount++;
    } else {
      this.pendingChord = chordName;
      this.pendingCount = 1;
    }

    if (this.pendingCount >= CHORD_CONFIRM_FRAMES && chordName) {
      store.setChord(chordName);
    }

    // Key detection (accumulates over 2 seconds of frames)
    const key = this.keyFinder.addChroma(chroma);
    if (key) store.setKey(key);

    store.setChroma(chroma);

    // Auto mode-switch with hysteresis — only if user hasn't manually selected
    if (!store.userLockedMode) {
      const poly = polyphonyScore(chroma);
      if (poly >= 2) {
        this.polyFrames++;
        this.monoFrames = 0;
        if (this.polyFrames >= POLY_TO_CHORD_FRAMES) store.setMode('chord');
      } else {
        this.monoFrames++;
        this.polyFrames = 0;
        if (this.monoFrames >= POLY_TO_NOTE_FRAMES) store.setMode('note');
      }
    }
  };

  // ─── Helpers ───────────────────────────────────────────────────

  private closestString(freq: number, preset: TuningPreset, a4: number): number {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < preset.notes.length; i++) {
      const d = Math.abs(1200 * Math.log2(freq / noteToFreq(preset.notes[i], a4)));
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  private resetSilenceTimer() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.silenceTimer = setTimeout(() => {
      useDetectionStore.getState().reset();
    }, SILENCE_MS);
  }

  updateThreshold(threshold: number) {
    this.workletNode?.port.postMessage({ threshold });
  }

  stop(): void {
    if (this.silenceTimer) { clearTimeout(this.silenceTimer); this.silenceTimer = null; }
    if (this.chromaTimer) { clearInterval(this.chromaTimer); this.chromaTimer = null; }
    if (this.workletNode) { this.workletNode.port.onmessage = null; this.workletNode.disconnect(); this.workletNode = null; }
    if (this.analyser) { this.analyser.disconnect(); this.analyser = null; }
    if (this.source) { this.source.disconnect(); this.source = null; }
    if (this.stream) { this.stream.getTracks().forEach((t) => t.stop()); this.stream = null; }
    if (this.context) { this.context.close(); this.context = null; }
    this.pitchFilter.reset();
    this.keyFinder.reset();
    useDetectionStore.getState().reset();
    this.running = false;
  }

  isRunning() { return this.running; }
}

export const audioEngine = new AudioEngine();
