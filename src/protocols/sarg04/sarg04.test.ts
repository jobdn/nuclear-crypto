import { describe, it, expect } from 'vitest';
import { simulateSARG04 } from '.';

describe('simulateSARG04', () => {
  it('возвращает корректную структуру', () => {
    const result = simulateSARG04({ length: 50 });

    expect(result).toHaveProperty('aliceBits');
    expect(result).toHaveProperty('aliceBases');
    expect(result).toHaveProperty('aliceStates');
    expect(result).toHaveProperty('statePairs');
    expect(result).toHaveProperty('eveBases');
    expect(result).toHaveProperty('eveMeasurements');
    expect(result).toHaveProperty('bobBases');
    expect(result).toHaveProperty('bobMeasurements');
    expect(result).toHaveProperty('sharedKeyAlice');
    expect(result).toHaveProperty('sharedKeyBob');
    expect(result).toHaveProperty('matchedIndices');
    expect(result).toHaveProperty('errorsIntroducedByEve');
  });

  it('sharedKeyAlice и sharedKeyBob имеют одинаковую длину', () => {
    const result = simulateSARG04({ length: 100 });

    expect(result.sharedKeyAlice.length).toBe(result.sharedKeyBob.length);
    expect(result.sharedKeyAlice.length).toBe(result.matchedIndices.length);
  });

  it('при simulateEve = false ошибок быть не должно', () => {
    const result = simulateSARG04({ length: 200, simulateEve: false });

    expect(result.errorsIntroducedByEve).toBe(0);

    for (let i = 0; i < result.sharedKeyAlice.length; i++) {
      expect(result.sharedKeyAlice[i]).toBe(result.sharedKeyBob[i]);
    }
  });

  it('при simulateEve = true возникают ошибки', () => {
    const result = simulateSARG04({ length: 200, simulateEve: true });

    const mismatches = result.sharedKeyAlice.filter(
      (bit: any, i: number) => bit !== result.sharedKeyBob[i],
    ).length;

    expect(result.errorsIntroducedByEve).toBeGreaterThan(0);
    expect(mismatches).toBeGreaterThan(0);
  });

  it('все состояния и базисы допустимы', () => {
    const result = simulateSARG04({ length: 100 });

    const validBits = [0, 1];
    const validBases = ['Z', 'X'];
    const validStates = ['|0⟩', '|1⟩', '|+⟩', '|−⟩'];
    const validEve = ['Z', 'X', '-'];

    result.aliceBits.forEach((b: any) => expect(validBits).toContain(b));
    result.aliceBases.forEach((b: any) => expect(validBases).toContain(b));
    result.aliceStates.forEach((s: any) => expect(validStates).toContain(s));
    result.bobBases.forEach((b: any) => expect(validBases).toContain(b));
    result.bobMeasurements.forEach((s: any) =>
      expect(validStates).toContain(s),
    );
    result.eveBases.forEach((b: any) => expect(validEve).toContain(b));
    result.eveMeasurements.forEach((s: string) => {
      if (s !== '-') expect(validStates).toContain(s);
    });
  });
});
