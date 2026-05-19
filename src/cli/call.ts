import { Command } from 'commander'
import { call_prompt_fn } from '@src/lib'

export const call = new Command()

call
  .name('call')
  .description('Call a function from a mantiq prompt')
  .argument('<prompt_path>', 'The path to the prompt file')
  .argument('<function_name>', 'The name of the function to call')
  .argument('[parameter]', 'The parameter to pass to the function (JSON encoded)', 'undefined')
  .action(async (prompt_path, fn_name, parameter) => {
    console.log(JSON.stringify(await call_prompt_fn(prompt_path, fn_name, parameter), null, 2))
  })
