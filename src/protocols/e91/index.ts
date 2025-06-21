type Bit = 0 | 1;
type Basis = 'A1' | 'A2' | 'A3'; // для Алисы
type BobBasis = 'B1' | 'B2' | 'B3';

interface E91Result {
  aliceBits: Bit[];
  bobBits: Bit[];
  aliceBases: Basis[];
  bobBases: BobBasis[];
  matchedIndices: number[];
  sharedKeyAlice: Bit[];
  sharedKeyBob: Bit[];
  rawAnticorrelatedPairs: number;
}

function getRandomBit(): Bit {
  return Math.random() < 0.5 ? 0 : 1;
}

function getRandomAliceBasis(): Basis {
  const bases: Basis[] = ['A1', 'A2', 'A3'];
  return bases[Math.floor(Math.random() * 3)] as Basis;
}

function getRandomBobBasis(): BobBasis {
  const bases: BobBasis[] = ['B1', 'B2', 'B3'];
  return bases[Math.floor(Math.random() * 3)] as BobBasis;
}

export function simulateE91(length: number): E91Result {
  const aliceBits: Bit[] = [];
  const bobBits: Bit[] = [];
  const aliceBases: Basis[] = [];
  const bobBases: BobBasis[] = [];
  const matchedIndices: number[] = [];
  const sharedKeyAlice: Bit[] = [];
  const sharedKeyBob: Bit[] = [];

  let rawAnticorrelatedPairs = 0;

  for (let i = 0; i < length; i++) {
    // 1. Алиса и Боб получают запутанную пару
    const entangledBit: Bit = getRandomBit(); // Алиса
    const oppositeBit: Bit = entangledBit === 0 ? 1 : 0; // Боб

    // 2. Они выбирают базисы
    const aBasis = getRandomAliceBasis();
    const bBasis = getRandomBobBasis();

    aliceBases.push(aBasis);
    bobBases.push(bBasis);

    // 3. Имитация измерения с антикорреляцией
    aliceBits.push(entangledBit);
    bobBits.push(oppositeBit);

    // 4. Согласованные базисы для формирования ключа
    // (предположим: A1 и B1 — совместимы, A2 и B2 — совместимы)
    const compatible =
      (aBasis === 'A1' && bBasis === 'B1') ||
      (aBasis === 'A2' && bBasis === 'B2');

    if (compatible) {
      matchedIndices.push(i);
      sharedKeyAlice.push(entangledBit);
      sharedKeyBob.push(oppositeBit);
      rawAnticorrelatedPairs++;
    }
  }

  return {
    aliceBits,
    bobBits,
    aliceBases,
    bobBases,
    matchedIndices,
    sharedKeyAlice,
    sharedKeyBob,
    rawAnticorrelatedPairs,
  };
}
