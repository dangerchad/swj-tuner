import { SWJ_PRESETS } from '../../data/presets';
import type { TuningPreset } from '../../data/presets';

interface Props {
  activePreset: TuningPreset;
  onSelect: (preset: TuningPreset) => void;
}

export default function PresetGrid({ activePreset, onSelect }: Props) {
  return (
    <div className="w-full">
      <p className="text-xs mb-2" style={{ color: 'var(--color-text-3)' }}>Tuning</p>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {SWJ_PRESETS.map((preset) => {
          const active = preset.id === activePreset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className="flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-all duration-150"
              style={{
                background: active ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                borderColor: active ? 'var(--color-border-strong)' : 'var(--color-border)',
              }}
            >
              <span
                className="font-sans text-xs font-medium leading-tight"
                style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-1)' }}
              >
                {preset.name}
              </span>
              <span
                className="font-mono text-xs mt-0.5 leading-tight"
                style={{ color: 'var(--color-text-3)', fontSize: '10px' }}
              >
                {preset.tuningLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Songs for active preset */}
      {activePreset.songs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {activePreset.songs.map((song) => (
            <span
              key={song}
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                color: 'var(--color-text-3)',
                borderColor: 'var(--color-border)',
                background: 'var(--color-surface-1)',
              }}
            >
              {song}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
