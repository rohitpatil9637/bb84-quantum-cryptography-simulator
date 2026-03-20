/**
 * @file Alice.jsx
 * @description Alice's qubit preparation panel.
 */
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { getPolarizationInfo } from '../../utils/quantum';

const PHASE_VIS = { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true };

/**
 * Alice component showing her bits, bases and encoded photon polarizations.
 * @param {{ result: object, phase: number, numQubits: number }} props
 */
export default function Alice({ result, phase, numQubits }) {
  const visible = PHASE_VIS[phase];

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 glow-blue">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-quantum-blue/20 border border-quantum-blue/40 flex items-center justify-center">
          <span className="text-quantum-blue font-bold text-lg">A</span>
        </div>
        <div>
          <h2 className="font-sans font-bold text-white text-lg leading-none">Alice</h2>
          <p className="text-xs text-white/40 mt-0.5">Qubit Sender</p>
        </div>
        <div className="ml-auto">
          <span className="phase-badge bg-quantum-blue/10 text-quantum-blue border border-quantum-blue/30">
            Quantum Blue
          </span>
        </div>
      </div>

      {!visible && (
        <div className="text-center text-white/30 text-sm py-4">
          Waiting to start simulation...
        </div>
      )}

      {visible && result && (
        <div className="flex flex-col gap-3">
          {/* Bits row */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Random Bits</p>
            <div className="flex flex-wrap gap-1.5">
              {result.aliceBits.slice(0, numQubits).map((bit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  className={`bit-cell text-xs font-mono ${
                    bit === 0
                      ? 'bg-quantum-blue/15 border border-quantum-blue/40 text-quantum-blue'
                      : 'bg-quantum-green/15 border border-quantum-green/40 text-quantum-green'
                  }`}
                >
                  {bit}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bases row */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Random Bases</p>
            <div className="flex flex-wrap gap-1.5">
              {result.aliceBases.slice(0, numQubits).map((basis, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 + 0.1, duration: 0.2 }}
                  className={`bit-cell text-base ${
                    basis === '+'
                      ? 'bg-quantum-blue/10 border border-quantum-blue/30 text-quantum-blue'
                      : 'bg-quantum-purple/10 border border-quantum-purple/30 text-purple-400'
                  }`}
                  title={basis === '+' ? 'Rectilinear' : 'Diagonal'}
                >
                  {basis === '+' ? '⊕' : '⊗'}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Polarizations */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Photon Polarizations</p>
            <div className="flex flex-wrap gap-1.5">
              {result.aliceBits.slice(0, numQubits).map((bit, i) => {
                const info = getPolarizationInfo(bit, result.aliceBases[i]);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 + 0.2, duration: 0.25, type: 'spring' }}
                    className="bit-cell text-base"
                    style={{ color: info.color, borderColor: info.color + '44', backgroundColor: info.color + '15' }}
                    title={`${info.label} (bit=${bit}, basis=${result.aliceBases[i]})`}
                  >
                    {info.symbol}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sifted key section (phase 4+) */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 rounded-xl bg-quantum-blue/5 border border-quantum-blue/20"
            >
              <p className="text-xs text-quantum-blue/70 uppercase tracking-widest mb-2">Alice's Sifted Key</p>
              <div className="flex flex-wrap gap-1">
                {result.aliceSifted.map((bit, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="font-mono text-xs px-1.5 py-0.5 rounded bg-quantum-blue/20 text-quantum-blue border border-quantum-blue/30"
                  >
                    {bit}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

Alice.propTypes = {
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
  numQubits: PropTypes.number.isRequired,
};
