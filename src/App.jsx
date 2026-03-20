/**
 * @file App.jsx
 * @description Main application layout for the BB84 Quantum Key Distribution Simulator.
 * Three-column layout: Alice | Quantum Channel | Bob, with Eve above the channel.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useBB84, PHASES } from './hooks/useBB84';
import { useSimulation, SPEED_PRESETS } from './hooks/useSimulation';

import Alice from './components/AliceBob/Alice';
import Bob from './components/AliceBob/Bob';
import Eve from './components/AliceBob/Eve';
import QubitGrid from './components/Visualizer/QubitGrid';
import PhotonChannel from './components/Visualizer/PhotonChannel';
import BlochSphere from './components/Visualizer/BlochSphere';
import ErrorRateGraph from './components/Visualizer/ErrorRateGraph';
import BasisSifting from './components/Protocol/BasisSifting';
import KeyDisplay from './components/Protocol/KeyDisplay';
import SecurityAlert from './components/Protocol/SecurityAlert';
import StatsPanel from './components/Dashboard/StatsPanel';
import SpeedControl from './components/Dashboard/SpeedControl';
import EducationPanel from './components/Dashboard/EducationPanel';

export default function App() {
  const bb84 = useBB84(24);
  const [speed, setSpeed] = useState(SPEED_PRESETS.normal);

  const sim = useSimulation({
    phase: bb84.phase,
    isRunning: bb84.isRunning,
    speed,
    advancePhase: bb84.advancePhase,
    setIsRunning: bb84.setIsRunning,
    reset: bb84.reset,
    result: bb84.result,
  });

  // Current qubit angle for Bloch sphere (use first photon of current phase)
  const currentAngle = bb84.result?.photons?.[0]?.angle ?? 90;
  const currentLabel = bb84.result
    ? `Q0: ${bb84.result.aliceBits[0]}/${bb84.result.aliceBases[0]}`
    : '';

  return (
    <div className="min-h-screen bg-space text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Starfield background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {Array.from({ length: 80 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `glowPulse ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: Math.random() * 4 + 's',
            }}
          />
        ))}
      </div>

      {/* Gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #00D4FF, transparent)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #00FF88, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
             style={{ background: 'radial-gradient(circle, #9945FF, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-quantum-blue/10 border border-quantum-blue/20 text-quantum-blue text-xs font-semibold mb-4 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-quantum-blue animate-pulse" />
              Quantum Cryptography Simulator
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em' }}>
              BB84 Protocol
              <span className="ml-3 text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #00D4FF, #9945FF, #00FF88)' }}>
                Simulator
              </span>
            </h1>
            <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto">
              The world's first quantum key distribution protocol (Bennett & Brassard, 1984).
              Any eavesdropping attempt is <em className="text-white/60">physically detectable</em> — guaranteed by quantum mechanics.
            </p>
          </motion.div>
        </header>

        {/* Phase indicator */}
        <motion.div
          key={bb84.phase}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-white/10 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-quantum-blue animate-pulse" />
            {bb84.phaseName}
          </span>
          {bb84.phaseDescription && (
            <p className="text-xs text-white/30 mt-2 max-w-xl mx-auto">{bb84.phaseDescription}</p>
          )}
        </motion.div>

        {/* Security alert (phase 5+) */}
        <div className="mb-6">
          <SecurityAlert
            secure={bb84.result?.stats?.secure ?? null}
            eveActive={bb84.eveActive}
            phase={bb84.phase}
            errorRate={bb84.result?.stats?.errorRate}
          />
        </div>

        {/* Eve toggle bar */}
        <div className="mb-6">
          <Eve
            eveActive={bb84.eveActive}
            onToggle={bb84.toggleEve}
            result={bb84.result}
            phase={bb84.phase}
          />
        </div>

        {/* Main 3-column layout */}
        <div className="protocol-layout flex gap-4 mb-6">
          {/* Alice (left) */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <Alice result={bb84.result} phase={bb84.phase} numQubits={bb84.numQubits} />
          </div>

          {/* Center: quantum channel + visualizers */}
          <div className="flex-1 flex flex-col gap-4">
            <PhotonChannel result={bb84.result} phase={bb84.phase} eveActive={bb84.eveActive} />
            <QubitGrid result={bb84.result} phase={bb84.phase} />

            {/* Basis sifting table (phase 4+) */}
            <AnimatePresence>
              {bb84.phase >= 4 && (
                <BasisSifting result={bb84.result} phase={bb84.phase} />
              )}
            </AnimatePresence>

            {/* Final key (phase 6) */}
            <AnimatePresence>
              {bb84.phase >= 6 && (
                <KeyDisplay result={bb84.result} phase={bb84.phase} />
              )}
            </AnimatePresence>
          </div>

          {/* Bob (right) */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <Bob result={bb84.result} phase={bb84.phase} numQubits={bb84.numQubits} />
          </div>
        </div>

        {/* Bottom section: stats + controls + charts + 3D */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Speed controls */}
          <div className="lg:col-span-1">
            <SpeedControl
              isRunning={bb84.isRunning}
              speed={speed}
              phase={bb84.phase}
              numQubits={bb84.numQubits}
              onStart={sim.start}
              onPause={sim.pause}
              onStep={sim.stepForward}
              onReset={bb84.reset}
              onSpeedChange={setSpeed}
              onQubitChange={n => { bb84.setNumQubits(n); bb84.reset(); }}
            />
          </div>

          {/* Stats panel */}
          <div className="lg:col-span-1">
            <StatsPanel result={bb84.result} phase={bb84.phase} eveActive={bb84.eveActive} />
          </div>

          {/* Error rate graph */}
          <div className="lg:col-span-1">
            <ErrorRateGraph
              errorHistory={bb84.errorHistory}
              eveActive={bb84.eveActive}
              phase={bb84.phase}
            />
          </div>

          {/* Bloch sphere */}
          <div className="lg:col-span-1">
            <BlochSphere angle={currentAngle} label={currentLabel} />
          </div>
        </div>

        {/* Education panel */}
        <EducationPanel phase={bb84.phase} />

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-white/20 py-4 border-t border-white/5">
          <p>
            BB84 Quantum Key Distribution Protocol — Bennett & Brassard, 1984.&nbsp;
            <a href="https://github.com" className="underline hover:text-white/50 transition-colors" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </p>
          <p className="mt-1">Built with React, Three.js, Framer Motion, Recharts · MIT License</p>
        </footer>
      </div>
    </div>
  );
}
