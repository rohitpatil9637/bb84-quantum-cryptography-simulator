/**
 * @file bb84.test.js
 * @description Unit tests for the core BB84 protocol algorithm.
 * Run with: npm test
 */

import {
  generateRandomBits,
  generateRandomBases,
  encodePolarization,
  measureQubit,
  eveIntercept,
  siftKey,
  estimateErrorRate,
  isSecure,
  runBB84,
} from '../src/utils/bb84';

// ────────────────────────────────────────────────
// generateRandomBits
// ────────────────────────────────────────────────
describe('generateRandomBits', () => {
  test('returns array of correct length', () => {
    const bits = generateRandomBits(16);
    expect(bits).toHaveLength(16);
  });

  test('all values are 0 or 1', () => {
    const bits = generateRandomBits(100);
    bits.forEach(b => expect([0, 1]).toContain(b));
  });

  test('both 0 and 1 appear in 100 samples (probabilistic)', () => {
    const bits = generateRandomBits(100);
    expect(bits).toContain(0);
    expect(bits).toContain(1);
  });
});

// ────────────────────────────────────────────────
// generateRandomBases
// ────────────────────────────────────────────────
describe('generateRandomBases', () => {
  test('returns array of correct length', () => {
    const bases = generateRandomBases(12);
    expect(bases).toHaveLength(12);
  });

  test('all values are + or x', () => {
    const bases = generateRandomBases(100);
    bases.forEach(b => expect(['+', 'x']).toContain(b));
  });
});

// ────────────────────────────────────────────────
// encodePolarization
// ────────────────────────────────────────────────
describe('encodePolarization', () => {
  test('rectilinear + : bit 0 → 90°', () => {
    const p = encodePolarization(0, '+');
    expect(p.angle).toBe(90);
    expect(p.basis).toBe('+');
    expect(p.bit).toBe(0);
  });

  test('rectilinear + : bit 1 → 0°', () => {
    const p = encodePolarization(1, '+');
    expect(p.angle).toBe(0);
  });

  test('diagonal x : bit 0 → 45°', () => {
    const p = encodePolarization(0, 'x');
    expect(p.angle).toBe(45);
  });

  test('diagonal x : bit 1 → 135°', () => {
    const p = encodePolarization(1, 'x');
    expect(p.angle).toBe(135);
  });
});

// ────────────────────────────────────────────────
// measureQubit
// ────────────────────────────────────────────────
describe('measureQubit', () => {
  test('correct basis → always recovers original bit', () => {
    for (let bit = 0; bit <= 1; bit++) {
      for (const basis of ['+', 'x']) {
        const photon = encodePolarization(bit, basis);
        const result = measureQubit(photon, basis);
        expect(result.bit).toBe(bit);
        expect(result.correct).toBe(true);
      }
    }
  });

  test('wrong basis → correct flag is false', () => {
    const photon = encodePolarization(0, '+');
    const result = measureQubit(photon, 'x');
    expect(result.correct).toBe(false);
  });
});

// ────────────────────────────────────────────────
// eveIntercept
// ────────────────────────────────────────────────
describe('eveIntercept', () => {
  test('returns interceptedPhoton, eveBasis, eveBit', () => {
    const photon = encodePolarization(1, '+');
    const result = eveIntercept(photon);
    expect(result).toHaveProperty('interceptedPhoton');
    expect(result).toHaveProperty('eveBasis');
    expect(result).toHaveProperty('eveBit');
    expect(['+', 'x']).toContain(result.eveBasis);
    expect([0, 1]).toContain(result.eveBit);
  });

  test('interceptedPhoton has correct structure', () => {
    const photon = encodePolarization(0, 'x');
    const { interceptedPhoton } = eveIntercept(photon);
    expect(interceptedPhoton).toHaveProperty('angle');
    expect(interceptedPhoton).toHaveProperty('basis');
    expect(interceptedPhoton).toHaveProperty('bit');
  });
});

// ────────────────────────────────────────────────
// siftKey
// ────────────────────────────────────────────────
describe('siftKey', () => {
  test('keeps only matching basis positions', () => {
    const aliceBases = ['+', 'x', '+', 'x'];
    const bobBases   = ['+', '+', '+', 'x'];
    const aliceBits  = [0, 1, 1, 0];
    const bobBits    = [0, 0, 1, 0];

    const { aliceSifted, bobSifted, matchIndices } = siftKey(aliceBases, bobBases, aliceBits, bobBits);

    expect(matchIndices).toEqual([0, 2, 3]);
    expect(aliceSifted).toEqual([0, 1, 0]);
    expect(bobSifted).toEqual([0, 1, 0]);
  });

  test('empty when no bases match', () => {
    const { aliceSifted } = siftKey(['+', '+'], ['x', 'x'], [0, 1], [0, 1]);
    expect(aliceSifted).toHaveLength(0);
  });
});

// ────────────────────────────────────────────────
// estimateErrorRate
// ────────────────────────────────────────────────
describe('estimateErrorRate', () => {
  test('returns 0 for identical arrays', () => {
    expect(estimateErrorRate([0, 1, 0, 1], [0, 1, 0, 1])).toBe(0);
  });

  test('returns 1.0 for completely different arrays', () => {
    expect(estimateErrorRate([0, 0, 0], [1, 1, 1])).toBeCloseTo(1.0);
  });

  test('returns 0.5 for half errors', () => {
    expect(estimateErrorRate([0, 0, 1, 1], [1, 1, 0, 0])).toBeCloseTo(1.0);
    expect(estimateErrorRate([0, 1, 0, 1], [0, 0, 1, 1])).toBeCloseTo(0.5);
  });

  test('returns 0 for empty arrays', () => {
    expect(estimateErrorRate([], [])).toBe(0);
  });
});

// ────────────────────────────────────────────────
// isSecure
// ────────────────────────────────────────────────
describe('isSecure', () => {
  test('0% error rate is secure', () => {
    expect(isSecure(0)).toBe(true);
  });

  test('exactly 11% is secure (threshold is inclusive)', () => {
    expect(isSecure(0.11)).toBe(true);
  });

  test('above 11% is not secure', () => {
    expect(isSecure(0.12)).toBe(false);
    expect(isSecure(0.25)).toBe(false);
  });

  test('custom threshold is respected', () => {
    expect(isSecure(0.15, 0.20)).toBe(true);
    expect(isSecure(0.25, 0.20)).toBe(false);
  });
});

// ────────────────────────────────────────────────
// runBB84 — integration tests
// ────────────────────────────────────────────────
describe('runBB84 without Eve', () => {
  test('error rate is ~0 without Eve', () => {
    // Run many times and verify low average error rate
    let totalError = 0;
    const RUNS = 20;
    for (let i = 0; i < RUNS; i++) {
      const r = runBB84({ numQubits: 40, eveActive: false });
      totalError += r.errorRate;
    }
    const avgError = totalError / RUNS;
    // Without Eve, QBER should be 0 (no disturbance)
    expect(avgError).toBe(0);
  });

  test('sifted key is ~50% of total qubits', () => {
    const r = runBB84({ numQubits: 200, eveActive: false });
    const ratio = r.aliceSifted.length / r.aliceBits.length;
    // Expected ~50%, allow ±15% statistical variation
    expect(ratio).toBeGreaterThan(0.35);
    expect(ratio).toBeLessThan(0.65);
  });

  test('channel is secure without Eve', () => {
    for (let i = 0; i < 10; i++) {
      const r = runBB84({ numQubits: 32, eveActive: false });
      expect(r.secure).toBe(true);
    }
  });
});

describe('runBB84 with Eve', () => {
  test('error rate is ~25% with Eve (average over many runs)', () => {
    let totalError = 0;
    const RUNS = 30;
    for (let i = 0; i < RUNS; i++) {
      const r = runBB84({ numQubits: 64, eveActive: true });
      totalError += r.errorRate;
    }
    const avgError = totalError / RUNS;
    // Theoretical value ~0.25, allow ±0.10
    expect(avgError).toBeGreaterThan(0.12);
    expect(avgError).toBeLessThan(0.38);
  });

  test('eveData is populated when Eve is active', () => {
    const r = runBB84({ numQubits: 16, eveActive: true });
    expect(r.eveData).not.toBeNull();
    expect(r.eveData).toHaveLength(16);
  });

  test('result has all expected fields', () => {
    const r = runBB84({ numQubits: 16, eveActive: true });
    expect(r).toHaveProperty('aliceBits');
    expect(r).toHaveProperty('aliceBases');
    expect(r).toHaveProperty('bobBits');
    expect(r).toHaveProperty('bobBases');
    expect(r).toHaveProperty('aliceSifted');
    expect(r).toHaveProperty('bobSifted');
    expect(r).toHaveProperty('finalKey');
    expect(r).toHaveProperty('errorRate');
    expect(r).toHaveProperty('secure');
    expect(r).toHaveProperty('stats');
    expect(r.stats).toHaveProperty('totalQubits');
    expect(r.stats).toHaveProperty('siftedKeyLength');
    expect(r.stats).toHaveProperty('finalKeyLength');
    expect(r.stats).toHaveProperty('efficiency');
  });
});
