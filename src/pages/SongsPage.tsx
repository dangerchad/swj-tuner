import { useNavigate } from 'react-router-dom';
import { SONG_CATALOG } from '../data/songCatalog';
import { useTunerStore } from '../state/tunerStore';
import type { TuningPreset } from '../data/presets';

function tuningTag(preset: TuningPreset): string {
  if (preset.capo) return `${preset.name.split('·')[0].trim()} · capo ${preset.capo}`;
  return preset.name;
}

export default function SongsPage() {
  const navigate = useNavigate();
  const setPreset = useTunerStore((s) => s.setPreset);

  function handleSelect(preset: TuningPreset) {
    setPreset(preset);
    navigate('/');
  }

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      <div className="px-4 pt-5 pb-3">
        <h2 className="font-mono text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
          Songs
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
          {SONG_CATALOG.length} songs — tap to switch tuning
        </p>
      </div>

      <div className="flex flex-col">
        {SONG_CATALOG.map(({ title, preset }) => (
          <button
            key={title}
            onClick={() => handleSelect(preset)}
            className="flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-100 active:opacity-60"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div className="flex flex-col gap-0.5 min-w-0 pr-3">
              <span
                className="font-sans text-sm font-medium truncate"
                style={{ color: 'var(--color-text-1)' }}
              >
                {title}
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--color-text-3)' }}
              >
                {preset.tuningLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-none">
              <span
                className="font-mono text-xs px-2 py-0.5 rounded border"
                style={{
                  color: 'var(--color-accent)',
                  borderColor: 'rgba(74,222,128,0.25)',
                  background: 'rgba(74,222,128,0.06)',
                  whiteSpace: 'nowrap',
                }}
              >
                {tuningTag(preset)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
