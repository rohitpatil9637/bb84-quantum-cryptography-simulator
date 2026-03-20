/**
 * @file Bob.jsx
 * @description Bob's measurement panel showing his bases, measured bits, and sifted key.
 */
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { getPolarizationInfo } from '../../utils/quantum';

/**
 * Bob component showing his measurement bases and results.
 * @param {{ result: object, phase: number, numQubits: number }} props
 */
export default function Bob({ result, phase, numQubits }) {
  const showMeasure = phase >= 3;
  const showSifted = phase >= 4;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 glow-green">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-quantum-green/20 border border-quantum-green/40 flex items-center justify-center">
          <span className="text-quantum-green font-bold text-lg">B</span>
        </div>
        <div>
          <h2 className="font-sans font-bold text-white text-lg leading-none">Bob</h2>
          <p className="text-xs text-white/40 mt-0.5">Qubit Receiver</p>
        </div>
        <div className="ml-auto">
          <span className="phase-badge bg-quantum-green/10 text-quantum-green border border-quantum-green/30">
            Quantum Green
          </span>
        </div>
      </div>

      {!result && (
        <div className="text-center text-white/30 text-sm py-4">
          Waiting for photons...
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-3">
          {/* Bob's bases */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Random Measurement Bases</p>
            <div className="flex flex-wrap gap-1.5">
              {result.bobBases.slice(0, numQubits).map((basis, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  className={`bit-cell text-base ${
                    basis === '+'
                      ? 'bg-quantum-green/10 border border-quantum-green/30 text-quantum-green'
                      : 'bg-quantum-purple/10 border border-quantum-purple/30 text-purple-400'
                  }`}
                  title={basis === '+' ? 'Rectilinear' : 'Diagonal'}
                >
                  {basis === '+' ? '⊕' : '⊗'}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Basis match indicator */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Basis Match</p>
            <div className="flex flex-wrap gap-1.5">
              {result.bobBases.slice(0, numQubits).map((basis, i) => {
                const match = basis === result.aliceBases[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 + 0.1 }}
                    className={`bit-cell text-xs ${
                      match
                        ? 'bg-quantum-green/20 border border-quantum-green/50 text-quantum-green'
                        : 'bg-white/5 border border-white/10 text-white/25'
                    }`}
                    title={match ? 'Bases match — bit kept' : 'Bases mismatch — bit discarded'}
                  >
                    {match ? '✓' : '✗'}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Measured bits */}
          {showMeasure && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Measured Bits</p>
              <div className="flex flex-wrap gap-1.5">
                {result.bobBits.slice(0, numQubits).map((bit, i) => {
                  const info = getPolarizationInfo(bit, result.bobBases[i]);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.025, duration: 0.2 }}
                      className="bit-cell text-base"
                      style={{ color: info.color, borderColor: info.color + '44', backgroundColor: info.color + '15' }}
                      title={`Measured: ${bit} with basis ${result.bobBases[i]}`}
                    >
                      {info.symbol}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Sifted key (phase 4+) */}
          {showSifted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 rounded-xl bg-quantum-green/5 border border-quantum-green/20"
            >
              <p className="text-xs text-quantum-green/70 uppercase tracking-widest mb-2">Bob's Sifted Key</p>
              <div className="flex flex-wrap gap-1">
                {result.bobSifted.map((bit, i) => {
                  const match = bit === result.aliceSifted[i];
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={`font-mono text-xs px-1.5 py-0.5 rounded border ${
                        match
                          ? 'bg-quantum-green/20 text-quantum-green border-quantum-green/30'
                          : 'bg-quantum-red/20 text-quantum-red border-quantum-red/30'
                      }`}
                      title={match ? 'Bit matches Alice' : 'ERROR: Bit differs from Alice!'}
                    >
                      {bit}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

Bob.propTypes = {
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
  numQubits: PropTypes.number.isRequired,
};
