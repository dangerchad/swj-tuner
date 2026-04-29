import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  noteName: string;
  octave: number;
  frequency: number;
  isListening: boolean;
}

export default function BigNoteDisplay({ noteName, octave, frequency, isListening }: Props) {
  const hasNote = !!noteName && isListening;

  return (
    <div className="flex flex-col items-center gap-1 min-h-28">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={hasNote ? noteName : '__idle'}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-mono font-bold leading-none"
          style={{
            fontSize: '88px',
            color: hasNote ? 'var(--color-text-1)' : 'var(--color-surface-3)',
            letterSpacing: '-2px',
          }}
        >
          {hasNote ? noteName : '--'}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {hasNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-baseline gap-3"
          >
            <span className="font-mono text-sm" style={{ color: 'var(--color-text-3)' }}>
              {octave}
            </span>
            <span className="font-mono text-sm" style={{ color: 'var(--color-text-3)' }}>
              {frequency > 0 ? `${frequency.toFixed(1)} Hz` : ''}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
