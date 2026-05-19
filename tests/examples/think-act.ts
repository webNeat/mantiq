import { think, act } from 'mantiq'

export async function main() {
  const should_proceed = await think<boolean>('Should I proceed?')
  if (should_proceed) {
    await act('Do the thing')
  }
}

export function get_status(): string {
  return 'ok'
}
