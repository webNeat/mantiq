export async function main() {
  const result = double(5)
  console.log(result)
}

export function double(x) {
  return x * 2
}

export function concat(a, b) {
  return a + b
}
