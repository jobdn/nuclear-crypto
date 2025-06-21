type Bit = 0 | 1;
type Basis = 'Z' | 'X';
type State = '|0⟩' | '|1⟩' | '|+⟩' | '|−⟩';

interface SARG04Result {
  aliceBits: Bit[];
  aliceBases: Basis[];
  aliceStates: State[];
  statePairs: [State, State][];
  eveBases: (Basis | '-')[];
  eveMeasurements: (State | '-')[];
  bobBases: Basis[];
  bobMeasurements: State[];
  sharedKeyAlice: Bit[];
  sharedKeyBob: Bit[];
  matchedIndices: number[];
  errorsIntroducedByEve: number;
}

// Набор квантовых состояний
const STATES: Record<Basis, [State, State]> = {
  Z: ['|0⟩', '|1⟩'],
  X: ['|+⟩', '|−⟩'],
};

function measureState(inputState: State, basis: Basis): State {
  const [s0, s1] = STATES[basis];
  // Если состояние совпадает с одним из базисных — измерение почти точно
  if (inputState === s0 || inputState === s1) {
    return inputState;
  }
  // Иначе — с вероятностью 0.5 одно из состояний в базисе
  return Math.random() < 0.5 ? s0 : s1;
}

// Основная функция симуляции
export function simulateSARG04({
  length,
  simulateEve = false,
}: {
  length: number;
  simulateEve?: boolean;
}): SARG04Result {
  const aliceBits: Bit[] = [];
  const aliceBases: Basis[] = [];
  const aliceStates: State[] = [];
  const statePairs: [State, State][] = [];
  const eveBases: (Basis | '-')[] = [];
  const eveMeasurements: (State | '-')[] = [];
  const bobBases: Basis[] = [];
  const bobMeasurements: State[] = [];
  const sharedKeyAlice: Bit[] = [];
  const sharedKeyBob: Bit[] = [];
  const matchedIndices: number[] = [];
  let errors = 0;

  for (let i = 0; i < length; i++) {
    // 1. Алиса генерирует бит и базис
    const bit: Bit = Math.random() < 0.5 ? 0 : 1;
    const basis: Basis = Math.random() < 0.5 ? 'Z' : 'X';
    const state: State = STATES[basis][bit];
    const pair: [State, State] = STATES[basis];

    aliceBits.push(bit);
    aliceBases.push(basis);
    aliceStates.push(state);
    statePairs.push(pair);

    let transmittedState = state;

    // 2. Ева перехватывает и искажает
    if (simulateEve) {
      const eveBasis: Basis = Math.random() < 0.5 ? 'Z' : 'X';
      const eveBit: Bit = Math.random() < 0.5 ? 0 : 1;
      const eveState: State = STATES[eveBasis][eveBit];

      eveBases.push(eveBasis);
      eveMeasurements.push(eveState);
      transmittedState = eveState;
    } else {
      eveBases.push('-');
      eveMeasurements.push('-');
    }

    // 3. Боб измеряет
    const bobBasis: Basis = Math.random() < 0.5 ? 'Z' : 'X';
    const bobMeasurement: State = measureState(transmittedState, bobBasis);

    bobBases.push(bobBasis);
    bobMeasurements.push(bobMeasurement);

    // 4. Восстановление бита
    if (pair.includes(bobMeasurement)) {
      const recoveredBit: Bit = pair.indexOf(bobMeasurement) as Bit;
      sharedKeyAlice.push(bit);
      sharedKeyBob.push(recoveredBit);
      matchedIndices.push(i);

      if (recoveredBit !== bit && simulateEve) {
        errors++;
      }
    }
  }

  return {
    aliceBits,
    aliceBases,
    aliceStates,
    statePairs,
    eveBases,
    eveMeasurements,
    bobBases,
    bobMeasurements,
    sharedKeyAlice,
    sharedKeyBob,
    matchedIndices,
    errorsIntroducedByEve: errors,
  };
}
