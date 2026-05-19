export async function main() {
  const result = await compute(1, 2)
  console.log(result)
}

export const compute = async (a: number, b: number): Promise<number> => {
  return a + b
}

export const format_name = (first: string, last: string): string => {
  return `${first} ${last}`
}
