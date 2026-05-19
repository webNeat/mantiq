import { Command } from 'commander'
import { get_agent_code } from '@src/lib'

export const code = new Command()

code
  .name('code')
  .description('Generate the TypeScript code that the agent will execute from a mantiq prompt')
  .argument('<prompt_path>', 'The path to the prompt file')
  .action((prompt_path) => {
    console.log(get_agent_code(prompt_path))
  })
