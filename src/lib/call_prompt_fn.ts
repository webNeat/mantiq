import path from 'path'
import fs from 'fs'

export async function call_prompt_fn(prompt_path: string, fn_name: string, parameter: string) {
  const absolute_path = path.resolve(prompt_path)
  if (!fs.existsSync(absolute_path)) throw new Error(`Prompt file not found: ${prompt_path}`)

  const { main, ...tools } = await import(absolute_path)
  const fn = tools[fn_name]
  if (!fn || typeof fn !== 'function') throw new Error(`Function ${fn_name} not found in prompt file ${prompt_path}`)

  return fn(parse_parameter(parameter))
}

function parse_parameter(parameter: string) {
  try {
    return JSON.parse(parameter)
  } catch {
    throw new Error(`Invalid JSON parameter: ${parameter}`)
  }
}
