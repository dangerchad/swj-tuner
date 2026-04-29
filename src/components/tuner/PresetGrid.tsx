import { SWJ_PRESETS } from '../../data/presets';
import type { TuningPreset } from '../../data/presets';

interface Props {
  activePreset: TuningPreset;
  onSelect: (preset: TuningPreset) => void;
}

export default function PresetGrid({ activePreset, onSelect }: Props) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Horizontal scroll strip */}
      <div
        className="flex gap-1.5 overflow-x-auto"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {SWJ_PRESETS.map((preset) => {
          const active = preset.id === activePreset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className="flex-none px-3 py-1.5 rounded-lg border transition-all duration-150"
              style={{
                background: active ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                borderColor: active ? 'var(--color-border-strong)' : 'var(--color-border)',
              }}
            >
              <span
                className="font-sans text-xs font-medium whitespace-nowrap"
                style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-2)' }}
              >
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active preset detail */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs" style={{ color: 'var(--color-text-3)', fontSize: '10px' }}>
          {activePreset.tuningLabel}
        </span>
        {activePreset.songs.length > 0 && (
          <span className="text-xs" style={{ color: 'var(--color-text-3)', fontSize: '10px' }}>
            · {activePreset.songs.slice(0, 2).join(', ')}
            {activePreset.songs.length > 2 ? ` +${activePreset.songs.length - 2}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
