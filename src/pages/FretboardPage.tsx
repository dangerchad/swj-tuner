import { useDetectionStore } from '../state/detectionStore';
import { useTunerStore } from '../state/tunerStore';
import Fretboard from '../components/fretboard/Fretboard';
import FretboardLegend from '../components/fretboard/FretboardLegend';
import StartStopButton from '../components/shared/StartStopButton';
import { audioEngine } from '../audio/AudioEngine';
import { useCallback } from 'react';

export default function FretboardPage() {
  const { chroma, key } = useDetectionStore();
  const { preset, isListening, setListening } = useTunerStore();

  const handleToggle = useCallback(async () => {
    if (isListening) {
      audioEngine.stop();
      setListening(false);
    } else {
      try {
        await audioEngine.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  }, [isListening, setListening]);

  return (
    <div className="flex flex-col gap-5 p-4 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="font-mono text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
            Fretboard
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
            {preset.name} — {preset.tuningLabel}
          </p>
        </div>
      </div>

      {key && (
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Key</span>
          <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-text-2)' }}>{key}</span>
        </div>
      )}

      <div
        className="rounded-xl border p-3"
        style={{ background: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
      >
        <Fretboard preset={preset} keyName={key} chroma={chroma} />
      </div>

      <FretboardLegend />

      {!key && (
        <p className="text-sm text-center" style={{ color: 'var(--color-text-3)' }}>
          Play in a key for a few seconds — scale tones light up on the fretboard.
        </p>
      )}

      <div className="flex justify-center pt-2">
        <StartStopButton isListening={isListening} onToggle={handleToggle} />
      </div>
    </div>
  );
}
