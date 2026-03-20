/**
 * @file PhotonChannel.jsx
 * @description Animated fiber optic channel with traveling photon particles.
 * Uses Framer Motion for photon animation and SVG for the channel visualization.
 */
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { getPolarizationInfo } from '../../utils/quantum';

/**
 * A single animated photon particle.
 */
function PhotonParticle({ color, delay = 0, eveActive }) {
  return (
    <motion.div
      className="absolute flex items-center"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
      initial={{ left: '0%', opacity: 0 }}
      animate={eveActive
        ? [
            { left: '0%', opacity: 0 },
            { left: '42%', opacity: 1 },
            { left: '42%', opacity: 0 },
            { left: '42%', opacity: 1 },
            { left: '100%', opacity: 0 },
          ]
        : [
            { left: '0%', opacity: 0 },
            { left: '10%', opacity: 1 },
            { left: '100%', opacity: 0 },
          ]}
      transition={{
        duration: eveActive ? 1.6 : 1.0,
        delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.5,
      }}
    >
      {/* Glow trail */}
      <div
        className="photon-particle"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 10px ${color}, 0 0 25px ${color}, 0 0 50px ${color}40`,
        }}
      />
    </motion.div>
  );
}

PhotonParticle.propTypes = {
  color: PropTypes.string.isRequired,
  delay: PropTypes.number,
  eveActive: PropTypes.bool,
};

/**
 * The fiber optic quantum channel with photon streams.
 * @param {{ result: object, phase: number, eveActive: boolean }} props
 */
export default function PhotonChannel({ result, phase, eveActive }) {
  const transmitting = phase === 2;
  const currentPhoton = result?.aliceBits ? result.aliceBits[0] : 0;
  const currentBasis = result?.aliceBases ? result.aliceBases[0] : '+';
  const info = result ? getPolarizationInfo(currentPhoton, currentBasis) : null;
  const photonColor = eveActive ? '#FF3B5C' : '#00D4FF';

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
          Quantum Channel
        </h3>
        <span className={`phase-badge ${
          eveActive
            ? 'bg-quantum-red/10 text-quantum-red border border-quantum-red/30'
            : 'bg-quantum-blue/10 text-quantum-blue border border-quantum-blue/30'
        }`}>
          {eveActive ? '⚠ Intercepted' : '✓ Secure'}
        </span>
      </div>

      {/* Channel visualization */}
      <div className="relative h-24 flex items-center">
        {/* Alice label */}
        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-quantum-blue/20 border-2 border-quantum-blue/50 flex items-center justify-center text-quantum-blue font-bold text-lg shadow-lg"
               style={{ boxShadow: '0 0 15px rgba(0,212,255,0.3)' }}>
            A
          </div>
          <span className="text-xs text-quantum-blue/60 mt-1">Alice</span>
        </div>

        {/* Fiber optic tube */}
        <div className="relative flex-1 mx-2 h-6 fiber-channel rounded-full overflow-hidden">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-quantum-blue/5 via-quantum-blue/10 to-quantum-blue/5" />

          {/* Photon particles (only during transmit phase) */}
          <AnimatePresence>
            {transmitting && (
              <>
                <PhotonParticle color={photonColor} delay={0} eveActive={eveActive} />
                <PhotonParticle color={photonColor} delay={0.35} eveActive={eveActive} />
                <PhotonParticle color={photonColor} delay={0.7} eveActive={eveActive} />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Eve in middle (if active) */}
        {eveActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full -top-1 z-20 flex flex-col items-center"
          >
            <div className="w-9 h-9 rounded-full bg-quantum-red/20 border-2 border-quantum-red/60 flex items-center justify-center text-quantum-red font-bold shadow-lg"
                 style={{ boxShadow: '0 0 15px rgba(255,59,92,0.4)' }}>
              E
            </div>
            <span className="text-[10px] text-quantum-red/70 mt-0.5">Eve</span>
            {/* Intercept arrows */}
            <div className="text-quantum-red text-xs mt-0.5">⬍</div>
          </motion.div>
        )}

        {/* Bob label */}
        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-quantum-green/20 border-2 border-quantum-green/50 flex items-center justify-center text-quantum-green font-bold text-lg shadow-lg"
               style={{ boxShadow: '0 0 15px rgba(0,255,136,0.3)' }}>
            B
          </div>
          <span className="text-xs text-quantum-green/60 mt-1">Bob</span>
        </div>
      </div>

      {/* Current photon state */}
      {info && phase >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6"
        >
          <div
            className="text-2xl"
            style={{ color: info.color, filter: `drop-shadow(0 0 6px ${info.color})` }}
          >
            {info.symbol}
          </div>
          <div>
            <p className="text-xs text-white/40">Last photon sent</p>
            <p className="text-sm font-semibold" style={{ color: info.color }}>
              {info.label} — {info.angle}° polarization
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-white/30">bit={currentPhoton}</p>
            <p className="text-xs text-white/30">basis={currentBasis}</p>
          </div>
        </motion.div>
      )}

      {/* Phase 2 status */}
      {transmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-center text-xs text-quantum-blue/60"
        >
          Transmitting photons through quantum channel...
        </motion.div>
      )}
    </div>
  );
}

PhotonChannel.propTypes = {
  result: PropTypes.object,
  phase: PropTypes.number.isRequired,
  eveActive: PropTypes.bool.isRequired,
};
