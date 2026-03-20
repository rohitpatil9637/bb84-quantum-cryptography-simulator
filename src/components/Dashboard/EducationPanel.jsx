/**
 * @file EducationPanel.jsx
 * @description Expandable "Why does this work?" educational panels for each phase.
 */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHASE_EDUCATION = {
  1: {
    title: 'Why random bases?',
    color: '#00D4FF',
    content: `Alice randomly chooses between two encoding schemes: Rectilinear (+) and Diagonal (×). 

In quantum mechanics, a photon can exist in a superposition of states — it's not definitively 0 or 1 until measured. By randomly choosing bases, Alice ensures Eve cannot know which measurement context to use.

Key insight: A quantum bit (qubit) is fundamentally different from a classical bit — it can hold both 0 AND 1 simultaneously until observed.`,
    concepts: ['Quantum superposition', 'Qubit vs classical bit'],
  },
  2: {
    title: 'What makes the quantum channel special?',
    color: '#9945FF',
    content: `Unlike classical channels, the quantum channel transmits individual photon polarization states. These are quantum states — any observation collapses them.

The Heisenberg Uncertainty Principle states that measuring one quantum property of a particle inherently disturbs others. Eve cannot measure a photon's polarization without changing its state.

This physical law makes eavesdropping detectable — no software patch can fix it!`,
    concepts: ['Heisenberg Uncertainty Principle', 'Quantum channels', 'No-cloning theorem'],
  },
  3: {
    title: "Why can't Bob always get the right bit?",
    color: '#00FF88',
    content: `Bob randomly guesses a measurement basis for each photon. If he picks the same basis as Alice, quantum mechanics guarantees he measures the same bit.

If he picks a different basis (50% chance), he gets a completely random result — not Alice's bit. This is the quantum measurement postulate: measuring in the wrong basis projects onto a random eigenstate.

This is why about 50% of bits are discarded during basis sifting.`,
    concepts: ['Quantum measurement', 'Basis mismatch', 'Projection postulate'],
  },
  4: {
    title: 'What does sifting accomplish?',
    color: '#00D4FF',
    content: `Alice and Bob communicate publicly over a CLASSICAL channel to compare which bases they used — not the actual bit values.

Only bits where they used the same basis are guaranteed to match. These form the "sifted key." This public announcement is safe because knowing which basis was used doesn't reveal the bit value.

Expected efficiency: ~50% of bits survive sifting.`,
    concepts: ['Classical post-processing', 'Basis reconciliation', 'Key sifting'],
  },
  5: {
    title: "Why does Eve's attack always introduce errors?",
    color: '#FF3B5C',
    content: `The No-Cloning Theorem (a fundamental quantum law) states it's impossible to create a perfect copy of an unknown quantum state.

Eve must measure a photon to read it, which destroys its original state. She must then resend a new photon. When she guesses the wrong basis (50% chance), she sends the wrong polarization — and when Bob measures with the correct basis, he gets a wrong bit 50% of the time.

Net effect: 25% error rate (0.5 × 0.5 = 0.25). This is physically guaranteed!`,
    concepts: ['No-cloning theorem', 'Intercept-resend attack', 'QBER'],
  },
  6: {
    title: 'How can Alice and Bob be sure the key is identical?',
    color: '#00FF88',
    content: `After sifting, Alice and Bob sacrifice some bits publicly to measure the error rate (QBER). If QBER < 11%, the remaining bits are statistically guaranteed to match and no eavesdropping occurred.

In a real system, privacy amplification (hashing) would shorten the key further to remove any residual information Eve might have gained. Error correction (similar to LDPC codes) fixes remaining noise.

The final key is then used for one-time-pad encryption — provably unbreakable!`,
    concepts: ['QBER estimation', 'Privacy amplification', 'Information-theoretic security'],
  },
};

/**
 * Single expandable educational panel.
 */
function EduCard({ phaseKey, color, title, content, concepts }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border transition-all duration-300" style={{ borderColor: color + '25' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <span className="text-base" style={{ color }}>💡</span>
        <span className="text-xs font-semibold flex-1" style={{ color }}>{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/30 text-sm"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-xs text-white/50 leading-relaxed whitespace-pre-line">
              {content}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {concepts.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: color + '40', color }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

EduCard.propTypes = {
  phaseKey: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  concepts: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/**
 * Collection of educational panels, filtered by current phase.
 * @param {{ phase: number }} props
 */
export default function EducationPanel({ phase }) {
  const relevantPhases = Object.keys(PHASE_EDUCATION)
    .map(Number)
    .filter(p => p <= Math.max(phase, 1));

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
        📚 Why Does This Work?
      </h3>
      <p className="text-xs text-white/30">Expand any section to learn the quantum physics behind each step.</p>

      {relevantPhases.length === 0 && (
        <p className="text-xs text-white/20 italic">Start the simulation to unlock explanations...</p>
      )}

      {relevantPhases.map(p => {
        const edu = PHASE_EDUCATION[p];
        return (
          <motion.div
            key={p}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <EduCard phaseKey={p} {...edu} />
          </motion.div>
        );
      })}
    </div>
  );
}

EducationPanel.propTypes = {
  phase: PropTypes.number.isRequired,
};
