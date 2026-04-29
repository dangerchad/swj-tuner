import { useSettingsStore } from '../state/settingsStore';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function SettingsPage() {
  const { a4, clarityThreshold, setA4, setClarityThreshold } = useSettingsStore();
  const { canInstall, install } = useInstallPrompt();

  return (
    <div className="flex flex-col gap-8 p-6 max-w-md mx-auto w-full">
      <h2 className="font-mono text-base font-bold" style={{ color: 'var(--color-text-1)' }}>Settings</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm" style={{ color: 'var(--color-text-2)' }}>
          A4 reference — {a4} Hz
        </label>
        <input
          type="range"
          min={415}
          max={466}
          step={1}
          value={a4}
          onChange={(e) => setA4(Number(e.target.value))}
          className="w-full accent-[#4ADE80]"
        />
        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-3)' }}>
          <span>415 Hz</span>
          <span>466 Hz</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm" style={{ color: 'var(--color-text-2)' }}>
          Sensitivity — {Math.round(clarityThreshold * 100)}%
        </label>
        <input
          type="range"
          min={0.7}
          max={0.98}
          step={0.01}
          value={clarityThreshold}
          onChange={(e) => setClarityThreshold(Number(e.target.value))}
          className="w-full accent-[#4ADE80]"
        />
        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-3)' }}>
          <span>More sensitive</span>
          <span>Less noise</span>
        </div>
      </div>

      <button
        onClick={() => { setA4(440); setClarityThreshold(0.85); }}
        className="text-sm py-2 px-4 rounded border self-start"
        style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-2)' }}
      >
        Reset to defaults
      </button>

      {canInstall && (
        <div
          className="flex items-center justify-between p-4 rounded-xl border"
          style={{ borderColor: 'rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.06)' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-1)' }}>
              Add to Home Screen
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
              Works offline, no app store needed
            </p>
          </div>
          <button
            onClick={install}
            className="text-xs font-mono px-3 py-1.5 rounded border ml-4"
            style={{ color: 'var(--color-accent)', borderColor: 'rgba(74,222,128,0.4)' }}
          >
            Install
          </button>
        </div>
      )}

      <div
        className="pt-4 border-t flex flex-col gap-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>About</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
          Gary's Tuner is a precision guitar tuner built for learning Stephen Wilson Jr.'s catalog.
          Supports all 10 open tunings from his confirmed live and studio performances.
        </p>
        <div
          className="p-3 rounded-lg border"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-1)' }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-2)' }}>Privacy</p>
          <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
            Mic audio is processed entirely on device. Nothing recorded, stored, or transmitted. No analytics.
          </p>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>
          Pitch: pitchy (McLeod Method) · Key/chord: custom HPCP + K-S
        </p>
      </div>
    </div>
  );
}
