/**
 * @file BasisSifting.jsx
 * @description Interactive table comparing Alice's and Bob's bases, highlighting matches.
 */
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Basis sifting comparison table.
 * @param {{ result: object, phase: number }} props
 */
export default function BasisSifting({ result, phase }) {
  if (!result || phase < 4) return null;

  const { aliceBases, bobBases, aliceBits, bobBits, matchIndices } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest flex-1">
          Basis Sifting — Phase 4
        </h3>
        <span className="phase-badge bg-quantum-blue/10 text-quantum-blue border border-quantum-blue/30">
          {matchIndices.length} / {aliceBases.length} kept
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '400px' }}>
          <thead>
            <tr className="text-xs text-white/30 uppercase tracking-wider">
              <th className="text-left py-2 px-2 font-medium">#</th>
              <th className="text-center py-2 px-2 font-medium" style={{ color: '#00D4FF' }}>Alice Basis</th>
              <th className="text-center py-2 px-2 font-medium" style={{ color: '#00FF88' }}>Bob Basis</th>
              <th className="text-center py-2 px-2 font-medium">Match?</th>
              <th className="text-center py-2 px-2 font-medium" style={{ color: '#00D4FF' }}>Alice Bit</th>
              <th className="text-center py-2 px-2 font-medium" style={{ color: '#00FF88' }}>Bob Bit</th>
            </tr>
          </thead>
          <tbody>
            {aliceBases.map((aBasis, i) => {
              const bBasis = bobBases[i];
              const match = aBasis === bBasis;
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.015 }}
                  className={`border-b border-white/5 transition-all duration-200 ${
                    match
                      ? 'bg-quantum-green/5 hover:bg-quantum-green/10'
                      : 'opacity-40 hover:opacity-60'
                  }`}
                >
                  <td className="py-1.5 px-2 text-xs font-mono text-white/30">{i}</td>
                  <td className="py-1.5 px-2 text-center text-base" style={{ color: '#00D4FF' }}>
                    {aBasis === '+' ? '⊕' : '⊗'}
                  </td>
                  <td className="py-1.5 px-2 text-center text-base" style={{ color: '#00FF88' }}>
                    {bBasis === '+' ? '⊕' : '⊗'}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {match
                      ? <span className="text-quantum-green text-sm">✓</span>
                      : <span className="text-white/20 text-sm">✗</span>}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {match
                      ? <span className="font-mono text-xs text-quantum-blue px-2 py-0.5 rounded bg-quantum-blue/10">{aliceBits[i]}</span>
                      : <span className="font-mono text-xs text-white/15">-</span>}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {match
                      ? <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                          bobBits[i] === aliceBits[i]
                            ? 'text-quantum-green bg-quantum-green/10'
                            : 'text-quantum-red bg-quantum-red/10'
                        }`}>{bobBits[i]}</span>
                      : <span className="font-mono text-xs text-white/15">-</span>}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-white/30 italic">
        Only bits where Alice and Bob used the <span className="text-white/60">same basis</span> are kept for the sifted key. The bases themselves (not the bits) are shared publicly.
      </p>
    </motion.div>
  );
}

BasisSifting.propTypes = {
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
};
