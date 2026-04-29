import { useCallback, useEffect, useRef, useState } from 'react';
import { useTunerStore } from '../../state/tunerStore';
import { useDetectionStore } from '../../state/detectionStore';
import { usePracticeStore, todayStr } from '../../state/practiceStore';
import { audioEngine } from '../../audio/AudioEngine';
import PresetGrid from './PresetGrid';
import BigNoteDisplay from './BigNoteDisplay';
import TighteningArrow from './TighteningArrow';
import StrobeMeter from './StrobeMeter';
import StringSelector from './StringSelector';
import CapoBar from './CapoBar';
import ModePills from './ModePills';
import ChordShapesPanel from './ChordShapesPanel';
import ChordDisplay from '../chord/ChordDisplay';
import ChordHistory from '../chord/ChordHistory';
import StartStopButton from '../shared/StartStopButton';
import PrivacyBadge from '../shared/PrivacyBadge';

function getTuneState(cents: number, isListening: boolean, noteName: string): 'flat' | 'sharp' | 'tuned' | 'idle' {
  if (!isListening || !noteName) return 'idle';
  if (Math.abs(cents) <= 4) return 'tuned';
  return cents < 0 ? 'flat' : 'sharp';
}

export default function TunerView() {
  const { preset, activeStringIndex, isListening, setPreset, setActiveString, setListening } = useTunerStore();
  const {
    noteName, noteOctave, frequency, cents,
    chord, chordHistory, key,
    mode, setModeManual,
  } = useDetectionStore();

  const addLog = usePracticeStore((s) => s.addLog);
  const [micError, setMicError] = useState<string | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const startedAtRef = useRef(0);
  const wasListening = useRef(false);

  useEffect(() => {
    if (!isListening) {
      if (wasListening.current && elapsedRef.current >= 30) {
        addLog({
          id: Date.now().toString(),
          date: todayStr(),
          startedAt: startedAtRef.current,
          duration: elapsedRef.current,
          notes: '',
          songs: [],
          links: [],
        });
        setSessionSaved(true);
        setTimeout(() => setSessionSaved(false), 4000);
      }
      elapsedRef.current = 0;
      setElapsed(0);
      wasListening.current = false;
      return;
    }
    wasListening.current = true;
    startedAtRef.current = Date.now();
    const id = setInterval(() => { elapsedRef.current += 1; setElapsed(elapsedRef.current); }, 1000);
    return () => clearInterval(id);
  }, [isListening, addLog]);

  const tuneState = getTuneState(cents, isListening, noteName);

  const handleToggle = useCallback(async () => {
    if (isListening) {
      audioEngine.stop();
      setListening(false);
      setMicError(null);
    } else {
      setMicError(null);
      try {
        await audioEngine.start();
        setListening(true);
      } catch (err) {
        setListening(false);
        const name = (err as Error)?.name ?? '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setMicError('Mic access denied — allow it in your browser settings.');
        } else if (name === 'NotFoundError') {
          setMicError('No microphone found.');
        } else {
          setMicError('Could not start microphone.');
        }
      }
    }
  }, [isListening, setListening]);

  return (
    <>
      {/* Scrollable content — pb-28 so fixed button doesn't overlap */}
      <div className="flex flex-col gap-3 p-4 w-full max-w-lg mx-auto pb-28">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="font-mono text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
            Gary's Tuner
          </h1>
          <div className="flex items-center gap-3">
            {isListening && elapsed > 0 && (
              <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
                {String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}
              </span>
            )}
            <PrivacyBadge />
          </div>
        </div>

        {/* Preset strip */}
        <PresetGrid activePreset={preset} onSelect={setPreset} />

        {/* Chord shapes (collapsed toggle) */}
        <ChordShapesPanel preset={preset} detectedChord={chord} />

        {/* Capo reminder */}
        <CapoBar capo={preset.capo} />

        {/* String selector */}
        <StringSelector
          preset={preset}
          activeIndex={activeStringIndex}
          isTuned={tuneState === 'tuned'}
          onSelect={setActiveString}
        />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border)' }} />

        {/* Mode pills */}
        <ModePills mode={mode} onModeChange={setModeManual} />

        {/* ── Note mode ── */}
        {mode === 'note' && (
          <>
            <BigNoteDisplay
              noteName={noteName}
              octave={noteOctave}
              frequency={frequency}
              isListening={isListening}
            />
            <TighteningArrow state={tuneState} cents={cents} />
            <StrobeMeter cents={cents} isActive={isListening && !!noteName} />
          </>
        )}

        {/* ── Chord mode ── */}
        {mode === 'chord' && (
          <>
            <ChordDisplay chord={chord} isListening={isListening} />
            <ChordHistory history={chordHistory} current={chord} />
            {key && isListening && (
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Key</span>
                <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>
                  {key}
                </span>
              </div>
            )}
          </>
        )}

        {micError && (
          <p className="text-xs text-center" style={{ color: 'var(--color-tighten)' }}>{micError}</p>
        )}
        {sessionSaved && (
          <p className="text-xs text-center" style={{ color: 'var(--color-accent)' }}>Session saved to Practice tab</p>
        )}
      </div>

      {/* Fixed Start/Stop — always visible above nav */}
      <div
        className="fixed left-0 right-0 flex justify-center items-end pb-3 pt-6"
        style={{
          bottom: '48px',
          background: 'linear-gradient(to bottom, transparent, var(--color-bg) 55%)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <StartStopButton isListening={isListening} onToggle={handleToggle} />
        </div>
      </div>
    </>
  );
}
