export interface ChordShape {
  name: string;
  frets: number[];   // per string, index 0 = lowest/thickest. -1=mute, 0=open, 1-22=fret
  barre?: number;    // fret number of full barre, if any
}

export interface TuningChords {
  tuningId: string;
  chords: ChordShape[];
}

// ─────────────────────────────────────────────────────────────────
// Chord shapes verified note-by-note against each open tuning.
// Convention: frets[0] = lowest string (thickest).
// ─────────────────────────────────────────────────────────────────

export const TUNING_CHORDS: TuningChords[] = [

  // ──────────────────────────────────────────────
  // Standard  E2 A2 D3 G3 B3 E4
  // ──────────────────────────────────────────────
  {
    tuningId: 'standard',
    chords: [
      { name: 'E',  frets: [0, 2, 2, 1, 0, 0] },
      { name: 'Em', frets: [0, 2, 2, 0, 0, 0] },
      { name: 'A',  frets: [-1, 0, 2, 2, 2, 0] },
      { name: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
      { name: 'D',  frets: [-1, -1, 0, 2, 3, 2] },
      { name: 'G',  frets: [3, 2, 0, 0, 0, 3] },
      { name: 'C',  frets: [-1, 3, 2, 0, 1, 0] },
      { name: 'F',  frets: [1, 3, 3, 2, 1, 1], barre: 1 },
    ],
  },

  // ──────────────────────────────────────────────
  // Drop D  D2 A2 D3 G3 B3 E4
  // Low string dropped E→D. Top 5 strings same as standard.
  // D power chord is now 3 open strings — the defining shape.
  // ──────────────────────────────────────────────
  {
    tuningId: 'drop-d',
    chords: [
      // D2,A2,D3,A3,D4,F#4 — D major across all 6 strings
      { name: 'D',  frets: [0, 0, 0, 2, 3, 2] },
      // D2,A2,D3 — D power chord
      { name: 'D5', frets: [0, 0, 0, -1, -1, -1] },
      // D2,A2,D3,A3,D4,F4 — D minor
      { name: 'Dm', frets: [0, 0, 0, 2, 3, 1] },
      // G2,D3,G3,B3,D4,G4 via barre-ish shape
      { name: 'G',  frets: [5, 5, 5, 4, 3, 3] },
      { name: 'C',  frets: [-1, 3, 2, 0, 1, 0] },
      { name: 'A',  frets: [-1, 0, 2, 2, 2, 0] },
      { name: 'Em', frets: [-1, 2, 2, 0, 0, 0] },
    ],
  },

  // ──────────────────────────────────────────────
  // Drop C  C2 A2 D3 G3 B3 E4
  // Low string dropped E→C. Top 5 same as standard.
  // ──────────────────────────────────────────────
  {
    tuningId: 'drop-c',
    chords: [
      // C2,C3,E3,G3,C4,E4 — C major with low C root
      { name: 'C',  frets: [0, 3, 2, 0, 1, 0] },
      // C2 alone — C power bass
      { name: 'C5', frets: [0, -1, -1, -1, -1, -1] },
      // G2,B2,D3,G3,B3,G4 — G major: C2+7=G2 for low root
      { name: 'G',  frets: [7, 2, 0, 0, 0, 3] },
      { name: 'D',  frets: [-1, 0, 0, 2, 3, 2] },
      { name: 'Am', frets: [-1, 0, 2, 2, 1, 0] },
      { name: 'Em', frets: [-1, 2, 2, 0, 0, 0] },
    ],
  },

  // ──────────────────────────────────────────────
  // Open C  C2 G2 C3 E3 G3 C4
  // All open = C major. Full barre = major chord at that position.
  // C(0) D(2) E(4) F(5) G(7) A(9)
  // ──────────────────────────────────────────────
  {
    tuningId: 'cgcegc',
    chords: [
      // All open — C2,G2,C3,E3,G3,C4 = C major
      { name: 'C',  frets: [0, 0, 0, 0, 0, 0] },
      // Barre 2 — D2,A2,D3,F#3,A3,D4 = D major
      { name: 'D',  frets: [2, 2, 2, 2, 2, 2], barre: 2 },
      // Barre 4 — E2,B2,E3,G#3,B3,E4 = E major
      { name: 'E',  frets: [4, 4, 4, 4, 4, 4], barre: 4 },
      // Barre 5 — F2,C3,F3,A3,C4,F4 = F major
      { name: 'F',  frets: [5, 5, 5, 5, 5, 5], barre: 5 },
      // Barre 7 — G2,D3,G3,B3,D4,G4 = G major
      { name: 'G',  frets: [7, 7, 7, 7, 7, 7], barre: 7 },
      // Barre 9 — A2,E3,A3,C#4,E4,A4 = A major
      { name: 'A',  frets: [9, 9, 9, 9, 9, 9], barre: 9 },
      // _,A2,C3,E3,A3,C4 = A minor
      { name: 'Am', frets: [-1, 2, 0, 0, 2, 0] },
      // E2,B2,E3,E3,B3,E4 = E minor (B strings at 4, E strings open)
      { name: 'Em', frets: [4, 4, 4, 0, 4, 4] },
      // D2,A2,D3,F3,A3,D4 = D minor (E string pulled back 1 to F)
      { name: 'Dm', frets: [2, 2, 2, 1, 2, 2] },
    ],
  },

  // ──────────────────────────────────────────────
  // Open C · capo 1  (same shapes as Open C)
  // ──────────────────────────────────────────────
  {
    tuningId: 'cgcegc-c1',
    chords: [
      { name: 'C',  frets: [0, 0, 0, 0, 0, 0] },
      { name: 'D',  frets: [2, 2, 2, 2, 2, 2], barre: 2 },
      { name: 'F',  frets: [5, 5, 5, 5, 5, 5], barre: 5 },
      { name: 'G',  frets: [7, 7, 7, 7, 7, 7], barre: 7 },
      { name: 'Am', frets: [-1, 2, 0, 0, 2, 0] },
      { name: 'Em', frets: [4, 4, 4, 0, 4, 4] },
      { name: 'Dm', frets: [2, 2, 2, 1, 2, 2] },
    ],
  },

  // ──────────────────────────────────────────────
  // Open C · capo 4  (same shapes as Open C)
  // ──────────────────────────────────────────────
  {
    tuningId: 'cgcegc-c4',
    chords: [
      { name: 'C',  frets: [0, 0, 0, 0, 0, 0] },
      { name: 'F',  frets: [5, 5, 5, 5, 5, 5], barre: 5 },
      { name: 'G',  frets: [7, 7, 7, 7, 7, 7], barre: 7 },
      { name: 'Am', frets: [-1, 2, 0, 0, 2, 0] },
      { name: 'Em', frets: [4, 4, 4, 0, 4, 4] },
      { name: 'Dm', frets: [2, 2, 2, 1, 2, 2] },
    ],
  },

  // ──────────────────────────────────────────────
  // DFCFAD  D2 F2 C3 F3 A3 D4
  // All open = Dm7 (D,F,A,C). Barre system produces m7 quality.
  // Dm7(0) Em7(2) Fm7(3) Gm7(5) Am7(7) Cm7(10)
  // ──────────────────────────────────────────────
  {
    tuningId: 'dfcfad',
    chords: [
      // D2,F2,C3,F3,A3,D4 = Dm7
      { name: 'Dm7', frets: [0, 0, 0, 0, 0, 0] },
      // E2,G2,D3,G3,B3,E4 = Em7
      { name: 'Em7', frets: [2, 2, 2, 2, 2, 2], barre: 2 },
      // G2,Bb2,F3,Bb3,D4,G4 = Gm7
      { name: 'Gm7', frets: [5, 5, 5, 5, 5, 5], barre: 5 },
      // A2,C3,G3,C4,E4,A4 = Am7
      { name: 'Am7', frets: [7, 7, 7, 7, 7, 7], barre: 7 },
      // C3,Eb3,Bb3,Eb4,G4,C5 = Cm7 (at fret 10, shown as 10fr)
      { name: 'Cm7', frets: [10, 10, 10, 10, 10, 10], barre: 10 },
      // _,F2,C3,F3,A3,_ = F major (F,C,F,A without D root)
      { name: 'F',   frets: [-1, 0, 0, 0, 0, -1] },
    ],
  },

  // ──────────────────────────────────────────────
  // DFCFAD · capo 3  (same shapes)
  // ──────────────────────────────────────────────
  {
    tuningId: 'dfcfad-c3',
    chords: [
      { name: 'Dm7', frets: [0, 0, 0, 0, 0, 0] },
      { name: 'Em7', frets: [2, 2, 2, 2, 2, 2], barre: 2 },
      { name: 'Gm7', frets: [5, 5, 5, 5, 5, 5], barre: 5 },
      { name: 'Am7', frets: [7, 7, 7, 7, 7, 7], barre: 7 },
      { name: 'F',   frets: [-1, 0, 0, 0, 0, -1] },
    ],
  },

  // ──────────────────────────────────────────────
  // DFA♭FAD · capo 3  D2 F2 Ab3 F3 A3 D4
  // All open = Ddim-flavored (D,F,Ab,A) — dark, ambiguous.
  // Barre system shifts the whole cluster chromatically.
  // ──────────────────────────────────────────────
  {
    tuningId: 'dfafad-c3',
    chords: [
      // Open cluster — D,F,Ab,F,A,D (Dm♭5 / half-dim flavor)
      { name: 'open', frets: [0, 0, 0, 0, 0, 0] },
      // Barre 2: E,G,Bb,G,B,E = Em7♭5
      { name: '+2',   frets: [2, 2, 2, 2, 2, 2], barre: 2 },
      // Barre 4: F#,A,C,A,C#,F# = F#dim-ish
      { name: '+4',   frets: [4, 4, 4, 4, 4, 4], barre: 4 },
      // Barre 5: G,Bb,Db,Bb,D,G = Gm♭5
      { name: '+5',   frets: [5, 5, 5, 5, 5, 5], barre: 5 },
    ],
  },

  // ──────────────────────────────────────────────
  // BF#BF#F#B  B1 F#2 B2 F#3 F#3 B3
  // All open = B5 (B and F# only — no 3rd). Drone-based tuning.
  // Barre system produces 5th chords (power chords).
  // ──────────────────────────────────────────────
  {
    tuningId: 'bfsharp',
    chords: [
      // B1,F#2,B2,F#3,F#3,B3 = B5
      { name: 'B5',  frets: [0, 0, 0, 0, 0, 0] },
      // B1,F#2,D#3,F#3,F#3,D#4 = B major (B strings fretted to D#)
      { name: 'B',   frets: [0, 0, 4, 0, 0, 4] },
      // C#2,G#2,C#3,G#3,G#3,C#4 = C#5
      { name: 'C#5', frets: [2, 2, 2, 2, 2, 2], barre: 2 },
      // D2,A2,D3,A3,A3,D4 = D5
      { name: 'D5',  frets: [3, 3, 3, 3, 3, 3], barre: 3 },
      // E2,B2,E3,B3,B3,E4 = E5
      { name: 'E5',  frets: [5, 5, 5, 5, 5, 5], barre: 5 },
      // E2,G#2,E3,G#3,G#3,E4 = E major
      { name: 'E',   frets: [5, 2, 5, 2, 2, 5] },
      // F#2,C#3,F#3,C#4,C#4,F#4 = F#5
      { name: 'F#5', frets: [7, 7, 7, 7, 7, 7], barre: 7 },
      // B1,G#2,B2,G#3,G#3,D#4 = G#m
      { name: 'G#m', frets: [0, 2, 0, 2, 2, 4] },
    ],
  },
];

export function getChordsForTuning(tuningId: string): ChordShape[] {
  return TUNING_CHORDS.find((t) => t.tuningId === tuningId)?.chords ?? [];
}
