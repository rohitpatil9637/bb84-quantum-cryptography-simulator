/**
 * @file QubitGrid.jsx
 * @description SVG photon grid visualizing each qubit's polarization state.
 */
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { getPolarizationInfo } from '../../utils/quantum';

const COLS = 8;

/**
 * Render a single photon polarization icon as an SVG.
 * @param {{ angle: number, color: string, size: number }} props
 */
function PolarizationIcon({ angle, color, size = 24 }) {
  const r = size / 2;
  const rad = (angle * Math.PI) / 180;
  const x1 = r + r * 0.8 * Math.cos(rad + Math.PI / 2);
  const y1 = r - r * 0.8 * Math.sin(rad + Math.PI / 2);
  const x2 = r + r * 0.8 * Math.cos(rad - Math.PI / 2);
  const y2 = r - r * 0.8 * Math.sin(rad - Math.PI / 2);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r - 1} fill={color + '15'} stroke={color + '40'} strokeWidth="0.5" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={r} cy={r} r={2} fill={color} />
    </svg>
  );
}

PolarizationIcon.propTypes = {
  angle: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number,
};

/**
 * Qubit grid showing all qubits with Alice/Bob color coding and match highlighting.
 * @param {{ result: object, phase: number }} props
 */
export default function QubitGrid({ result, phase }) {
  if (!result || phase < 1) return null;

  const qubits = result.aliceBits;
  const showBob = phase >= 3;
  const showMatch = phase >= 4;

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
        Qubit Polarization Grid
      </h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-quantum-blue/40 inline-block" /> Alice (Rectilinear ⊕)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-quantum-purple/40 inline-block" /> Alice (Diagonal ⊗)</span>
        {showMatch && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-quantum-green/40 inline-block" /> Basis Match</span>}
        {showMatch && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-white/10 inline-block" /> Discarded</span>}
      </div>

      {/* Grid */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {qubits.map((bit, i) => {
          const info = getPolarizationInfo(bit, result.aliceBases[i]);
          const isMatch = result.matchIndices?.includes(i);
          const isInSifted = showMatch && isMatch;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.025, type: 'spring', stiffness: 200 }}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg cursor-default transition-all duration-300 ${
                isInSifted
                  ? 'bg-quantum-green/10 border border-quantum-green/30'
                  : showMatch && !isMatch
                  ? 'opacity-30 bg-white/3 border border-white/5'
                  : 'bg-white/3 border border-white/8 hover:bg-white/6'
              }`}
              title={`Q${i}: bit=${bit}, basis=${result.aliceBases[i]}, angle=${info.angle}°`}
            >
              <PolarizationIcon angle={info.angle} color={isInSifted ? '#00FF88' : info.color} size={28} />
              <span className="text-[9px] font-mono text-white/30">{i}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Bob row (phase 3+) */}
      {showBob && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-white/5"
        >
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Bob's Measurements</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {result.bobBits.map((bit, i) => {
              const info = getPolarizationInfo(bit, result.bobBases[i]);
              const isMatch = result.matchIndices?.includes(i);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.025 + 0.3 }}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg ${
                    showMatch && isMatch
                      ? 'bg-quantum-green/10 border border-quantum-green/30'
                      : showMatch
                      ? 'opacity-25'
                      : 'bg-white/3 border border-white/8'
                  }`}
                >
                  <PolarizationIcon angle={info.angle} color={isMatch && showMatch ? '#00FF88' : info.color} size={28} />
                  <span className="text-[9px] font-mono text-white/30">{i}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

QubitGrid.propTypes = {
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
};
