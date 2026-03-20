/**
 * @file crypto.js
 * @description Additional key processing utilities for error correction, privacy amplification, and display.
 */

/**
 * XOR two bit arrays to produce a syndrome (used in basic error detection).
 * @param {number[]} a - First bit array.
 * @param {number[]} b - Second bit array.
 * @returns {number[]} XOR result.
 */
export function xorBits(a, b) {
  return a.map((bit, i) => bit ^ b[i]);
}

/**
 * Count mismatching bits between two arrays.
 * @param {number[]} a - First bit array.
 * @param {number[]} b - Second bit array.
 * @returns {number} Number of bit errors.
 */
export function countErrors(a, b) {
  return a.filter((bit, i) => bit !== b[i]).length;
}

/**
 * Format a bit array as a binary string for display.
 * @param {number[]} bits - Array of 0s and 1s.
 * @returns {string} Binary representation string.
 */
export function bitsToString(bits) {
  return bits.join('');
}

/**
 * Convert a bit array to a hex string (groups of 4 bits → hex digit).
 * @param {number[]} bits - Array of 0s and 1s.
 * @returns {string} Hex string.
 */
export function bitsToHex(bits) {
  const padded = [...bits];
  while (padded.length % 4 !== 0) padded.unshift(0);
  let hex = '';
  for (let i = 0; i < padded.length; i += 4) {
    const nibble = padded.slice(i, i + 4);
    hex += parseInt(nibble.join(''), 2).toString(16).toUpperCase();
  }
  return hex;
}

/**
 * Simple privacy amplification: universal hash (XOR-based folding).
 * Not cryptographically robust — for demonstration only.
 * @param {number[]} key - The reconciled key bits.
 * @param {number} outputLength - Desired output key length.
 * @returns {number[]} Amplified key.
 */
export function privacyAmplify(key, outputLength) {
  if (key.length <= outputLength) return key;
  const result = [];
  const step = Math.floor(key.length / outputLength);
  for (let i = 0; i < outputLength; i++) {
    let bit = 0;
    for (let j = 0; j < step; j++) {
      bit ^= key[i * step + j] || 0;
    }
    result.push(bit);
  }
  return result;
}

/**
 * Generate a color for a bit value (used in key visualization).
 * @param {number} bit - 0 or 1.
 * @returns {string} CSS color string.
 */
export function bitColor(bit) {
  return bit === 0 ? '#00D4FF' : '#00FF88';
}

/**
 * Generate sample indices for error estimation check section.
 * @param {number} siftedLength - Total sifted key length.
 * @param {number} sampleSize - Number of bits to sample.
 * @returns {number[]} Array of positions (first sampleSize positions).
 */
export function getSampleIndices(siftedLength, sampleSize) {
  return Array.from({ length: Math.min(sampleSize, siftedLength) }, (_, i) => i);
}
