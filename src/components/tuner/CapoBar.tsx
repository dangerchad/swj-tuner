interface Props {
  capo: number | null;
}

export default function CapoBar({ capo }: Props) {
  if (!capo) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-1)' }}
    >
      <span style={{ color: 'var(--color-purple)' }}>&#9670;</span>
      <span className="text-sm" style={{ color: 'var(--color-text-2)' }}>
        Place capo on fret {capo} after tuning
      </span>
    </div>
  );
}
