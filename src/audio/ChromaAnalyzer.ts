// Harmonic Pitch Class Profile (simplified chromagram).
// Maps FFT frequency bins to 12 pitch classes (C=0 … B=11).
// Runs on the main thread against AnalyserNode data — fast enough at 20fps.

const C0_FREQ = 16.352; // Hz

export function computeChroma(
  freqDataDb: Float32Array,
  sampleRate: number,
  fftSize: number,
  minFreq = 65,   // C2 — below this guitar fundamentals are rare
  maxFreq = 2093, // C7 — above this harmonic contribution is minor
  noiseFloor = -70, // dB
): number[] {
  const chroma = new Array(12).fill(0);
  const binWidth = sampleRate / fftSize;

  const minBin = Math.max(1, Math.ceil(minFreq / binWidth));
  const maxBin = Math.min(freqDataDb.length - 1, Math.floor(maxFreq / binWidth));

  for (let bin = minBin; bin <= maxBin; bin++) {
    const db = freqDataDb[bin];
    if (db < noiseFloor) continue;

    const linear = Math.pow(10, db / 20);
    const freq = bin * binWidth;

    // Pitch class from fundamental — consider harmonics 1..5
    for (let h = 1; h <= 5; h++) {
      const fundamental = freq / h;
      if (fundamental < minFreq) continue;
      const pc = Math.round(12 * Math.log2(fundamental / C0_FREQ));
      const idx = ((pc % 12) + 12) % 12;
      chroma[idx] += linear / h; // weight higher harmonics less
    }
  }

  // L2 normalize
  const norm = Math.sqrt(chroma.reduce((s, v) => s + v * v, 0));
  if (norm < 1e-6) return chroma;
  return chroma.map((v) => v / norm);
}

// Count how many pitch classes are prominently active.
// < 2 strong peaks → likely monophonic; ≥ 2 → polyphonic.
export function polyphonyScore(chroma: number[]): number {
  const max = Math.max(...chroma);
  if (max < 0.1) return 0;
  return chroma.filter((v) => v / max > 0.35).length;
}
