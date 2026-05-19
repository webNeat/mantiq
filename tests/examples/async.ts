export async function main() {
  const result = await fetch_data()
  console.log(result)
}

export async function fetch_data(): Promise<string> {
  return 'data'
}

export async function transform(input: string): Promise<string> {
  return input.toUpperCase()
}
