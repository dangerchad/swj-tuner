export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto w-full">
      <h2 className="font-mono text-xl" style={{ color: 'var(--color-text-1)' }}>About</h2>

      <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
        SWJ Tuner is a precision guitar tuner built for learning Stephen Wilson Jr.'s catalog.
        It supports all 10 open tunings from his confirmed live and studio performances.
      </p>

      <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-1)' }}>
        <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-1)' }}>Privacy</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-2)' }}>
          Microphone audio is processed entirely on your device. Nothing is recorded,
          stored remotely, or transmitted. No analytics. No accounts.
        </p>
      </div>

      <div className="text-xs" style={{ color: 'var(--color-text-3)' }}>
        <p>Pitch detection: pitchy (McLeod Pitch Method)</p>
        <p>Music theory: Tonal.js</p>
        <p>Built for Stephen Wilson Jr. fans</p>
      </div>
    </div>
  );
}
