interface Props {
  mode: 'note' | 'chord';
  onModeChange: (mode: 'note' | 'chord') => void;
}

export default function ModePills({ mode, onModeChange }: Props) {
  return (
    <div
      className="flex gap-1 p-1 rounded-full self-center"
      style={{ background: 'var(--color-surface-2)' }}
    >
      {(['note', 'chord'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onModeChange(m)}
          className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
          style={
            mode === m
              ? { background: 'var(--color-surface-3)', color: 'var(--color-text-1)' }
              : { color: 'var(--color-text-3)' }
          }
        >
          {m === 'note' ? 'Note' : 'Chord'}
        </button>
      ))}
    </div>
  );
}
