/**
 * @file useSimulation.js
 * @description Animation state machine for auto-play simulation with speed control.
 */
import { useEffect, useRef, useCallback } from 'react';
import { PHASES } from './useBB84';

/** Speed presets in milliseconds per phase */
export const SPEED_PRESETS = {
  slow: 2500,
  normal: 1500,
  fast: 700,
  instant: 50,
};

/**
 * Hook that drives the automatic phase advancement.
 *
 * @param {object} params
 * @param {number} params.phase - Current phase.
 * @param {boolean} params.isRunning - Whether auto-play is active.
 * @param {number} params.speed - Ms between phases.
 * @param {Function} params.advancePhase - Function to advance to next phase.
 * @param {Function} params.setIsRunning - Set running state.
 * @param {Function} params.reset - Reset simulation.
 * @param {object} params.result - BB84 result (needed to check if ready).
 */
export function useSimulation({ phase, isRunning, speed, advancePhase, setIsRunning, reset, result }) {
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    if (phase === PHASES.FINAL) {
      setIsRunning(false);
      clearTimer();
      return;
    }

    timerRef.current = setTimeout(() => {
      advancePhase();
    }, speed);

    return () => clearTimer();
  }, [isRunning, phase, speed, advancePhase, setIsRunning, clearTimer]);

  const start = useCallback(() => {
    if (phase === PHASES.FINAL) {
      reset();
      setTimeout(() => setIsRunning(true), 50);
    } else {
      setIsRunning(true);
      if (phase === PHASES.IDLE) {
        advancePhase();
      }
    }
  }, [phase, reset, setIsRunning, advancePhase]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearTimer();
  }, [setIsRunning, clearTimer]);

  const stepForward = useCallback(() => {
    if (phase < PHASES.FINAL) {
      advancePhase();
    }
  }, [phase, advancePhase]);

  return { start, pause, stepForward };
}
