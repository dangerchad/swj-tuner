// Chord detection via cosine-similarity template matching.
// 84 templates: 7 qualities × 12 chromatic roots.

const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

export type ChordQuality = 'maj' | 'min' | 'maj7' | 'min7' | 'dom7' | 'sus2' | 'sus4';

const QUALITIES: { quality: ChordQuality; intervals: number[] }[] = [
  { quality: 'maj',  intervals: [0, 4, 7]       },
  { quality: 'min',  intervals: [0, 3, 7]       },
  { quality: 'maj7', intervals: [0, 4, 7, 11]   },
  { quality: 'min7', intervals: [0, 3, 7, 10]   },
  { quality: 'dom7', intervals: [0, 4, 7, 10]   },
  { quality: 'sus2', intervals: [0, 2, 7]       },
  { quality: 'sus4', intervals: [0, 5, 7]       },
];

interface ChordTemplate {
  name: string;
  root: number;
  quality: ChordQuality;
  profile: number[];
  noteNames: string[];
}

function buildTemplates(): ChordTemplate[] {
  const templates: ChordTemplate[] = [];
  for (let root = 0; root < 12; root++) {
    for (const { quality, intervals } of QUALITIES) {
      const profile = new Array(12).fill(0);
      const noteNames: string[] = [];
      for (const interval of intervals) {
        const pc = (root + interval) % 12;
        profile[pc] = 1;
        noteNames.push(NOTE_NAMES[pc]);
      }
      templates.push({ name: `${NOTE_NAMES[root]} ${quality}`, root, quality, profile, noteNames });
    }
  }
  return templates;
}

const TEMPLATES = buildTemplates();

export interface ChordResult {
  name: string;
  root: number;
  quality: ChordQuality;
  noteNames: string[];
  confidence: number;
}

export function detectChord(chroma: number[], threshold = 0.65): ChordResult | null {
  let best: ChordResult | null = null;
  let bestScore = -1;

  const chromaNorm = Math.sqrt(chroma.reduce((s, v) => s + v * v, 0));
  if (chromaNorm < 0.05) return null;

  for (const t of TEMPLATES) {
    let dot = 0;
    let tNorm = 0;
    for (let i = 0; i < 12; i++) {
      dot += chroma[i] * t.profile[i];
      tNorm += t.profile[i] * t.profile[i];
    }
    const score = dot / (chromaNorm * Math.sqrt(tNorm));
    if (score > bestScore) {
      bestScore = score;
      best = { ...t, confidence: score };
    }
  }

  if (best && best.confidence >= threshold) return best;
  return null;
}
