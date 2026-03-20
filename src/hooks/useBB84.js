/**
 * @file useBB84.js
 * @description Core hook managing BB84 protocol state, simulation data, and Eve toggle.
 */
import { useState, useCallback } from 'react';
import { runBB84 } from '../utils/bb84';

export const PHASES = {
  IDLE: 0,
  PREPARE: 1,
  TRANSMIT: 2,
  MEASURE: 3,
  SIFT: 4,
  DETECT: 5,
  FINAL: 6,
};

const PHASE_NAMES = [
  'Idle',
  'Phase 1 — Alice Prepares Qubits',
  'Phase 2 — Quantum Transmission',
  'Phase 3 — Bob Measures',
  'Phase 4 — Basis Sifting',
  'Phase 5 — Eavesdropping Detection',
  'Phase 6 — Secret Key Generated',
];

const PHASE_DESCRIPTIONS = [
  '',
  'Alice randomly selects bits (0 or 1) and encoding bases (+ or ×). Each bit is encoded as a photon polarization state.',
  'Photons travel through the quantum channel. Eve may intercept and resend them using a random basis (intercept-resend attack).',
  'Bob randomly chooses measurement bases for each incoming photon. Wrong-basis measurements produce random results.',
  'Alice and Bob publicly compare their bases (not bits!) over a classical channel. Only matching-basis bits are kept.',
  'A subset of sifted key bits is publicly revealed to check for errors. Eve\'s interception causes ~25% error rate.',
  'The verified secret key is ready. Both Alice and Bob share identical bits that were never transmitted classically.',
];

/**
 * @typedef {Object} BB84State
 * @property {object|null} result - Full simulation result from runBB84()
 * @property {number} phase - Current protocol phase (0–6)
 * @property {boolean} eveActive - Whether Eve is eavesdropping
 * @property {number} numQubits - Number of qubits to simulate
 * @property {number[]} errorHistory - Error rate progression over phases
 * @property {string} phaseName - Human readable current phase name
 * @property {string} phaseDescription - Educational description of current phase
 */

/**
 * Main BB84 protocol state hook.
 * @param {number} [initialQubits=24] - Default qubit count.
 * @returns {BB84State & object} State and control functions.
 */
export function useBB84(initialQubits = 24) {
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [eveActive, setEveActive] = useState(false);
  const [numQubits, setNumQubits] = useState(initialQubits);
  const [errorHistory, setErrorHistory] = useState([]);
  const [activeQubitIndex, setActiveQubitIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const reset = useCallback(() => {
    setResult(null);
    setPhase(PHASES.IDLE);
    setErrorHistory([]);
    setActiveQubitIndex(-1);
    setIsRunning(false);
  }, []);

  const generateResult = useCallback(() => {
    const sim = runBB84({ numQubits, eveActive });
    setResult(sim);
    // Build error rate history: simulate progressive error accumulation
    const history = [];
    const n = sim.aliceSifted.length;
    for (let i = 1; i <= n; i++) {
      const partial = sim.aliceSifted.slice(0, i);
      const partialBob = sim.bobSifted.slice(0, i);
      const errors = partial.filter((b, idx) => b !== partialBob[idx]).length;
      history.push({
        qubit: i,
        errorRate: parseFloat(((errors / i) * 100).toFixed(1)),
        threshold: 11,
      });
    }
    setErrorHistory(history);
    return sim;
  }, [numQubits, eveActive]);

  const advancePhase = useCallback(() => {
    setPhase(prev => {
      if (prev === PHASES.IDLE) {
        generateResult();
        return PHASES.PREPARE;
      }
      if (prev < PHASES.FINAL) return prev + 1;
      return prev;
    });
  }, [generateResult]);

  const toggleEve = useCallback(() => {
    setEveActive(prev => !prev);
    reset();
  }, [reset]);

  return {
    result,
    phase,
    eveActive,
    numQubits,
    errorHistory,
    activeQubitIndex,
    isRunning,
    phaseName: PHASE_NAMES[phase],
    phaseDescription: PHASE_DESCRIPTIONS[phase],
    phases: PHASES,
    // Controls
    setPhase,
    setNumQubits,
    setActiveQubitIndex,
    setIsRunning,
    advancePhase,
    generateResult,
    toggleEve,
    reset,
  };
}
