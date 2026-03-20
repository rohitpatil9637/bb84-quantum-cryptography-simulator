/**
 * @file KeyDisplay.jsx
 * @description Final verified secret key visualization with hex encoding.
 */
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { bitsToHex } from '../../utils/crypto';

/**
 * Final secret key display component.
 * @param {{ result: object, phase: number }} props
 */
export default function KeyDisplay({ result, phase }) {
  if (!result || phase < 6) return null;

  const { finalKey, aliceSample, bobSample, sampleSize, stats } = result;
  const hexKey = finalKey.length > 0 ? bitsToHex(finalKey) : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`glass rounded-2xl p-6 flex flex-col gap-5 ${
        stats.secure ? 'glow-green border-quantum-green/20' : 'glow-red border-quantum-red/20'
      }`}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className={`text-5xl mb-3 ${stats.secure ? '' : ''}`}
        >
          {stats.secure ? '🔐' : '⚠️'}
        </motion.div>
        <h3 className={`text-xl font-bold ${stats.secure ? 'text-quantum-green text-glow-green' : 'text-quantum-red text-glow-red'}`}>
          {stats.secure ? 'Secret Key Established' : 'Key Exchange Failed'}
        </h3>
        <p className="text-sm text-white/40 mt-1">
          {stats.secure
            ? 'Both parties share an identical, verified secret key'
            : 'High error rate detected — Eve\'s presence confirmed!'}
        </p>
      </div>

      {finalKey.length > 0 && (
        <>
          {/* Binary key */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/8">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Binary Secret Key ({finalKey.length} bits)</p>
            <div className="flex flex-wrap gap-1.5">
              {finalKey.map((bit, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, rotateX: 90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className={`key-bit-reveal font-mono text-sm px-2 py-1 rounded font-bold ${
                    bit === 0
                      ? 'bg-quantum-blue/20 text-quantum-blue border border-quantum-blue/30'
                      : 'bg-quantum-green/20 text-quantum-green border border-quantum-green/30'
                  }`}
                >
                  {bit}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Hex key */}
          {hexKey && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/8">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Hex Representation</p>
              <p className="font-mono text-quantum-green text-lg tracking-widest break-all">{hexKey}</p>
            </div>
          )}
        </>
      )}

      {/* Sample bits check */}
      <div className="p-4 rounded-xl bg-white/3 border border-white/6">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
          Error Check Sample ({sampleSize} bits publicly revealed)
        </p>
        <div className="flex flex-wrap gap-1">
          {aliceSample.map((bit, i) => {
            const match = bit === bobSample[i];
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-xs text-quantum-blue">{bit}</span>
                <span className={`text-base ${match ? 'text-quantum-green' : 'text-quantum-red'}`}>
                  {match ? '=' : '≠'}
                </span>
                <span className={`font-mono text-xs ${match ? 'text-quantum-green' : 'text-quantum-red'}`}>
                  {bobSample[i]}
                </span>
              </div>
            );
          })}
        </div>
        <p className={`text-xs mt-2 ${stats.secure ? 'text-quantum-green' : 'text-quantum-red'}`}>
          QBER: {stats.errorRate}% — {stats.secure ? 'Below threshold → SECURE' : 'Above 11% threshold → COMPROMISED'}
        </p>
      </div>
    </motion.div>
  );
}

KeyDisplay.propTypes = {
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
};
