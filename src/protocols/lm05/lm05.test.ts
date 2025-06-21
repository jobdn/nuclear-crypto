import { describe, it, expect } from 'vitest';
import { simulateLM05 } from './'; // Обнови путь при необходимости

describe('simulateLM05', () => {
  it('возвращает корректную структуру', () => {
    const result = simulateLM05(50);

    expect(result).toHaveProperty('bobInitialStates');
    expect(result).toHaveProperty('bobBases');
    expect(result).toHaveProperty('aliceOperations');
    expect(result).toHaveProperty('bobMeasuredStates');
    expect(result).toHaveProperty('sharedKeyAlice');
    expect(result).toHaveProperty('sharedKeyBob');
    expect(result).toHaveProperty('errorCount');
  });

  it('все массивы должны иметь одинаковую длину', () => {
    const result = simulateLM05(100);

    const len = result.sharedKeyAlice.length;
    expect(result.bobInitialStates.length).toBe(len);
    expect(result.bobBases.length).toBe(len);
    expect(result.aliceOperations.length).toBe(len);
    expect(result.bobMeasuredStates.length).toBe(len);
    expect(result.sharedKeyBob.length).toBe(len);
  });

  it('бит Боба должен совпадать с операцией Алисы при отсутствии ошибок', () => {
    const result = simulateLM05(100);

    for (let i = 0; i < result.sharedKeyAlice.length; i++) {
      const a = result.sharedKeyAlice[i];
      const b = result.sharedKeyBob[i];
      if (a !== b) {
        expect(result.errorCount).toBeGreaterThan(0);
        break;
      }
    }
  });

  it('все состояния и базисы допустимы', () => {
    const result = simulateLM05(50);
    const validStates = ['Z0', 'Z1', 'X0', 'X1'];
    const validBases = ['Z', 'X'];
    const validBits = [0, 1];

    result.bobInitialStates.forEach((s: any) =>
      expect(validStates).toContain(s),
    );
    result.bobMeasuredStates.forEach((s: any) =>
      expect(validStates).toContain(s),
    );
    result.bobBases.forEach((b: any) => expect(validBases).toContain(b));
    result.aliceOperations.forEach((bit: any) =>
      expect(validBits).toContain(bit),
    );
    result.sharedKeyAlice.forEach((bit: any) =>
      expect(validBits).toContain(bit),
    );
    result.sharedKeyBob.forEach((bit: any) => expect(validBits).toContain(bit));
  });

  it('в simulateLM05(0) ключи должны быть пустыми и ошибок 0', () => {
    const result = simulateLM05(0);
    expect(result.sharedKeyAlice).toHaveLength(0);
    expect(result.sharedKeyBob).toHaveLength(0);
    expect(result.errorCount).toBe(0);
  });
});
