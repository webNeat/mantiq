import path from 'path'
import fs from 'fs/promises'
import { Command } from 'commander'
import { files_path } from '@src/config.js'

export const skill = new Command()

skill
  .name('skill')
  .description('Generate the mantiq skill file in the current directory')
  .action(async () => {
    await fs.cp(path.join(files_path, 'SKILL.md'), './SKILL.md')
    console.log('Skill file generated successfully!')
  })
