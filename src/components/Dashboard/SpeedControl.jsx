/**
 * @file SpeedControl.jsx
 * @description Simulation speed slider, playback controls, and step mode.
 */
import PropTypes from 'prop-types';
import { SPEED_PRESETS } from '../../hooks/useSimulation';
import { PHASES } from '../../hooks/useBB84';

const SPEED_LABELS = [
  { key: 'slow', label: 'Slow', ms: SPEED_PRESETS.slow },
  { key: 'normal', label: 'Normal', ms: SPEED_PRESETS.normal },
  { key: 'fast', label: 'Fast', ms: SPEED_PRESETS.fast },
  { key: 'instant', label: 'Instant', ms: SPEED_PRESETS.instant },
];

/**
 * Speed control panel with play/pause/step/reset.
 * @param {{ isRunning: boolean, speed: number, phase: number, numQubits: number, onStart: Function, onPause: Function, onStep: Function, onReset: Function, onSpeedChange: Function, onQubitChange: Function }} props
 */
export default function SpeedControl({
  isRunning,
  speed,
  phase,
  numQubits,
  onStart,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  onQubitChange,
}) {
  const atEnd = phase === PHASES.FINAL;
  const atStart = phase === PHASES.IDLE;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
        Simulation Controls
      </h3>

      {/* Qubit count */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">Qubits to simulate</span>
          <span className="font-mono text-quantum-blue font-bold">{numQubits}</span>
        </div>
        <input
          type="range"
          min="8"
          max="32"
          step="4"
          value={numQubits}
          onChange={e => onQubitChange(parseInt(e.target.value))}
          className="w-full accent-quantum-blue h-1.5 rounded-full cursor-pointer"
          style={{ accentColor: '#00D4FF' }}
        />
        <div className="flex justify-between text-[10px] text-white/20">
          <span>8</span><span>16</span><span>24</span><span>32</span>
        </div>
      </div>

      {/* Speed preset buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-white/40">Simulation Speed</span>
        <div className="grid grid-cols-4 gap-1.5">
          {SPEED_LABELS.map(({ key, label, ms }) => (
            <button
              key={key}
              onClick={() => onSpeedChange(ms)}
              className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                speed === ms
                  ? 'bg-quantum-blue/30 text-quantum-blue border border-quantum-blue/50'
                  : 'bg-white/5 text-white/40 border border-white/8 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Playback buttons */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        {!atEnd ? (
          isRunning ? (
            <button
              onClick={onPause}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 border border-white/15 text-white/70 hover:bg-white/15 transition-all duration-200 font-semibold text-sm"
            >
              ⏸ Pause
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-quantum-blue/20 border border-quantum-blue/40 text-quantum-blue hover:bg-quantum-blue/30 transition-all duration-200 font-semibold text-sm"
              style={{ boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
            >
              {atStart ? '▶ Start' : '▶ Resume'}
            </button>
          )
        ) : (
          <button
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-quantum-green/20 border border-quantum-green/40 text-quantum-green hover:bg-quantum-green/30 transition-all duration-200 font-semibold text-sm"
          >
            🔁 Run Again
          </button>
        )}

        {/* Step */}
        <button
          onClick={onStep}
          disabled={isRunning || atEnd}
          className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
            isRunning || atEnd
              ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/8 text-white/30'
              : 'bg-white/8 border-white/15 text-white/60 hover:bg-white/12 hover:text-white/80'
          }`}
          title="Step forward one phase"
        >
          ⏭ Step
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all duration-200 text-sm"
          title="Reset simulation"
        >
          ↺
        </button>
      </div>

      {/* Phase progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/30">Phase progress</span>
          <span className="font-mono text-white/40">{phase} / 6</span>
        </div>
        <div className="progress-bar-track h-1.5">
          <div
            className="progress-bar-fill bg-gradient-to-r from-quantum-blue to-quantum-green"
            style={{ width: `${(phase / 6) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/15">
          {['Start', 'Prepare', 'Transmit', 'Measure', 'Sift', 'Detect', 'Key'].map((p, i) => (
            <span key={i} className={phase >= i ? 'text-white/40' : ''}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

SpeedControl.propTypes = {
  isRunning: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  phase: PropTypes.number.isRequired,
  numQubits: PropTypes.number.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStep: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSpeedChange: PropTypes.func.isRequired,
  onQubitChange: PropTypes.func.isRequired,
};
