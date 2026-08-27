export const getRandomItem = <T>(arr: readonly T[], index?: number): T =>
  index === undefined
    ? arr[Math.floor(Math.random() * arr.length)]
    : arr.at(index % arr.length)!

export const toShuffled = <T>(arr: readonly T[]): T[] => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getRandomItems = <T>(arr: readonly T[], count: number): T[] =>
  toShuffled(arr).slice(0, count)
