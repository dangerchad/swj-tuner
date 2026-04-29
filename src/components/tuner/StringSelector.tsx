import type { TuningPreset } from '../../data/presets';

interface Props {
  preset: TuningPreset;
  activeIndex: number;
  isTuned: boolean;
  onSelect: (index: number) => void;
}

export default function StringSelector({ preset, activeIndex, isTuned, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <p className="text-xs mb-1" style={{ color: 'var(--color-text-3)' }}>Strings</p>
      <div className="flex gap-1.5 justify-between">
        {preset.notes.map((note, i) => {
          const active = i === activeIndex;
          const tuned = active && isTuned;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className="flex-1 flex flex-col items-center py-2 rounded-lg border transition-all duration-150 relative"
              style={{
                background: active ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                borderColor: tuned
                  ? 'var(--color-accent)'
                  : active
                  ? 'var(--color-border-strong)'
                  : 'var(--color-border)',
              }}
            >
              {tuned && (
                <div
                  className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-accent)' }}
                />
              )}
              <span
                className="font-mono text-sm font-medium"
                style={{ color: tuned ? 'var(--color-accent)' : active ? 'var(--color-text-1)' : 'var(--color-text-2)' }}
              >
                {note.replace(/\d/, '')}
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)' }}>
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
