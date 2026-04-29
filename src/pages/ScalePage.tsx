import { useDetectionStore } from '../state/detectionStore';
import { useTunerStore } from '../state/tunerStore';
import ScaleWheel from '../components/scale/ScaleWheel';
import KeyDisplay from '../components/scale/KeyDisplay';
import StartStopButton from '../components/shared/StartStopButton';
import { audioEngine } from '../audio/AudioEngine';
import { useCallback } from 'react';

export default function ScalePage() {
  const { chroma, key } = useDetectionStore();
  const { isListening, setListening } = useTunerStore();

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
    <div className="flex flex-col items-center gap-6 p-4 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between w-full pt-2">
        <h2 className="font-mono text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
          Scale / Key
        </h2>
      </div>

      <ScaleWheel keyName={key} chroma={chroma} />

      <KeyDisplay keyName={key} />

      {!isListening && (
        <p className="text-sm text-center" style={{ color: 'var(--color-text-3)' }}>
          Start the tuner and play in any key — the wheel updates live.
        </p>
      )}

      <div className="flex justify-center pt-2">
        <StartStopButton isListening={isListening} onToggle={handleToggle} />
      </div>
    </div>
  );
}
