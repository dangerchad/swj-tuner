interface Props {
  cents: number;
  isActive: boolean;
}

const RANGE = 50;

export default function StrobeMeter({ cents, isActive }: Props) {
  const clamped = Math.max(-RANGE, Math.min(RANGE, cents));
  const pct = ((clamped + RANGE) / (RANGE * 2)) * 100;

  let thumbColor = 'var(--color-text-3)';
  if (isActive) {
    if (Math.abs(cents) <= 4) {
      thumbColor = 'var(--color-accent)';
    } else if (cents < 0) {
      thumbColor = 'var(--color-loosen)';
    } else {
      thumbColor = 'var(--color-tighten)';
    }
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
        {/* center tick */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: '50%', background: 'var(--color-border-strong)' }}
        />
        {/* needle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-4 rounded-full"
          style={{
            left: `${pct}%`,
            marginLeft: '-2px',
            background: thumbColor,
            transition: 'left 0.08s ease-out, background 0.15s',
          }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-3)' }}>
        <span className="font-mono">-50</span>
        <span className="font-mono">0</span>
        <span className="font-mono">+50</span>
      </div>
    </div>
  );
}
