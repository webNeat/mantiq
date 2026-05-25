import path from 'path'
import fs from 'fs/promises'
import { config_path } from '@src/config.js'

export async function load_aliases() {
  const config = await get_config()
  return (config.aliases || {}) as Record<string, string>
}

export async function save_aliases(aliases: Record<string, string>) {
  const config = await get_config()
  config.aliases = aliases
  await fs.writeFile(config_path, JSON.stringify(config, null, 2))
}

async function get_config() {
  try {
    await fs.access(config_path)
  } catch {
    await fs.mkdir(path.dirname(config_path), { recursive: true })
    await fs.writeFile(config_path, '{}')
  }
  return JSON.parse(await fs.readFile(config_path, 'utf-8'))
}
