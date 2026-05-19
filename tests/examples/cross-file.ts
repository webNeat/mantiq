export async function main() {
  const x = await get_item('abc')
  console.log(x)
}

export { get_item as fetch_item } from './lib.js'
export * from './lib2.js'
