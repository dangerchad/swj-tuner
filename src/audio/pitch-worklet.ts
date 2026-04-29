// @ts-nocheck
// Runs in AudioWorklet scope — TypeScript DOM types don't cover AudioWorklet globals.
// Vite bundles this (including pitchy) via ?worker&url.

import { PitchDetector } from 'pitchy';

class PitchProcessor extends AudioWorkletProcessor {
  _detector;
  _buffer;
  _index = 0;
  _threshold = 0.85;

  constructor() {
    super();
    this._detector = PitchDetector.forFloat32Array(2048);
    this._buffer = new Float32Array(2048);
    this.port.onmessage = (e) => {
      if (e.data?.threshold !== undefined) this._threshold = e.data.threshold;
    };
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;

    for (let i = 0; i < input.length; i++) {
      this._buffer[this._index++] = input[i];
      if (this._index >= 2048) {
        const [pitch, clarity] = this._detector.findPitch(this._buffer, sampleRate);
        if (clarity > this._threshold && pitch > 30 && pitch < 1500) {
          this.port.postMessage({ pitch, clarity });
        }
        this._index = 0;
      }
    }
    return true;
  }
}

registerProcessor('pitch-processor', PitchProcessor);
