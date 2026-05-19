export async function main() {
  const result = wrap('hello')
  console.log(result)
}

export function wrap<T>(value: T): { data: T } {
  return { data: value }
}

export function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}
