type Bit = 0 | 1;
type Basis = 'Z' | 'X';
type State = 'Z0' | 'Z1' | 'X0' | 'X1';

interface LM05Result {
  bobInitialStates: State[];
  bobBases: Basis[];
  aliceOperations: Bit[];
  bobMeasuredStates: State[];
  sharedKeyAlice: Bit[];
  sharedKeyBob: Bit[];
  errorCount: number;
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

export function simulateLM05(length: number): LM05Result {
  const bobInitialStates: State[] = [];
  const bobBases: Basis[] = [];
  const aliceOperations: Bit[] = [];
  const bobMeasuredStates: State[] = [];
  const sharedKeyAlice: Bit[] = [];
  const sharedKeyBob: Bit[] = [];
  let errorCount = 0;

  for (let i = 0; i < length; i++) {
    const basis = getRandomBasis();
    const initialState = getInitialState(basis);
    const operation = getRandomBit(); // 0 — ничего, 1 — флип

    bobInitialStates.push(initialState);
    bobBases.push(basis);
    aliceOperations.push(operation);

    const returnedState =
      operation === 0 ? initialState : flipState(initialState);
    bobMeasuredStates.push(returnedState);

    sharedKeyAlice.push(operation);
    const decodedBit = returnedState === initialState ? 0 : 1;
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
  };
}
