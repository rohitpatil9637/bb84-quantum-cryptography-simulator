/**
 * @file quantum.js
 * @description Qubit math helpers for Bloch sphere representation and state visualization.
 */

/**
 * Convert a qubit polarization angle to Bloch sphere polar coordinates (theta, phi).
 * The Bloch sphere maps |0⟩ to the north pole and |1⟩ to the south pole.
 *
 * @param {number} angle - Polarization angle in degrees (0, 45, 90, 135).
 * @returns {{ theta: number, phi: number, x: number, y: number, z: number }} Bloch coordinates.
 */
export function angleToBloch(angle) {
  // Map polarization angles to Bloch sphere angles
  const angleRad = (angle * Math.PI) / 180;
  const theta = angleRad; // polar angle from +Z
  const phi = 0; // azimuthal angle (simplified for 2D polarization states)

  return {
    theta,
    phi,
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  };
}

/**
 * Get the label and symbol for a polarization state.
 * @param {number} bit - The qubit value (0 or 1).
 * @param {string} basis - The preparation basis ('+' or 'x').
 * @returns {{ label: string, symbol: string, color: string }} Display info.
 */
export function getPolarizationInfo(bit, basis) {
  if (basis === '+') {
    return bit === 0
      ? { label: 'Vertical', symbol: '↕', color: '#00D4FF', angle: 90 }
      : { label: 'Horizontal', symbol: '↔', color: '#00D4FF', angle: 0 };
  } else {
    return bit === 0
      ? { label: 'Diagonal', symbol: '↗', color: '#9945FF', angle: 45 }
      : { label: 'Anti-diagonal', symbol: '↘', color: '#9945FF', angle: 135 };
  }
}

/**
 * Get Bloch sphere state vector components for visualizing qubit state.
 * @param {number} angle - Photon polarization angle in degrees.
 * @returns {{ x: number, y: number, z: number }} Unit vector on Bloch sphere.
 */
export function getBlochVector(angle) {
  const theta = (angle * Math.PI) / 180;
  return {
    x: Math.sin(theta),
    y: 0,
    z: Math.cos(theta),
  };
}

/**
 * Lerp (linear interpolate) between two Bloch sphere angles for smooth animation.
 * @param {number} from - Starting angle in degrees.
 * @param {number} to - Target angle in degrees.
 * @param {number} t - Interpolation factor (0 to 1).
 * @returns {number} Interpolated angle.
 */
export function lerpAngle(from, to, t) {
  return from + (to - from) * t;
}

/**
 * Generate a grid layout of qubits for visualization (qubit grid rows/cols).
 * @param {number} total - Total number of qubits.
 * @param {number} [cols=8] - Columns per row.
 * @returns {{ row: number, col: number, index: number }[]} Grid positions.
 */
export function qubitGridLayout(total, cols = 8) {
  return Array.from({ length: total }, (_, i) => ({
    row: Math.floor(i / cols),
    col: i % cols,
    index: i,
  }));
}

/**
 * Get a descriptive basis name.
 * @param {string} basis - '+' or 'x'
 * @returns {string} Human-readable basis name.
 */
export function basisName(basis) {
  return basis === '+' ? 'Rectilinear ⊕' : 'Diagonal ⊗';
}
