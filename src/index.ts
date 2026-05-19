export async function think<T>(prompt: string): Promise<T> {
  throw new Error(
    `think() can only be executed by an AI agent interpreting mantiq code. ` +
      `It should not be called directly. See https://github.com/webNeat/mantiq for usage.`
  )
}

export async function act<T = void>(prompt: string): Promise<T> {
  throw new Error(
    `act() can only be executed by an AI agent interpreting mantiq code. ` +
      `It should not be called directly. See https://github.com/webNeat/mantiq for usage.`
  )
}
