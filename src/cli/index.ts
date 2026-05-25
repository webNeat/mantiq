import { Command } from 'commander'
import { alias } from './alias'
import { code } from './code'
import { call } from './call'
import { skill } from './skill'
import { version } from '@src/config.js'

export async function run(args: string[]) {
  const program = new Command()
  program.name('mantiq').description('CLI for mantiq').version(version).addCommand(code).addCommand(call).addCommand(skill).addCommand(alias)
  await program.parseAsync(args, { from: 'user' })
}
