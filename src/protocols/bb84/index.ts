import { getRandomBits, getRandomBases } from '../../utils/random';

type Basis = '+' | '×';

interface BB84Options {
  length: number;
  simulateEve?: boolean;
}

interface BB84Result {
  key: string;
  errorRate: number;
  steps: string[];
}

export function simulateBB84(options: BB84Options): BB84Result {
  const { length, simulateEve = false } = options;
  const steps: string[] = [];

  // 1. Алиса генерирует случайные биты и базисы
  const aliceBits = getRandomBits(length);
  const aliceBases = getRandomBases(length);
  steps.push(`Алиса сгенерировала биты: ${aliceBits}`);
  steps.push(`Алиса выбрала базисы:     ${aliceBases}`);

  // 2. Ева (если есть) выбирает свои базисы и искажает фотоны
  let transmittedBits = aliceBits.slice();
  let transmittedBases = aliceBases.slice();
  if (simulateEve) {
    const eveBases = getRandomBases(length);
    const eveMeasurements = transmittedBits.map((bit, i) => {
      return eveBases[i] === transmittedBases[i]
        ? bit
        : Math.round(Math.random());
    });
    transmittedBits = eveMeasurements;
    transmittedBases = eveBases;
    steps.push(`Ева перехватила и заново отправила биты: ${transmittedBits}`);
    steps.push(`Ева использовала базисы:                ${eveBases}`);
  }

  // 3. Боб выбирает свои базисы и измеряет
  const bobBases = getRandomBases(length);
  const bobBits = transmittedBits.map((bit, i) => {
    return bobBases[i] === transmittedBases[i]
      ? bit
      : Math.round(Math.random());
  });

  steps.push(`Боб выбрал базисы:         ${bobBases}`);
  steps.push(`Боб получил биты:           ${bobBits}`);

  // 4. Сравнение базисов: оставляем только совпавшие
  const finalKeyBits: number[] = [];
  let errorCount = 0;
  let matchCount = 0;

  for (let i = 0; i < length; i++) {
    if (aliceBases[i] === bobBases[i]) {
      matchCount++;
      finalKeyBits.push(bobBits[i] as number);
      if (bobBits[i] !== aliceBits[i]) errorCount++;
    }
  }

  const errorRate = matchCount === 0 ? 0 : errorCount / matchCount;
  const finalKey = finalKeyBits.join('');

  steps.push(`Совпавших базисов: ${matchCount}`);
  steps.push(`Ошибок в совпавших: ${errorCount}`);
  steps.push(`Итоговый ключ:       ${finalKey}`);
  steps.push(`Уровень ошибок:      ${errorRate.toFixed(4)}`);

  return {
    key: finalKey,
    errorRate,
    steps,
  };
}
