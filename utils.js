export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const inRange = (x, a, b) => {
  return (b >= a && b <= a + x) || (b <= a && b >= a - x)
}
