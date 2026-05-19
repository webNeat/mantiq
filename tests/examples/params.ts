export async function main() {
  const a = greet_default()
  const b = greet_optional()
  const c = sum_all(1, 2, 3)
  const d = print_user({ name: 'Alice', age: 30 })
  console.log(a, b, c, d)
}

export function greet_default(name: string = 'world'): string {
  return `hello ${name}`
}

export function greet_optional(name?: string): string {
  return `hello ${name ?? 'world'}`
}

export function sum_all(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}

export function print_user({ name, age }: { name: string; age: number }): string {
  return `${name} is ${age}`
}
