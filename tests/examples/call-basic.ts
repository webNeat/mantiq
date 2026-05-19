export function add({ a, b }: { a: number; b: number }): number {
  return a + b
}

export function multiply({ a, b }: { a: number; b: number }): number {
  return a * b
}

export function greet(name: string): string {
  return `hello ${name}`
}
