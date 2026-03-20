/**
 * @file bb84.js
 * @description Core BB84 Quantum Key Distribution protocol algorithm.
 * Pure functions with no side effects — safe to test and reuse.
 */

/**
 * Generate an array of random bits (0 or 1).
 * @param {number} n - Number of bits to generate.
 * @returns {number[]} Array of random bits.
 */
export function generateRandomBits(n) {
  return Array.from({ length: n }, () => Math.random() < 0.5 ? 0 : 1);
}

/**
 * Generate an array of random bases ('+' rectilinear or 'x' diagonal).
 * @param {number} n - Number of bases to generate.
 * @returns {string[]} Array of bases, each '+' or 'x'.
 */
export function generateRandomBases(n) {
  return Array.from({ length: n }, () => Math.random() < 0.5 ? '+' : 'x');
}

/**
 * Encode a bit with a given basis into a photon polarization state.
 * Rectilinear (+): 0 → vertical (90°), 1 → horizontal (0°)
 * Diagonal (x):   0 → diagonal (45°), 1 → anti-diagonal (135°)
 *
 * @param {number} bit - The bit value (0 or 1).
 * @param {string} basis - The basis ('+' or 'x').
 * @returns {{ angle: number, basis: string, bit: number }} Photon polarization state.
 */
export function encodePolarization(bit, basis) {
  let angle;
  if (basis === '+') {
    angle = bit === 0 ? 90 : 0; // vertical=0, horizontal=1
  } else {
    angle = bit === 0 ? 45 : 135; // diagonal=0, anti-diagonal=1
  }
  return { angle, basis, bit };
}

/**
 * Measure a photon with a given basis.
 * If the measurement basis matches the photon's basis, the original bit is recovered.
 * If it doesn't match, the result is random (quantum measurement destroys superposition).
 *
 * @param {{ angle: number, basis: string, bit: number }} photon - The photon state.
 * @param {string} measureBasis - The basis used for measurement ('+' or 'x').
 * @returns {{ bit: number, correct: boolean }} Measured bit and whether basis matched.
 */
export function measureQubit(photon, measureBasis) {
  if (photon.basis === measureBasis) {
    return { bit: photon.bit, correct: true };
  }
  // Wrong basis: random result (50/50)
  return { bit: Math.random() < 0.5 ? 0 : 1, correct: false };
}

/**
 * Simulate Eve's intercept-resend attack on a photon.
 * Eve randomly guesses a basis, measures the photon (disturbing it if wrong basis),
 * then re-encodes and re-sends based on her measurement. This introduces ~25% errors.
 *
 * @param {{ angle: number, basis: string, bit: number }} photon - Original photon.
 * @returns {{ interceptedPhoton: object, eveBasis: string, eveBit: number }} Resent photon.
 */
export function eveIntercept(photon) {
  const eveBasis = Math.random() < 0.5 ? '+' : 'x';
  const measurement = measureQubit(photon, eveBasis);
  const interceptedPhoton = encodePolarization(measurement.bit, eveBasis);
  return {
    interceptedPhoton,
    eveBasis,
    eveBit: measurement.bit,
  };
}

/**
 * Sift the raw key by keeping only bits where Alice and Bob used the same basis.
 * This is the classical post-processing step (basis reconciliation).
 *
 * @param {string[]} aliceBases - Alice's basis choices.
 * @param {string[]} bobBases - Bob's basis choices.
 * @param {number[]} aliceBits - Alice's original bits.
 * @param {number[]} bobBits - Bob's measured bits.
 * @returns {{ aliceSifted: number[], bobSifted: number[], matchIndices: number[] }} Sifted keys and match positions.
 */
export function siftKey(aliceBases, bobBases, aliceBits, bobBits) {
  const aliceSifted = [];
  const bobSifted = [];
  const matchIndices = [];

  for (let i = 0; i < aliceBases.length; i++) {
    if (aliceBases[i] === bobBases[i]) {
      aliceSifted.push(aliceBits[i]);
      bobSifted.push(bobBits[i]);
      matchIndices.push(i);
    }
  }

  return { aliceSifted, bobSifted, matchIndices };
}

/**
 * Estimate the quantum bit error rate (QBER) by comparing samples publicly.
 * A sample of bits is sacrificed (not used in the final key) to detect eavesdropping.
 *
 * @param {number[]} aliceSample - Alice's sifted key sample bits.
 * @param {number[]} bobSample - Bob's sifted key sample bits.
 * @returns {number} Error rate as a decimal (0.0 to 1.0).
 */
export function estimateErrorRate(aliceSample, bobSample) {
  if (aliceSample.length === 0) return 0;
  const errors = aliceSample.filter((bit, i) => bit !== bobSample[i]).length;
  return errors / aliceSample.length;
}

/**
 * Determine whether the channel is secure based on the error rate.
 * Standard BB84 security threshold is ~11% QBER. Above this, Eve's presence is statistically confirmed.
 *
 * @param {number} errorRate - The estimated error rate (decimal).
 * @param {number} [threshold=0.11] - The maximum tolerable error rate.
 * @returns {boolean} True if secure, false if potentially compromised.
 */
export function isSecure(errorRate, threshold = 0.11) {
  return errorRate <= threshold;
}

/**
 * Extract the final secret key from the sifted key by removing the bits used in error estimation.
 * In a real implementation, this would also include privacy amplification and error correction.
 *
 * @param {number[]} siftedKey - The sifted key bits.
 * @param {number} sampleSize - Number of bits sacrificed for error estimation.
 * @returns {number[]} The final secret key bits.
 */
export function extractFinalKey(siftedKey, sampleSize) {
  return siftedKey.slice(sampleSize);
}

/**
 * Run the full BB84 simulation.
 * @param {object} params
 * @param {number} params.numQubits - Number of qubits to simulate.
 * @param {boolean} params.eveActive - Whether Eve is eavesdropping.
 * @param {number} [params.sampleFraction=0.25] - Fraction of sifted key used for error estimation.
 * @returns {object} Full simulation result.
 */
export function runBB84({ numQubits, eveActive, sampleFraction = 0.25 }) {
  // Phase 1: Alice prepares
  const aliceBits = generateRandomBits(numQubits);
  const aliceBases = generateRandomBases(numQubits);

  // Encode photons
  const photons = aliceBits.map((bit, i) => encodePolarization(bit, aliceBases[i]));

  // Phase 2: Eve intercepts (if active)
  const eveData = eveActive
    ? photons.map(p => eveIntercept(p))
    : null;

  const transmittedPhotons = eveActive
    ? eveData.map(d => d.interceptedPhoton)
    : photons;

  // Phase 3: Bob measures
  const bobBases = generateRandomBases(numQubits);
  const bobMeasurements = transmittedPhotons.map((photon, i) =>
    measureQubit(photon, bobBases[i])
  );
  const bobBits = bobMeasurements.map(m => m.bit);

  // Phase 4: Basis sifting
  const { aliceSifted, bobSifted, matchIndices } = siftKey(
    aliceBases, bobBases, aliceBits, bobBits
  );

  // Phase 5: Error estimation
  const sampleSize = Math.max(1, Math.floor(aliceSifted.length * sampleFraction));
  const aliceSample = aliceSifted.slice(0, sampleSize);
  const bobSample = bobSifted.slice(0, sampleSize);
  const errorRate = estimateErrorRate(aliceSample, bobSample);
  const secure = isSecure(errorRate);

  // Phase 6: Final key
  const finalKey = extractFinalKey(aliceSifted, sampleSize);

  return {
    aliceBits, aliceBases, photons,
    eveData,
    bobBases, bobBits, bobMeasurements,
    matchIndices, aliceSifted, bobSifted,
    sampleSize, aliceSample, bobSample,
    errorRate, secure,
    finalKey,
    stats: {
      totalQubits: numQubits,
      siftedKeyLength: aliceSifted.length,
      finalKeyLength: finalKey.length,
      efficiency: numQubits > 0 ? ((finalKey.length / numQubits) * 100).toFixed(1) : 0,
      errorRate: (errorRate * 100).toFixed(1),
      secure,
    },
  };
}
