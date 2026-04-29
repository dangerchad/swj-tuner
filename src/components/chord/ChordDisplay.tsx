import { AnimatePresence, motion } from 'framer-motion';
import type { ChordQuality } from '../../audio/ChordDetector';

interface Props {
  chord: string;
  isListening: boolean;
}

const SUFFIX: Record<ChordQuality, string> = {
  maj:  '',
  min:  'm',
  maj7: 'maj7',
  min7: 'm7',
  dom7: '7',
  sus2: 'sus2',
  sus4: 'sus4',
};

function parseChord(name: string): { root: string; suffix: string } {
  const parts = name.split(' ');
  const root = parts[0] ?? '';
  const quality = (parts[1] ?? '') as ChordQuality;
  return { root, suffix: SUFFIX[quality] ?? quality };
}

export default function ChordDisplay({ chord, isListening }: Props) {
  const hasChord = !!chord && isListening;
  const { root, suffix } = hasChord ? parseChord(chord) : { root: '--', suffix: '' };

  return (
    <div className="flex flex-col items-center gap-2 min-h-28">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={hasChord ? chord : '__idle'}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-baseline gap-1"
        >
          <span
            className="font-mono font-bold leading-none"
            style={{
              fontSize: '72px',
              color: hasChord ? 'var(--color-text-1)' : 'var(--color-surface-3)',
              letterSpacing: '-1px',
            }}
          >
            {root}
          </span>
          {hasChord && suffix && (
            <span
              className="font-mono text-2xl font-medium"
              style={{ color: 'var(--color-text-2)', marginBottom: '8px' }}
            >
              {suffix}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
