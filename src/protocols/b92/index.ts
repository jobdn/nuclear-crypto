type Bit = 0 | 1;
type State = 'Z0' | 'X0'; // Z0 ≡ |0⟩, X0 ≡ |+⟩

type B92SimulationResult = {
  aliceBits: Bit[];
  aliceStates: State[];
  bobBits: Bit[];
  matchedIndices: number[];
  sharedKeyAlice: Bit[];
  sharedKeyBob: Bit[];
};

function getRandomBit(): Bit {
  return Math.random() < 0.5 ? 0 : 1;
}

function generateAliceSequence(length: number): {
  bits: Bit[];
  states: State[];
} {
  const bits: Bit[] = [];
  const states: State[] = [];

  for (let i = 0; i < length; i++) {
    const bit = getRandomBit();
    bits.push(bit);
    states.push(bit === 0 ? 'Z0' : 'X0');
  }

  return { bits, states };
}

function bobMeasure(state: State): Bit | null {
  // Боб случайно выбирает базис для проективного измерения
  const basis = Math.random() < 0.5 ? 'Z1' : 'X1'; // Z1 ≡ |1⟩, X1 ≡ |−⟩

  // Если Боб получает проекцию, он знает, что Алиса НЕ посылала этот базис
  // Простейшая симуляция с вероятностью 0.5 "успешного измерения"
  const detected = Math.random() < 0.5;

  if (!detected) return null;

  if (state === 'Z0' && basis === 'X1') return 0;
  if (state === 'X0' && basis === 'Z1') return 1;

  return null;
}

export function simulateB92(
  length: number,
  simulateEve = false,
): B92SimulationResult {
  const { bits: aliceBits, states: aliceStates } =
    generateAliceSequence(length);
  const bobBits: Bit[] = [];
  const matchedIndices: number[] = [];

  const eveBases: ('Z1' | 'X1' | '-')[] = [];
  const eveMeasurements: (Bit | '-')[] = [];

  for (let i = 0; i < length; i++) {
    let transmittedState = aliceStates[i];

    // Ева вмешивается
    if (simulateEve) {
      const eveBasis = Math.random() < 0.5 ? 'Z1' : 'X1';
      const detected = Math.random() < 0.5;

      eveBases.push(eveBasis);

      if (!detected) {
        eveMeasurements.push('-');
        // Ева не повлияла — передаётся исходное состояние
      } else {
        // Ева измеряет и искажает состояние
        let eveBit: Bit | null = null;
        if (transmittedState === 'Z0' && eveBasis === 'X1') eveBit = 0;
        if (transmittedState === 'X0' && eveBasis === 'Z1') eveBit = 1;
        eveMeasurements.push(eveBit ?? '-');

        // После измерения Ева повторно отправляет фотон, соответствующий своему измерению
        if (eveBit === 0) transmittedState = 'Z0';
        else if (eveBit === 1) transmittedState = 'X0';
        else transmittedState = Math.random() < 0.5 ? 'Z0' : 'X0';
      }
    } else {
      eveBases.push('-');
      eveMeasurements.push('-');
    }

    // Боб измеряет
    const result = bobMeasure(transmittedState as State);
    if (result !== null) {
      bobBits.push(result);
      matchedIndices.push(i);
    }
  }

  const sharedKeyAlice = matchedIndices.map((i) => aliceBits[i]) as Bit[];
  const sharedKeyBob = [...bobBits];

  return {
    aliceBits,
    aliceStates,
    bobBits,
    matchedIndices,
    sharedKeyAlice,
    sharedKeyBob,
    // optionally, you can return eveBases and eveMeasurements for debug
  };
}
