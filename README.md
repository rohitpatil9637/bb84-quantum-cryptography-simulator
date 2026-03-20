# 🔐 BB84 Quantum Cryptography Simulator


> **An interactive- web simulator for the BB84 Quantum Key Distribution protocol** — the world's first quantum cryptography protocol (Bennett & Brassard, 1984). Any eavesdropping attempt is physically detectable, guaranteed by the laws of quantum mechanics.

---

## ✨ Features

### 🎭 Full BB84 Protocol (6 Phases)
| Phase | Description |
|-------|-------------|
| 1 – Prepare | Alice randomly picks bits and bases, encodes photon polarizations |
| 2 – Transmit | Animated photon particles travel through the quantum channel |
| 3 – Measure | Bob randomly measures with his own bases |
| 4 – Sift | Bases are compared publicly; only matching-basis bits kept |
| 5 – Detect | Sample bits reveal Eve's presence via error rate (~25% if intercepted) |
| 6 – Key | Verified secret key displayed with hex encoding |

### 🕵️ Eve (Eavesdropper) Toggle
- **Toggle Eve on/off in real time** — see the QBER jump from ~0% to ~25%
- Intercept-resend attack simulation with Eve's guessed bases shown
- Quantum No-Cloning Theorem explanation inline

### 📊 Visualizations
- **SVG Qubit Grid** — polarization icons (↕↔↗↘) with basis match highlighting
- **Animated Fiber Optic Channel** — glowing photon particles with Eve intercept position
- **3D Interactive Bloch Sphere** — Three.js sphere with draggable orbit controls
- **Real-time QBER Graph** — Recharts area chart with 11% security threshold line

### ⚙️ Controls
- Speed presets: Slow / Normal / Fast / Instant
- Step-by-step manual mode
- Pause / Resume / Reset / Run Again
- Qubit count slider (8–32 qubits)


---

## 🚀 Quick Start

```bash
git clone https://github.com/rohitpatil4290/bb84-quantum-cryptography-simulator.git
cd bb84-quantum-cryptography-simulator
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:5173/bb84-quantum-cryptography-simulator/ in your browser.

---

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18 + Vite** | Frontend framework and bundler |
| **Tailwind CSS 3** | Utility-first styling |
| **Three.js + @react-three/fiber** | 3D Bloch sphere visualization |
| **Framer Motion** | Protocol phase animations |
| **Recharts** | Real-time QBER error rate chart |
| **GitHub Actions** | Automatic deployment to GitHub Pages |

---

## 🔬 What is BB84?

BB84 is a **quantum key distribution (QKD)** protocol that allows Alice and Bob to generate a provably secret shared key over a public quantum channel.

**The magic?** Unlike classical cryptography, BB84's security is based on the **laws of physics**. Any eavesdrop attempt:
1. Disturbs the quantum states being transmitted
2. Introduces a detectable error rate (~25%)
3. Alerts Alice and Bob that the channel is compromised

### 🔐 Why Eavesdropping is ALWAYS Detectable

#### 1. Quantum Superposition
A qubit doesn't have a definite value until measured. Alice's photons exist in superposition — measuring them without knowing the correct basis yields random results.

#### 2. The No-Cloning Theorem
It is **physically impossible** to create a perfect copy of an unknown quantum state. Eve cannot copy a photon — she must measure it, destroying the original.

#### 3. Heisenberg Uncertainty Principle
Measuring a quantum system inevitably disturbs it. When Eve measures in the wrong basis (50% probability), she collapses it to a wrong state. Bob then gets the wrong bit 50% of those cases.

**Net effect: 25% QBER** — statistically unmistakable vs. ~0% channel noise.

---

## 📄 License

MIT © 2024.

---

## 📚 References

- C. H. Bennett, G. Brassard (1984). "Quantum cryptography: Public key distribution and coin tossing." *ICASSP '84*
- W. K. Wootters, W. H. Zurek (1982). "A single quantum cannot be cloned." *Nature*
- N. Gisin et al. (2002). "Quantum cryptography." *Rev. Mod. Phys.*
