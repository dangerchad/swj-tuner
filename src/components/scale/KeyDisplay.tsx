import { getScalePCs } from '../../lib/musicTheory';
import { NOTE_DISPLAY } from '../../lib/musicTheory';

interface Props {
  keyName: string;
}

export default function KeyDisplay({ keyName }: Props) {
  const scalePCs = getScalePCs(keyName);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {keyName ? (
        <>
          <p className="font-mono text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>
            {keyName}
          </p>
          <div className="flex gap-1.5 flex-wrap justify-center">
            {scalePCs.map((pc, i) => (
              <span
                key={i}
                className="font-mono text-xs px-2 py-0.5 rounded border"
                style={{
                  color: i === 0 ? 'var(--color-accent)' : 'var(--color-text-2)',
                  borderColor: i === 0 ? 'var(--color-accent)' : 'var(--color-border)',
                  background: 'var(--color-surface-1)',
                }}
              >
                {NOTE_DISPLAY[pc]}
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
          Play in a key for 2-3 seconds to detect
        </p>
      )}
    </div>
  );
}
