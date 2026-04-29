interface Props {
  history: string[];
  current: string;
}

export default function ChordHistory({ history, current }: Props) {
  if (!history.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {history.map((chord, i) => {
        const isCurrent = chord === current && i === 0;
        return (
          <span
            key={`${chord}-${i}`}
            className="font-mono text-xs px-2.5 py-1 rounded-full border"
            style={{
              background: isCurrent ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
              borderColor: isCurrent ? 'var(--color-border-strong)' : 'var(--color-border)',
              color: isCurrent ? 'var(--color-text-1)' : 'var(--color-text-3)',
            }}
          >
            {chord}
          </span>
        );
      })}
    </div>
  );
}
