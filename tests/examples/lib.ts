export function get_item(id: string): Promise<{ id: string; name: string }> {
  return Promise.resolve({ id, name: `item-${id}` })
}

export function get_count(): Promise<number> {
  return Promise.resolve(42)
}
