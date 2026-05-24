# mantiq

Write AI prompts in TypeScript and run them with any harness that supports skills (claude code, codex, opencode, copilot, cursor, windsurf, etc.)

## Why mantiq?

Human language is inherently ambiguous and when we add that to LLMs tendency to hallucinate and take shortcuts, we get very unpredictable results.

**mantiq** is a try to have more control and predictable results by using TypeScript as the prompt language and asking the agent to behave like a TypeScript runtime:

- **Explicit control flow**: while, if/else, try/catch are structured checkpoints the LLM must follow, not vague directions it can reinterpret.
- **Your code stays private**: The agent only sees function declarations, never your source code, API keys, or internal logic.
- **No MCP server or custom plugins needed**: Your functions run as plain TypeScript. The agent calls them via the CLI.

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage in 2 steps](#usage-in-2-steps)
- [How it works](#how-it-works)
- [Writing mantiq prompts](#writing-mantiq-prompts)
- [Two important conventions](#two-important-conventions)

## Requirements

- [Node.js 24+](https://nodejs.org/)
- A harness/agent that supports skills (claude code, codex, opencode, copilot, cursor, windsurf, etc.)

## Installation

1. Install the CLI globally

```bash
npm install -g mantiq
```

2. Generate the skill file with `mantiq skill`. This will create a `SKILL.md` file in the current directory.
3. Add the skill file to your harness.

## Usage in 2 steps

1. Write a mantiq prompt in a TypeScript file. (check the [Writing mantiq prompts](#writing-mantiq-prompts) section below for more details)
2. Run the prompt in your harness with `/mantiq /path/to/my-prompt.ts`

## Quick example

**Situation:**

Let's say you have a long list of pending reviews on your platform and you want to filter out the ones with offensive language.
You want the agent to use your API to read the pending reviews one by one and decide whether to approve or reject them.

**Constraints:**

- You don't have an MCP server to connect to your API
- You don't have custom tools/plugins for your harness to connect to your API
- You already can easily write TypeScript functions that connect to your API but you don't want to expose the source code or the API keys to the agent

**Solution:**

Use the following mantiq prompt:

```ts
import { think } from 'mantiq'

export async function main() {
  while (await has_pending_reviews()) {
    const review = await get_next_review()
    const contains_offensive_language = await think<boolean>(`Does this review contain offensive language? ${review.text}`)
    if (contains_offensive_language) {
      await reject_review({ id: review.id })
    } else {
      await approve_review({ id: review.id })
    }
  }
}

export async function has_pending_reviews(): Promise<boolean> {
  // your implementation here
}

export async function get_next_review(): Promise<{ id: string; text: string }> {
  // your implementation here
}

export async function approve_review({ id }: { id: string }): Promise<void> {
  // your implementation here
}

export async function reject_review({ id }: { id: string }): Promise<void> {
  // your implementation here
}
```

## How it works

- You type `/mantiq /path/to/my-prompt.ts` in your harness
- The harness loads the mantiq skill
- The skill instruct the agent to run the command `mantiq code <filename>` and interpret the code as a TypeScript runtime.
- The code returned by `mantiq code` command only contains the `main` function and declarations of other functions used by the main function. So for the example above, the code would be

```ts
declare function has_pending_reviews(): Promise<boolean>
declare function get_next_review(): Promise<{ id: string; text: string }>
declare function approve_review({ id }: { id: string }): Promise<void>
declare function reject_review({ id }: { id: string }): Promise<void>

async function main() {
  // all main code ...
}
```

Note that:

- All imports and functions other than `main` are removed, and only the declarations of the functions used by `main` are added at the top.
- The special function `think` is not included in the declarations.
- The agent executes the code, line by line
- When the agent encounters a call to one of the declared functions, it runs `mantiq call <filename> <fn-name> <args>` to execute the function
- When the agent encounters a call to `think`, it thinks about the question and returns the answer in the specified type

Note that `think` is not the only special function, The [Writing mantiq prompts](#writing-mantiq-prompts) section lists all special functions that mantiq offers.

## Writing mantiq prompts

A mantiq prompt is a TypeScript file of the following format:

```ts
import { act, think } from 'mantiq'
import { foo } from './foo'

export { foo }

export function bar() {
  // your implementation here
}

export async function main() {
  // can use `foo`, `bar`, `act`, `think` functions here
}
```

### Rules

- A mantiq prompt must export a `main` function, this is the entry point that is executed by the agent.
- The `main` function can call other functions, but those functions must be exported too (like `foo` and `bar` in the example above).
- The `main` function can use the special functions `act` and `think` provided by the `mantiq` package. These don't have to be exported.
- All exported functions must be stateless (do not rely on global variables shared between different calls), because the `mantiq call` command will call them on a separate process each time.
- All exported functions must have at most one parameter. if the function needs multiple parameters, they should be passed as a single object.
- The special functions (`think` and `act`) can only be called from the `main` function. Calling them from other functions will result in an error.

I know these rules limit how flexible mantiq prompts can be, but they are necessary to make the implementation easy and bug free. Feel free to open an issue if you have a use case that requires more flexibility and I will try to reduce the restrictions.

### Special functions

The `mantiq` package provides a list of special functions that can be used in the `main` function to direct the agent's behavior:

### `think`

Tells the agent to think about a question and return the answer in the specified type.

```ts
function think<T>(question: string): Promise<T>
```

**Examples:**

```ts
const message = `some text ...`
const sentiment = await think<'positive' | 'negative' | 'neutral'>('Analyze the sentiment of the following message: ' + message)
```

```ts
const git_diff = `...`
const commit_message = await think<string>('Write a commit message for the following git diff: ' + git_diff)
```

### `act`

Asks the agent to do some action

```ts
function act<T = void>(task: string): Promise<T>
```

**Examples:**

```ts
const commit_message = 'Add new feature ...'
await act('Commit the changes with the following message: ' + commit_message)
```

```ts
await act('Give the user a summary of what you did')
```

```ts
const age = await act<number>('Ask the user their age')
```

## Next steps

- Add a new `mantiq alias <name> <script-path>` command to create aliases for specific scripts, so it's easier to execute them with `/mantiq <name>` and the source code is totally hidden from the agent.

- Add a validation step to `mantiq code` to check that the script follows the constraints before returning the code to the agent:
  - Check that a `main` function is exported
  - Check that all exported functions have at most one parameter
  - Check that only the `main` function calls `think` and `act` functions
  - Check that all other functions called by the `main` function are exported
