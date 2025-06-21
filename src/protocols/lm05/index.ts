type Bit = 0 | 1;
type Basis = 'Z' | 'X';
type State = 'Z0' | 'Z1' | 'X0' | 'X1';

export interface LM05Result {
  bobInitialStates: State[];
  bobBases: Basis[];
  aliceOperations: Bit[];
  bobMeasuredStates: State[];
  sharedKeyAlice: Bit[];
  sharedKeyBob: Bit[];
  errorCount: number;
  eveInterceptions?: number;
}

function getRandomBit(): Bit {
  return Math.random() < 0.5 ? 0 : 1;
}

function getRandomBasis(): Basis {
  return Math.random() < 0.5 ? 'Z' : 'X';
}

function getInitialState(basis: Basis): State {
  const states: Record<Basis, [State, State]> = {
    Z: ['Z0', 'Z1'],
    X: ['X0', 'X1'],
  };
  return states[basis][getRandomBit()];
}

function flipState(state: State): State {
  switch (state) {
    case 'Z0':
      return 'Z1';
    case 'Z1':
      return 'Z0';
    case 'X0':
      return 'X1';
    case 'X1':
      return 'X0';
  }
}

function measureStateRandomly(state: State, basis: Basis): State {
  const [s0, s1] = {
    Z: ['Z0', 'Z1'],
    X: ['X0', 'X1'],
  }[basis];

  // Если в том же базисе — измерение правильное
  if (state === s0 || state === s1) return state;
  // Иначе — результат случайный
  return Math.random() < 0.5 ? (s0 as State) : (s1 as State);
}

export function simulateLM05({
  length,
  simulateEve = false,
}: {
  length: number;
  simulateEve?: boolean;
}): LM05Result {
  const bobInitialStates: State[] = [];
  const bobBases: Basis[] = [];
  const aliceOperations: Bit[] = [];
  const bobMeasuredStates: State[] = [];
  const sharedKeyAlice: Bit[] = [];
  const sharedKeyBob: Bit[] = [];
  let errorCount = 0;
  let eveInterceptions = 0;

  for (let i = 0; i < length; i++) {
    const basis = getRandomBasis();
    const initialState = getInitialState(basis);
    bobBases.push(basis);
    bobInitialStates.push(initialState);

    let transmittedState = initialState;

    // Ева вмешивается
    if (simulateEve) {
      eveInterceptions++;
      const eveBasis1 = getRandomBasis();
      transmittedState = measureStateRandomly(transmittedState, eveBasis1); // искажение на пути к Алисе
    }

    const operation = getRandomBit(); // 0 — ничего, 1 — флип
    aliceOperations.push(operation);

    const operatedState =
      operation === 1 ? flipState(transmittedState) : transmittedState;

    // Ева снова вмешивается
    let finalState = operatedState;
    if (simulateEve) {
      const eveBasis2 = getRandomBasis();
      finalState = measureStateRandomly(finalState, eveBasis2); // искажение на пути к Бобу
    }

    bobMeasuredStates.push(finalState);

    const decodedBit = finalState === initialState ? 0 : 1;
    sharedKeyAlice.push(operation);
    sharedKeyBob.push(decodedBit);

    if (decodedBit !== operation) errorCount++;
  }

  return {
    bobInitialStates,
    bobBases,
    aliceOperations,
    bobMeasuredStates,
    sharedKeyAlice,
    sharedKeyBob,
    errorCount,
    eveInterceptions: simulateEve ? eveInterceptions : undefined,
  };
}
