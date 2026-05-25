import { $ } from 'zx'
import path from 'path'
import fs from 'fs/promises'
import { describe, it, expect, beforeEach } from 'vitest'
import { config_path } from '@src/config'

const bin = path.resolve('bin/mantiq')

describe('mantiq alias', () => {
  beforeEach(async () => {
    await fs.writeFile(config_path, '{}')
  })

  it('creates a new alias', async () => {
    const result = await $`${bin} alias my-alias ./prompts/hello.ts`.quiet()
    expect(result.exitCode).toBe(0)
    const config = JSON.parse(await fs.readFile(config_path, 'utf-8'))
    expect(config.aliases['my-alias']).toBe('./prompts/hello.ts')
  })

  it('overwrites an existing alias', async () => {
    await $`${bin} alias my-alias ./old.ts`.quiet()
    await $`${bin} alias my-alias ./new.ts`.quiet()
    const config = JSON.parse(await fs.readFile(config_path, 'utf-8'))
    expect(config.aliases['my-alias']).toBe('./new.ts')
  })

  it('creates multiple aliases', async () => {
    await $`${bin} alias first ./a.ts`.quiet()
    await $`${bin} alias second ./b.ts`.quiet()
    const config = JSON.parse(await fs.readFile(config_path, 'utf-8'))
    expect(config.aliases['first']).toBe('./a.ts')
    expect(config.aliases['second']).toBe('./b.ts')
  })

  it('preserves existing aliases when adding new ones', async () => {
    await fs.writeFile(config_path, JSON.stringify({ aliases: { existing: './old.ts' } }))
    await $`${bin} alias new-one ./new.ts`.quiet()
    const config = JSON.parse(await fs.readFile(config_path, 'utf-8'))
    expect(config.aliases['existing']).toBe('./old.ts')
    expect(config.aliases['new-one']).toBe('./new.ts')
  })
})
