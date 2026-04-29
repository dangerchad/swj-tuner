export const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
// Enharmonic display names (prefer flats for certain keys)
export const NOTE_DISPLAY = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

export function noteToFreq(note: string, a4 = 440): number {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 0;
  const [, name, octStr] = match;
  const oct = parseInt(octStr, 10);
  const semitone = NOTE_NAMES.indexOf(name);
  if (semitone === -1) return 0;
  const midi = (oct + 1) * 12 + semitone;
  return a4 * Math.pow(2, (midi - 69) / 12);
}

export function freqToNote(freq: number, a4 = 440): { note: string; octave: number; cents: number } {
  if (freq <= 0) return { note: '', octave: 0, cents: 0 };
  const midi = 12 * Math.log2(freq / a4) + 69;
  const midiRounded = Math.round(midi);
  const cents = Math.round((midi - midiRounded) * 100);
  const octave = Math.floor(midiRounded / 12) - 1;
  const note = NOTE_NAMES[((midiRounded % 12) + 12) % 12];
  return { note, octave, cents };
}

export function centsFromTarget(freq: number, targetNote: string, a4 = 440): number {
  const targetFreq = noteToFreq(targetNote, a4);
  if (targetFreq === 0 || freq === 0) return 0;
  return Math.round(1200 * Math.log2(freq / targetFreq));
}

// Parse "C2", "F#3", "G#3" → pitch class 0-11
export function noteNameToPC(noteStr: string): number {
  const match = noteStr.match(/^([A-G]#?b?)/);
  if (!match) return -1;
  const idx = NOTE_NAMES.indexOf(match[1]);
  return idx;
}

// "C major" → [0,2,4,5,7,9,11],  "A minor" → [9,11,0,2,4,5,7]
export function getScalePCs(key: string): number[] {
  if (!key) return [];
  const parts = key.trim().split(' ');
  if (parts.length < 2) return [];
  const root = NOTE_NAMES.indexOf(parts[0]);
  if (root === -1) return [];
  const intervals = parts[1] === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
  return intervals.map((i) => (root + i) % 12);
}

// "C major" → 0
export function getKeyRoot(key: string): number {
  if (!key) return -1;
  return NOTE_NAMES.indexOf(key.trim().split(' ')[0]);
}

// Pitch class → display name (prefers flats for b/bb roots)
export function pcToName(pc: number, preferFlat = false): string {
  return preferFlat ? NOTE_DISPLAY[pc] : NOTE_NAMES[pc];
}

export function noteWithOctave(note: string, octave: number): string {
  return `${note}${octave}`;
}
