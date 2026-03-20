/**
 * @file StatsPanel.jsx
 * @description Key generation statistics dashboard.
 */
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';


/**
 * Stat card sub-component.
 */
function StatCard({ label, value, unit, color, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl bg-white/3 border border-white/6 flex flex-col gap-1"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30 uppercase tracking-widest">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold font-mono" style={{ color }}>
          {value}
        </span>
        {unit && <span className="text-xs text-white/30">{unit}</span>}
      </div>
    </motion.div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  delay: PropTypes.number,
};

/**
 * Stats panel with total qubits, sifted key, final key metrics.
 * @param {{ result: object, phase: number, eveActive: boolean }} props
 */
export default function StatsPanel({ result, phase, eveActive }) {
  const stats = result?.stats;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
        Key Generation Statistics
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Qubits Sent"
          value={stats?.totalQubits ?? '—'}
          icon="📡"
          color="#00D4FF"
          delay={0}
        />
        <StatCard
          label="Sifted Key"
          value={stats?.siftedKeyLength ?? '—'}
          unit="bits"
          icon="🔀"
          color="#9945FF"
          delay={0.1}
        />
        <StatCard
          label="Final Key"
          value={stats?.finalKeyLength ?? '—'}
          unit="bits"
          icon="🔑"
          color="#00FF88"
          delay={0.2}
        />
        <StatCard
          label="Efficiency"
          value={phase >= 6 ? `${stats?.efficiency ?? 0}%` : '—'}
          icon="📊"
          color="#FFB800"
          delay={0.3}
        />
      </div>

      {/* Security status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`flex items-center justify-between p-4 rounded-xl border ${
          phase >= 5
            ? stats?.secure
              ? 'bg-quantum-green/8 border-quantum-green/25 text-quantum-green'
              : 'bg-quantum-red/10 border-quantum-red/30 text-quantum-red'
            : 'bg-white/3 border-white/6 text-white/30'
        }`}
      >
        <span className="text-xs uppercase tracking-widest font-semibold">
          Security Status
        </span>
        <span className="text-sm font-bold font-mono">
          {phase < 5
            ? 'PENDING'
            : stats?.secure ? '✓ SECURE' : '✗ COMPROMISED'}
        </span>
      </motion.div>

      {/* QBER */}
      {phase >= 5 && stats && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/30">QBER (Quantum Bit Error Rate)</span>
            <span className={`font-mono font-bold ${
              stats.secure ? 'text-quantum-green' : 'text-quantum-red'
            }`}>
              {stats.errorRate}%
            </span>
          </div>
          <div className="progress-bar-track h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (parseFloat(stats.errorRate) / 35) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="progress-bar-fill"
              style={{ background: stats.secure ? '#00FF88' : '#FF3B5C' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/20">
            <span>0%</span>
            <span className="text-quantum-red">11% threshold</span>
            <span>35%</span>
          </div>
        </div>
      )}

      {/* Eve status */}
      <div className={`flex items-center gap-2 p-3 rounded-xl text-xs ${
        eveActive
          ? 'bg-quantum-red/8 border border-quantum-red/20 text-quantum-red'
          : 'bg-white/3 border border-white/6 text-white/30'
      }`}>
        <span className={`w-2 h-2 rounded-full ${eveActive ? 'bg-quantum-red animate-pulse' : 'bg-white/20'}`} />
        <span>Eavesdropper: <strong>{eveActive ? 'ACTIVE' : 'Inactive'}</strong></span>
      </div>
    </div>
  );
}

StatsPanel.propTypes = {
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
  eveActive: PropTypes.bool.isRequired,
};
