export default function PrivacyBadge() {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded text-xs"
      style={{ color: 'var(--color-text-3)', background: 'var(--color-surface-1)' }}
    >
      <span>&#x1F512;</span>
      <span>mic stays on your device</span>
    </div>
  );
}
