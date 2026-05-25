import { Command } from 'commander'
import { load_aliases, save_aliases } from '@src/lib'

export const alias = new Command()

alias
  .name('alias')
  .description('Create an alias for a mantiq prompt')
  .argument('<alias_name>', 'The name of the alias to create')
  .argument('<prompt_path>', 'The path to the prompt file')
  .action(async (alias_name, prompt_path) => {
    const aliases = await load_aliases()
    aliases[alias_name] = prompt_path
    await save_aliases(aliases)
  })
