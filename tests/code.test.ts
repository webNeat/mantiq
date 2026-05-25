import { $ } from 'zx'
import path from 'path'
import dedent from 'dedent'
import { describe, it, expect } from 'vitest'

const bin = path.resolve('bin/mantiq')
const examples = 'tests/examples'

describe('mantiq code', () => {
  it('handles basic exported function', async () => {
    const output = await $`${bin} code ${examples}/basic.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare function greet(): string;

        export async function main() {
          const greeting = await greet()
          console.log(greeting)
        }
      ` + '\n'
    )
  })

  it('handles async functions', async () => {
    const output = await $`${bin} code ${examples}/async.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare async function fetch_data(): Promise<string>;
        declare async function transform(input: string): Promise<string>;

        export async function main() {
          const result = await fetch_data()
          console.log(result)
        }
      ` + '\n'
    )
  })

  it('handles generic functions', async () => {
    const output = await $`${bin} code ${examples}/generic.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare function wrap<T>(value: T): { data: T; };
        declare function pair<A, B>(a: A, b: B): [A, B];

        export async function main() {
          const result = wrap('hello')
          console.log(result)
        }
      ` + '\n'
    )
  })

  it('handles arrow function exports', async () => {
    const output = await $`${bin} code ${examples}/arrow.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare const compute: async (a: number, b: number) => Promise<number>;
        declare const format_name: (first: string, last: string) => string;

        export async function main() {
          const result = await compute(1, 2)
          console.log(result)
        }
      ` + '\n'
    )
  })

  it('handles re-exports from another file', async () => {
    const output = await $`${bin} code ${examples}/re-export.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare function get_item(id: string): Promise<{ id: string; name: string; }>;
        declare function get_count(): Promise<number>;

        export async function main() {
          const a = await get_item('abc')
          const b = await get_count()
          console.log(a, b)
        }
      ` + '\n'
    )
  })

  it('handles aliased and star re-exports', async () => {
    const output = await $`${bin} code ${examples}/cross-file.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare function fetch_item(id: string): Promise<{ id: string; name: string; }>;
        declare function reset(): Promise<void>;
        declare function get_label(): Promise<string>;

        export async function main() {
          const x = await get_item('abc')
          console.log(x)
        }
      ` + '\n'
    )
  })

  it('handles inferred return types', async () => {
    const output = await $`${bin} code ${examples}/inferred-return.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare function double(x: any): number;
        declare function concat(a: any, b: any): any;

        export async function main() {
          const result = double(5)
          console.log(result)
        }
      ` + '\n'
    )
  })

  it('handles optional, rest, and destructured parameters', async () => {
    const output = await $`${bin} code ${examples}/params.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare function greet_default(name: string): string;
        declare function greet_optional(name?: string | undefined): string;
        declare function sum_all(...nums: number[]): number;
        declare function print_user(__0: { name: string; age: number; }): string;

        export async function main() {
          const a = greet_default()
          const b = greet_optional()
          const c = sum_all(1, 2, 3)
          const d = print_user({ name: 'Alice', age: 30 })
          console.log(a, b, c, d)
        }
      ` + '\n'
    )
  })

  it('excludes think and act from declarations', async () => {
    const output = await $`${bin} code ${examples}/think-act.ts`.quiet()
    expect(output.stdout).toEqual(
      dedent`
        declare function get_status(): string;

        export async function main() {
          const should_proceed = await think<boolean>('Should I proceed?')
          if (should_proceed) {
            await act('Do the thing')
          }
        }
      ` + '\n'
    )
    expect(output.stdout).not.toContain('declare function think')
    expect(output.stdout).not.toContain('declare function act')
  })

  it('errors when no main function', async () => {
    const result = await $`${bin} code ${examples}/no-main.ts`.nothrow()
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('main function not found')
  })

  it('errors when file does not exist', async () => {
    const result = await $`${bin} code ${examples}/nonexistent.ts`.nothrow()
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Could not parse file')
  })

  it('resolves alias when running code', async () => {
    await $`${bin} alias basic-alias ${examples}/basic.ts`.quiet()
    const output = await $`${bin} code basic-alias`.quiet()
    expect(output.stdout).toContain('declare function greet(): string;')
  })
})
