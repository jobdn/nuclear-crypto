export function getRandomBits(length: number): number[] {
  return Array.from({ length }, () => Math.round(Math.random()));
}

export function getRandomBases(length: number): ('+' | '×')[] {
  return Array.from({ length }, () => (Math.random() < 0.5 ? '+' : '×'));
}
