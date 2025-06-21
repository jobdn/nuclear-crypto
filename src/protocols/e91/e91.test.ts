import { describe, it, expect } from 'vitest';
import { simulateE91 } from './'; // обнови путь при необходимости

describe('simulateE91', () => {
  it('возвращает результат с правильной структурой', () => {
    const result = simulateE91({ length: 100 });

    expect(result).toHaveProperty('aliceBits');
    expect(result).toHaveProperty('bobBits');
    expect(result).toHaveProperty('aliceBases');
    expect(result).toHaveProperty('bobBases');
    expect(result).toHaveProperty('matchedIndices');
    expect(result).toHaveProperty('sharedKeyAlice');
    expect(result).toHaveProperty('sharedKeyBob');
    expect(result).toHaveProperty('rawAnticorrelatedPairs');

    expect(Array.isArray(result.aliceBits)).toBe(true);
    expect(Array.isArray(result.bobBits)).toBe(true);
  });

  it('sharedKeyAlice и sharedKeyBob должны иметь одинаковую длину', () => {
    const result = simulateE91({ length: 100 });

    expect(result.sharedKeyAlice.length).toBe(result.sharedKeyBob.length);
    expect(result.sharedKeyAlice.length).toBe(result.matchedIndices.length);
  });

  it('бит Алисы и Боба должны быть антикоррелированы (в симметричной части ключа)', () => {
    const result = simulateE91({ length: 200 });

    result.sharedKeyAlice.forEach((bit: any, i: number) => {
      expect(bit).not.toBe(result.sharedKeyBob[i]);
    });
  });

  it('используются только допустимые базисы и биты', () => {
    const result = simulateE91({ length: 100 });

    const validABases = ['A1', 'A2', 'A3'];
    const validBBases = ['B1', 'B2', 'B3'];
    const validBits = [0, 1];

    result.aliceBases.forEach((b: any) => expect(validABases).toContain(b));
    result.bobBases.forEach((b: any) => expect(validBBases).toContain(b));
    result.aliceBits.forEach((b: any) => expect(validBits).toContain(b));
    result.bobBits.forEach((b: any) => expect(validBits).toContain(b));
  });

  it('ключ формируется только при совместимых базисах (A1+B1, A2+B2)', () => {
    const result = simulateE91({ length: 200 });

    for (let i = 0; i < result.matchedIndices.length; i++) {
      const index = result.matchedIndices[i] as number;
      const aBasis = result.aliceBases[index];
      const bBasis = result.bobBases[index];
      const validPair =
        (aBasis === 'A1' && bBasis === 'B1') ||
        (aBasis === 'A2' && bBasis === 'B2');
      expect(validPair).toBe(true);
    }
  });

  it('при simulateEve=true антикорреляция нарушается', () => {
    const result = simulateE91({ length: 200, simulateEve: true });

    // Подсчёт количества совпадающих битов (нарушение антикорреляции)
    // @ts-ignore
    const errors = result.sharedKeyAlice.reduce((acc, bit, i) => {
      return bit === result.sharedKeyBob[i] ? acc + 1 : acc;
    }, 0);

    // В норме в E91 все биты должны быть противоположны => ошибок быть не должно
    // При атаке Евы — ошибки увеличиваются
    expect(errors).toBeGreaterThan(0);
  });

  it('антикорреляция хуже при simulateEve=true чем при simulateEve=false', () => {
    const clean = simulateE91({ length: 300, simulateEve: false });
    const attacked = simulateE91({ length: 300, simulateEve: true });
    // @ts-ignore
    const cleanErrors = clean.sharedKeyAlice.reduce((acc, bit, i) => {
      return bit === clean.sharedKeyBob[i] ? acc + 1 : acc;
    }, 0);
    // @ts-ignore
    const attackedErrors = attacked.sharedKeyAlice.reduce((acc, bit, i) => {
      return bit === attacked.sharedKeyBob[i] ? acc + 1 : acc;
    }, 0);

    expect(attackedErrors).toBeGreaterThan(cleanErrors);
  });
});
