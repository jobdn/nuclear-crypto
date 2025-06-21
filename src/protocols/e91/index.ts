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

export function simulateE91({
  length,
  simulateEve = false,
}: {
  length: number;
  simulateEve?: boolean;
}): E91Result {
  const aliceBits: Bit[] = [];
  const bobBits: Bit[] = [];
  const aliceBases: Basis[] = [];
  const bobBases: BobBasis[] = [];
  const matchedIndices: number[] = [];
  const sharedKeyAlice: Bit[] = [];
  const sharedKeyBob: Bit[] = [];
  let rawAnticorrelatedPairs = 0;

  for (let i = 0; i < length; i++) {
    // Базисы
    const aBasis = getRandomAliceBasis();
    const bBasis = getRandomBobBasis();
    aliceBases.push(aBasis);
    bobBases.push(bBasis);

    let entangledBit: Bit = getRandomBit();
    let oppositeBit: Bit = entangledBit === 0 ? 1 : 0;

    // Ева вмешивается
    if (simulateEve) {
      // Она теряет запутанность. Измеренные биты — случайные
      entangledBit = getRandomBit();
      oppositeBit = getRandomBit(); // Больше не гарантированно противоположный
    }

    aliceBits.push(entangledBit);
    bobBits.push(oppositeBit);

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
