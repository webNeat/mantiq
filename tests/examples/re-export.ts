export async function main() {
  const a = await get_item('abc')
  const b = await get_count()
  console.log(a, b)
}

export { get_item, get_count } from './lib.js'
