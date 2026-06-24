import { useEffect, useRef, useCallback } from 'react';

export function usePolling(callback, intervalMs, enabled = true) {
  const savedCallback = useRef(callback);
  const isFetching = useRef(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const tick = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      await savedCallback.current();
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !intervalMs) return undefined;

    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs, tick]);
}
