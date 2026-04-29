import { useEffect, useRef } from 'react';

type TuneState = 'flat' | 'sharp' | 'tuned' | 'idle';

interface Props {
  state: TuneState;
  cents: number;
}

export default function TighteningArrow({ state, cents }: Props) {
  const prevState = useRef<TuneState>('idle');

  useEffect(() => {
    if (state === 'tuned' && prevState.current !== 'tuned') {
      navigator.vibrate?.(40);
    }
    prevState.current = state;
  }, [state]);

  if (state === 'idle') {
    return <div className="min-h-20" />;
  }

  if (state === 'tuned') {
    return (
      <div className="flex items-center justify-center gap-3 min-h-20">
        <span className="font-mono text-4xl" style={{ color: 'var(--color-accent)' }}>✓</span>
        <span
          className="font-mono text-2xl font-bold tracking-widest"
          style={{
            color: 'var(--color-accent)',
            textShadow: '0 0 24px var(--color-accent-glow)',
          }}
        >
          IN TUNE
        </span>
      </div>
    );
  }

  const isFlat = state === 'flat';
  const color = isFlat ? 'var(--color-loosen)' : 'var(--color-tighten)';
  const word = isFlat ? 'TIGHTEN' : 'LOOSEN';
  const arrow = isFlat ? '↑' : '↓';
  const absCents = Math.abs(cents);

  return (
    <div className="flex items-center justify-center gap-4 min-h-20">
      <span className="font-mono text-5xl font-bold animate-pulse" style={{ color }}>
        {arrow}
      </span>
      <div className="flex flex-col items-start">
        <span className="font-mono text-2xl font-bold tracking-widest" style={{ color }}>
          {word}
        </span>
        <span className="font-mono text-sm" style={{ color }}>
          {absCents} cents {isFlat ? 'flat' : 'sharp'}
        </span>
      </div>
    </div>
  );
}
