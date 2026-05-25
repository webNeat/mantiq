import { Command } from 'commander'
import { load_aliases, get_agent_code } from '@src/lib'

export const code = new Command()

code
  .name('code')
  .description('Generate the TypeScript code that the agent will execute from a mantiq prompt')
  .argument('<prompt_path>', 'The path to the prompt file')
  .action(async (prompt_path) => {
    const aliases = await load_aliases()
    console.log(get_agent_code(aliases[prompt_path] || prompt_path))
  })
