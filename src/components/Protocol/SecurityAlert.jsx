/**
 * @file SecurityAlert.jsx
 * @description Eve detected / secure channel alert banner.
 */
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Security alert component that shows prominent result when simulation completes.
 * @param {{ secure: boolean|null, eveActive: boolean, phase: number, errorRate: string }} props
 */
export default function SecurityAlert({ secure, eveActive, phase, errorRate }) {
  if (phase < 5) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={secure ? 'secure' : 'compromised'}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className={`rounded-2xl p-4 border ${
          secure
            ? 'bg-quantum-green/8 border-quantum-green/30 glow-green'
            : 'bg-quantum-red/10 border-quantum-red/40 glow-red'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`text-4xl ${secure ? '' : 'animate-pulse'}`}>
            {secure ? '🛡️' : '🚨'}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <h4 className={`font-bold text-lg ${secure ? 'text-quantum-green text-glow-green' : 'text-quantum-red text-glow-red'}`}>
              {secure ? 'Quantum Channel Secure' : 'EAVESDROPPER DETECTED!'}
            </h4>
            <p className="text-sm text-white/50 mt-0.5">
              {secure
                ? `QBER = ${errorRate}% — Below 11% threshold. Key exchange successful.`
                : `QBER = ${errorRate}% — Exceeds 11% threshold. Eve's attack confirmed by quantum physics!`}
            </p>
          </div>

          {/* Status badge */}
          <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
            secure
              ? 'bg-quantum-green/20 text-quantum-green border border-quantum-green/40'
              : 'bg-quantum-red/20 text-quantum-red border border-quantum-red/40'
          }`}>
            {secure ? 'SECURE' : 'COMPROMISED'}
          </div>
        </div>

        {/* Explanation */}
        {!secure && eveActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 pt-3 border-t border-quantum-red/20 text-xs text-white/40 leading-relaxed"
          >
            <strong className="text-quantum-red">Why was Eve detected?</strong> The quantum no-cloning theorem
            prevents Eve from copying photons without disturbing them. When Eve guesses the wrong basis (50% chance),
            she collapses the quantum state. Bob then correctly measures only 75% of the time on matching bases,
            creating a detectable 25% QBER.
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

SecurityAlert.propTypes = {
  secure: PropTypes.bool,
  eveActive: PropTypes.bool.isRequired,
  phase: PropTypes.number.isRequired,
  errorRate: PropTypes.string,
};
