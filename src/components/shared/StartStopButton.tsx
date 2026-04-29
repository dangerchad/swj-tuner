interface Props {
  isListening: boolean;
  onToggle: () => void;
}

export default function StartStopButton({ isListening, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="px-8 py-3 rounded-full text-sm font-medium transition-all duration-200"
      style={
        isListening
          ? {
              background: 'var(--color-surface-3)',
              color: 'var(--color-text-2)',
              border: '1px solid var(--color-border-strong)',
            }
          : {
              background: 'var(--color-accent)',
              color: '#0A0A0C',
              border: '1px solid transparent',
            }
      }
    >
      {isListening ? 'Stop' : 'Start tuning'}
    </button>
  );
}
