export default function FretboardLegend() {
  const items = [
    { color: 'var(--color-accent)',  label: 'Root' },
    { color: 'var(--color-surface-3)', label: 'Scale tone', border: 'var(--color-border-strong)' },
    { color: 'var(--color-purple)',  label: 'Heard now' },
  ];

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {items.map(({ color, label, border }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full border"
            style={{ background: color, borderColor: border ?? color }}
          />
          <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
