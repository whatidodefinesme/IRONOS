import { useMemo, useCallback } from 'react';

export const useSound = (soundUrl: string, volume: number = 1.0) => {
  const audio = useMemo(() => {
    if (typeof Audio !== 'undefined') {
      try {
        const a = new Audio(soundUrl);
        a.volume = volume;
        return a;
      } catch (error) {
        console.error("Error creating audio object:", error);
        return null;
      }
    }
    return null;
  }, [soundUrl, volume]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.error("Error playing sound:", e);
        }
      });
    }
  }, [audio]);

  return play;
};
