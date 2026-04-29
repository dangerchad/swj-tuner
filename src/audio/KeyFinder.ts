// Krumhansl-Schmuckler key finding.
// Accumulates chroma vectors over time, then correlates against K-S profiles.

const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// Krumhansl-Schmuckler 1982 tonal hierarchy profiles
const KS_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const KS_MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

function rotate(arr: number[], n: number): number[] {
  const r = ((n % 12) + 12) % 12;
  return [...arr.slice(r), ...arr.slice(0, r)];
}

function pearson(a: number[], b: number[]): number {
  const n = a.length;
  const meanA = a.reduce((s, x) => s + x, 0) / n;
  const meanB = b.reduce((s, x) => s + x, 0) / n;
  let num = 0, denA = 0, denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const denom = Math.sqrt(denA * denB);
  return denom < 1e-9 ? 0 : num / denom;
}

export class KeyFinder {
  private history: number[][] = [];
  private readonly historySize: number;

  constructor(historySize = 40) {
    this.historySize = historySize;
  }

  addChroma(chroma: number[]): string {
    this.history.push(chroma);
    if (this.history.length > this.historySize) this.history.shift();
    return this.findKey();
  }

  private findKey(): string {
    if (this.history.length < 8) return '';

    // Average chroma over history
    const avg = new Array(12).fill(0);
    for (const frame of this.history) {
      for (let i = 0; i < 12; i++) avg[i] += frame[i];
    }
    for (let i = 0; i < 12; i++) avg[i] /= this.history.length;

    let bestKey = '';
    let bestScore = -Infinity;

    for (let root = 0; root < 12; root++) {
      const majorScore = pearson(avg, rotate(KS_MAJOR, root));
      if (majorScore > bestScore) {
        bestScore = majorScore;
        bestKey = `${NOTE_NAMES[root]} major`;
      }
      const minorScore = pearson(avg, rotate(KS_MINOR, root));
      if (minorScore > bestScore) {
        bestScore = minorScore;
        bestKey = `${NOTE_NAMES[root]} minor`;
      }
    }

    return bestKey;
  }

  reset(): void {
    this.history = [];
  }
}
