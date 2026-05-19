export async function main() {
  // no main for this test
}

export function create_user({ name, age }: { name: string; age: number }): { id: string; name: string; age: number } {
  return { id: 'usr_1', name, age }
}

export function format_email({ user, domain }: { user: string; domain: string }): string {
  return `${user}@${domain}`
}
