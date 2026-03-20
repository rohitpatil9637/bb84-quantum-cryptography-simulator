/**
 * @file ErrorRateGraph.jsx
 * @description Real-time QBER line chart with 11% security threshold using Recharts.
 */
import PropTypes from 'prop-types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';

/**
 * Custom tooltip for error rate chart.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs font-mono border border-white/10">
      <p className="text-white/50 mb-1">Sifted bit #{label}</p>
      <p style={{ color: payload[0]?.value > 11 ? '#FF3B5C' : '#00FF88' }}>
        QBER: {payload[0]?.value?.toFixed(1)}%
      </p>
      <p className="text-white/30">Threshold: 11%</p>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.any,
};

/**
 * Real-time error rate graph component.
 * @param {{ errorHistory: Array, eveActive: boolean, phase: number }} props
 */
export default function ErrorRateGraph({ errorHistory, eveActive, phase }) {
  const latestRate = errorHistory.length > 0
    ? errorHistory[errorHistory.length - 1]?.errorRate
    : 0;
  const isCompromised = latestRate > 11;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
          Quantum Bit Error Rate (QBER)
        </h3>
        {phase >= 5 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`phase-badge ${
              isCompromised
                ? 'bg-quantum-red/20 text-quantum-red border border-quantum-red/40'
                : 'bg-quantum-green/20 text-quantum-green border border-quantum-green/40'
            }`}
          >
            {latestRate.toFixed(1)}%
          </motion.span>
        )}
      </div>

      {errorHistory.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-white/20 text-sm">
          Run simulation to see error rate...
        </div>
      ) : (
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={errorHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isCompromised ? '#FF3B5C' : '#00FF88'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isCompromised ? '#FF3B5C' : '#00FF88'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="qubit"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                domain={[0, Math.max(35, latestRate + 5)]}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Threshold reference line */}
              <ReferenceLine
                y={11}
                stroke="#FF3B5C"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{ value: '11% threshold', fill: '#FF3B5C', fontSize: 10, position: 'insideTopRight' }}
              />
              <Area
                type="monotone"
                dataKey="errorRate"
                stroke={isCompromised ? '#FF3B5C' : '#00FF88'}
                strokeWidth={2}
                fill="url(#errorGradient)"
                dot={false}
                isAnimationActive={true}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-quantum-red rounded" style={{ borderTop: '1px dashed #FF3B5C' }} />
          <span className="text-white/30">Security threshold (11%)</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="w-2 h-2 rounded-full" style={{ background: isCompromised ? '#FF3B5C' : '#00FF88' }} />
          <span style={{ color: isCompromised ? '#FF3B5C' : '#00FF88' }}>
            {isCompromised ? 'COMPROMISED' : 'SECURE'}
          </span>
        </div>
      </div>

      {/* Info */}
      {eveActive && phase >= 5 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] text-quantum-red/60 text-center"
        >
          Eve's interception introduced ~25% QBER — channel is NOT secure
        </motion.p>
      )}
    </div>
  );
}

ErrorRateGraph.propTypes = {
  errorHistory: PropTypes.arrayOf(PropTypes.shape({
    qubit: PropTypes.number,
    errorRate: PropTypes.number,
    threshold: PropTypes.number,
  })).isRequired,
  eveActive: PropTypes.bool.isRequired,
  phase: PropTypes.number.isRequired,
};
