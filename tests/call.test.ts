import { $ } from 'zx'
import path from 'path'
import { describe, it, expect } from 'vitest'

const bin = path.resolve('bin/mantiq')
const examples = './tests/examples'

describe('mantiq call', () => {
  it('calls a basic function with object parameter', async () => {
    const output = await $`${bin} call ${examples}/call-basic.ts add '{"a":1,"b":2}'`.quiet()
    expect(JSON.parse(output.stdout)).toEqual(3)
  })

  it('calls a function returning a computed value', async () => {
    const output = await $`${bin} call ${examples}/call-basic.ts multiply '{"a":3,"b":4}'`.quiet()
    expect(JSON.parse(output.stdout)).toEqual(12)
  })

  it('calls a function with a string parameter', async () => {
    const output = await $`${bin} call ${examples}/call-basic.ts greet '"world"'`.quiet()
    expect(JSON.parse(output.stdout)).toEqual('hello world')
  })

  it('calls a function with typed object parameter', async () => {
    const output = await $`${bin} call ${examples}/call-with-param.ts create_user '{"name":"Alice","age":30}'`.quiet()
    expect(JSON.parse(output.stdout)).toEqual({ id: 'usr_1', name: 'Alice', age: 30 })
  })

  it('calls a function returning a formatted string', async () => {
    const output = await $`${bin} call ${examples}/call-with-param.ts format_email '{"user":"alice","domain":"example.com"}'`.quiet()
    expect(JSON.parse(output.stdout)).toEqual('alice@example.com')
  })

  it('errors when file does not exist', async () => {
    const result = await $`${bin} call ${examples}/nonexistent.ts fn`.nothrow()
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Prompt file not found')
  })

  it('errors when function does not exist', async () => {
    const result = await $`${bin} call ${examples}/call-basic.ts nonexistent_fn`.nothrow()
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Function nonexistent_fn not found')
  })

  it('errors when parameter is invalid JSON', async () => {
    const result = await $`${bin} call ${examples}/call-basic.ts add 'not-json'`.nothrow()
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain('Invalid JSON parameter')
  })
})
