---
name: mantiq
description: Execute TypeScript prompts as structured AI workflows. Use when the user runs /mantiq <filepath>.
allowed-tools: Bash(mantiq *)
argument-hint: <filepath>
---

When the user runs `/mantiq <filepath>`, follow the steps below.

## Step 1 — Get the code

Run the following command to retrieve the TypeScript code to execute:

```bash
mantiq code <filepath>
```

This outputs TypeScript code containing:

- Function declarations at the top
- The `main` function body with all logic

**DO NOT read the <filepath> file directly.** Use the `mantiq code` command to get the code.

## Step 2 — Execute the code

Execute the `main` function line by line as a TypeScript runtime.

### Declared function calls

When you encounter a call to a declared function, execute it by running:

```bash
mantiq call <filepath> <function_name> <args>
```

Arguments must be passed as a single JSON string. For example:

```bash
mantiq call ./review.ts approve_review '{"id": "abc123"}'
```

The output is the return value of the function, serialized as JSON.

### `think<T>(question)`

This is a special function. When you encounter a call to `think`, you must think about the question and return a value of the specified type `T`.

Do **not** run `mantiq call` for `think`. Instead, reason about the question and provide the answer yourself in the requested type.

Examples:

- `think<boolean>("Is this email spam? " + email)` → return `true` or `false`
- `think<'positive' | 'negative' | 'neutral'>("Analyze sentiment: " + text)` → return one of the union members
- `think<string>("Write a commit message for: " + diff)` → return a string

### `act<T>(task)`

This is a special function. When you encounter a call to `act`, you must perform the described task using your available tools.

Do **not** run `mantiq call` for `act`. Instead, carry out the task yourself.

If a return type `T` is specified (other than `void`), return the result in that type.

Examples:

- `act("Commit the changes with message: " + msg)` → commit the changes, return nothing
- `act<number>("Ask the user their age")` → ask the user and return the number

## Rules

- Execute the `main` function in order, respecting all control flow (`while`, `if/else`, `try/catch`).
- Store return values in variables and use them in subsequent lines.
- Do **not** skip lines or take shortcuts. Execute every statement.
- If an error occurs during execution, report it to the user clearly.
