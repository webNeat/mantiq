export async function main() {
  const greeting = await greet()
  console.log(greeting)
}

export function greet(): string {
  return 'hello'
}
