import { describe, it, expect } from 'vitest';
import { simulateBB84 } from '.';

describe('bb84.tests', () => {
  it('должна возвращать результат с корректной структурой', () => {
    const result = simulateBB84({ length: 50 });

    expect(result).toHaveProperty('key');
    expect(result).toHaveProperty('errorRate');
    expect(result).toHaveProperty('steps');

    expect(typeof result.key).toBe('string');
    expect(typeof result.errorRate).toBe('number');
    expect(Array.isArray(result.steps)).toBe(true);
    expect(result.key).toMatch(/^[01]*$/);
  });

  it('без Евы: errorRate должен быть близок к 0', () => {
    const result = simulateBB84({ length: 100, simulateEve: false });
    expect(result.errorRate).toBeLessThanOrEqual(0.05); // 0 или очень мало
  });

  it('с Евой: errorRate должен быть больше, чем без неё', () => {
    const withoutEve = simulateBB84({ length: 200, simulateEve: false });
    const withEve = simulateBB84({ length: 200, simulateEve: true });

    expect(withEve.errorRate).toBeGreaterThan(withoutEve.errorRate);
  });

  it('steps должны содержать ключевые строки лога', () => {
    const result = simulateBB84({ length: 20, simulateEve: true });

    const hasAliceBits = result.steps.some((s) =>
      s.includes('Алиса сгенерировала биты'),
    );
    const hasEveBits = result.steps.some((s) => s.includes('Ева перехватила'));
    const hasBobBits = result.steps.some((s) => s.includes('Боб получил биты'));
    const hasKey = result.steps.some((s) => s.includes('Итоговый ключ'));

    expect(hasAliceBits).toBe(true);
    expect(hasEveBits).toBe(true);
    expect(hasBobBits).toBe(true);
    expect(hasKey).toBe(true);
  });
});
