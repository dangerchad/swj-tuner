export interface TuningPreset {
  id: string;
  name: string;
  tuningLabel: string;      // note-by-note string, shown as subtitle
  notes: string[];
  capo: number | null;
  songs: string[];
}

export const SWJ_PRESETS: TuningPreset[] = [
  { id: 'standard',    name: 'Standard',           tuningLabel: 'E A D G B E',         notes: ['E2','A2','D3','G3','B3','E4'], capo: null, songs: ['Year to Be Young 1994','Billy','Holler from the Holler','Hometown'] },
  { id: 'drop-d',     name: 'Drop D',              tuningLabel: 'D A D G B E',         notes: ['D2','A2','D3','G3','B3','E4'], capo: null, songs: ["Father's Son"] },
  { id: 'drop-c',     name: 'Drop C',              tuningLabel: 'C A D G B E',         notes: ['C2','A2','D3','G3','B3','E4'], capo: null, songs: ['Hang in There'] },
  { id: 'cgcegc',     name: 'Open C',              tuningLabel: 'C G C E G C',         notes: ['C2','G2','C3','E3','G3','C4'], capo: null, songs: ['Stand By Me','Gary'] },
  { id: 'cgcegc-c1',  name: 'Open C · capo 1',    tuningLabel: 'C G C E G C',         notes: ['C2','G2','C3','E3','G3','C4'], capo: 1,    songs: ["I'm A Song",'Calico Creek'] },
  { id: 'cgcegc-c4',  name: 'Open C · capo 4',    tuningLabel: 'C G C E G C',         notes: ['C2','G2','C3','E3','G3','C4'], capo: 4,    songs: ['Cuckoo'] },
  { id: 'dfcfad',     name: 'DFCFAD',              tuningLabel: 'D F C F A D',         notes: ['D2','F2','C3','F3','A3','D4'], capo: null, songs: ['The Devil'] },
  { id: 'dfcfad-c3',  name: 'DFCFAD · capo 3',   tuningLabel: 'D F C F A D',         notes: ['D2','F2','C3','F3','A3','D4'], capo: 3,    songs: ['Patches'] },
  { id: 'dfafad-c3',  name: 'DFA♭FAD · capo 3',  tuningLabel: 'D F A♭ F A D',       notes: ['D2','F2','G#3','F3','A3','D4'], capo: 3,   songs: ['Grief is Only Love'] },
  { id: 'bfsharp',    name: 'BF#BF#F#B',          tuningLabel: 'B F# B F# F# B',      notes: ['B1','F#2','B2','F#3','F#3','B3'], capo: null, songs: ['American Gothic'] },
];
