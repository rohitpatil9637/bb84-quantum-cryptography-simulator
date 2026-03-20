/**
 * @file Eve.jsx
 * @description Eve (eavesdropper) intercept toggle and intercept-resend visualization.
 */
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Eve component — toggle and intercept-resend details.
 * @param {{ eveActive: boolean, onToggle: Function, result: object, phase: number }} props
 */
export default function Eve({ eveActive, onToggle, result, phase }) {
  return (
    <div className={`glass rounded-2xl p-4 transition-all duration-500 ${eveActive ? 'glow-red border-quantum-red/30' : 'border-white/5'}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          eveActive
            ? 'bg-quantum-red/20 border border-quantum-red/50'
            : 'bg-white/5 border border-white/10'
        }`}>
          <span className={`font-bold text-lg transition-colors duration-300 ${eveActive ? 'text-quantum-red' : 'text-white/30'}`}>
            E
          </span>
        </div>
        <div className="flex-1">
          <h2 className={`font-sans font-bold text-lg leading-none transition-colors duration-300 ${eveActive ? 'text-quantum-red' : 'text-white/50'}`}>
            Eve
          </h2>
          <p className="text-xs text-white/30 mt-0.5">Eavesdropper</p>
        </div>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-space ${
            eveActive
              ? 'bg-quantum-red/80 focus:ring-quantum-red/50'
              : 'bg-white/10 focus:ring-white/20'
          }`}
          aria-label={eveActive ? 'Disable Eve' : 'Enable Eve'}
        >
          <motion.div
            layout
            className={`absolute top-0.5 w-6 h-6 rounded-full shadow-lg transition-colors duration-300 ${
              eveActive ? 'bg-white' : 'bg-white/50'
            }`}
            style={{ left: eveActive ? '30px' : '2px' }}
          />
        </button>
      </div>

      {/* Status badge */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          {eveActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-quantum-red/10 border border-quantum-red/30"
            >
              <span className="w-2 h-2 rounded-full bg-quantum-red animate-pulse" />
              <span className="text-xs text-quantum-red font-semibold">INTERCEPTING CHANNEL</span>
            </motion.div>
          ) : (
            <motion.div
              key="inactive"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8"
            >
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-xs text-white/30 font-semibold">CHANNEL CLEAR</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Eve's intercept details */}
      <AnimatePresence>
        {eveActive && result && phase >= 2 && result.eveData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-col gap-2"
          >
            <p className="text-xs text-white/40 uppercase tracking-widest">Eve's Guessed Bases</p>
            <div className="flex flex-wrap gap-1">
              {result.eveData.slice(0, 16).map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`bit-cell text-xs ${
                    d.eveBasis === result.aliceBases[i]
                      ? 'bg-white/5 border border-white/15 text-white/50'
                      : 'bg-quantum-red/10 border border-quantum-red/30 text-quantum-red'
                  }`}
                  title={`Eve guessed ${d.eveBasis}, Alice used ${result.aliceBases[i]} — ${d.eveBasis === result.aliceBases[i] ? 'correct' : 'wrong → error!'}`}
                >
                  {d.eveBasis === '+' ? '⊕' : '⊗'}
                </motion.div>
              ))}
              {result.eveData.length > 16 && (
                <span className="text-white/20 text-xs self-center">+{result.eveData.length - 16} more</span>
              )}
            </div>

            {/* Explanation */}
            <div className="mt-2 p-3 rounded-xl bg-quantum-red/5 border border-quantum-red/15 text-xs text-white/50 leading-relaxed">
              <span className="text-quantum-red font-semibold">Intercept-Resend Attack: </span>
              Eve randomly guesses a basis, measures the photon (collapsing its state), re-encodes and resends. When her basis is wrong (≈50% of the time), she introduces a 50% chance of error in the sifted key — resulting in <span className="text-quantum-red font-semibold">~25% overall QBER</span>.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Eve.propTypes = {
  eveActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
};
