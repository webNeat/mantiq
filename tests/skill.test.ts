import { $ } from 'zx'
import path from 'path'
import fs from 'fs/promises'
import { describe, it, expect } from 'vitest'

const bin = path.resolve('bin/mantiq')

describe('mantiq skill', () => {
  it('copies SKILL.md to current directory', async () => {
    const tmp_dir = await fs.mkdtemp(path.join(import.meta.dirname, 'tmp-skill-'))
    const output = await $({ cwd: tmp_dir })`${bin} skill`.quiet()
    expect(output.stdout.trim()).toBe('Skill file generated successfully!')

    const generated = await fs.readFile(path.join(tmp_dir, 'SKILL.md'), 'utf-8')
    const original = await fs.readFile('files/SKILL.md', 'utf-8')
    expect(generated).toEqual(original)
    await fs.rm(tmp_dir, { recursive: true, force: true })
  })
})
