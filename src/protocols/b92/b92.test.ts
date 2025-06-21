import { describe, it, expect } from 'vitest';
import { simulateB92 } from './'; // измени путь при необходимости

describe('simulateB92', () => {
  it('должна возвращать корректную структуру', () => {
    const result = simulateB92(50);

    expect(result).toHaveProperty('aliceBits');
    expect(result).toHaveProperty('aliceStates');
    expect(result).toHaveProperty('bobBits');
    expect(result).toHaveProperty('matchedIndices');
    expect(result).toHaveProperty('sharedKeyAlice');
    expect(result).toHaveProperty('sharedKeyBob');

    expect(Array.isArray(result.aliceBits)).toBe(true);
    expect(Array.isArray(result.bobBits)).toBe(true);
    expect(Array.isArray(result.sharedKeyAlice)).toBe(true);
    expect(Array.isArray(result.sharedKeyBob)).toBe(true);
    expect(Array.isArray(result.matchedIndices)).toBe(true);
  });

  it('sharedKeyAlice и sharedKeyBob должны иметь одинаковую длину', () => {
    const result = simulateB92(100);

    expect(result.sharedKeyAlice.length).toBe(result.sharedKeyBob.length);
    expect(result.sharedKeyAlice.length).toBe(result.matchedIndices.length);
  });

  it('sharedKeyAlice должны быть корректно извлечены из aliceBits по matchedIndices', () => {
    const result = simulateB92(100);

    for (let i = 0; i < result.matchedIndices.length; i++) {
      const index = result.matchedIndices[i] as number;
      expect(result.sharedKeyAlice[i]).toBe(result.aliceBits[index]);
    }
  });

  it('все значения битов должны быть 0 или 1, состояния — Z0 или X0', () => {
    const result = simulateB92(100);

    for (const bit of result.aliceBits) {
      expect([0, 1]).toContain(bit);
    }

    for (const bit of result.bobBits) {
      expect([0, 1]).toContain(bit);
    }

    for (const state of result.aliceStates) {
      expect(['Z0', 'X0']).toContain(state);
    }
  });

  it('в случае совпадений ключи должны быть похожи (ошибок почти нет)', () => {
    const result = simulateB92(200);
    const mismatches = result.sharedKeyAlice.filter(
      (bit, i) => bit !== result.sharedKeyBob[i],
    ).length;

    const errorRate =
      result.sharedKeyAlice.length > 0
        ? mismatches / result.sharedKeyAlice.length
        : 0;

    expect(errorRate).toBeLessThan(0.3); // т.к. без Евы, ошибки только от детектирования
  });

  it('при наличии Евы возрастает количество ошибок', () => {
    const noEve = simulateB92(200, false);
    const withEve = simulateB92(200, true);

    const errorsNoEve = noEve.sharedKeyAlice.filter(
      (bit, i) => bit !== noEve.sharedKeyBob[i],
    ).length;

    const errorsWithEve = withEve.sharedKeyAlice.filter(
      (bit, i) => bit !== withEve.sharedKeyBob[i],
    ).length;

    const errorRateNoEve =
      noEve.sharedKeyAlice.length > 0
        ? errorsNoEve / noEve.sharedKeyAlice.length
        : 0;

    const errorRateWithEve =
      withEve.sharedKeyAlice.length > 0
        ? errorsWithEve / withEve.sharedKeyAlice.length
        : 0;

    expect(errorRateWithEve).toBeGreaterThanOrEqual(errorRateNoEve);
  });
});
