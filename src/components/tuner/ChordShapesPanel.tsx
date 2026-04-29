import { useState } from 'react';
import type { TuningPreset } from '../../data/presets';
import { getChordsForTuning } from '../../data/chordTemplates';
import ChordDiagram from '../shared/ChordDiagram';

interface Props {
  preset: TuningPreset;
  detectedChord?: string;
}

export default function ChordShapesPanel({ preset, detectedChord }: Props) {
  const [open, setOpen] = useState(false);
  const chords = getChordsForTuning(preset.id);
  if (!chords.length) return null;

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs"
        style={{ color: 'var(--color-text-3)' }}
      >
        <span>Shapes</span>
        <span style={{ fontSize: 9 }}>{open ? '▴' : '▾'}</span>
        <span style={{ color: 'var(--color-border-strong)', marginLeft: 4 }}>{preset.name}</span>
      </button>

      {open && (
        <div
          className="flex gap-4 overflow-x-auto pb-2 mt-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {chords.map((chord) => (
            <div key={chord.name} className="flex-none">
              <ChordDiagram
                chord={chord}
                active={!!detectedChord && detectedChord.toLowerCase() === chord.name.toLowerCase()}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
