import os from 'os'
import url from 'url'
import path from 'path'
import fs from 'fs/promises'

export const config_path = process.env.MANTIQ_CONFIG_PATH || path.join(os.homedir(), '.mantiq/config.json')

const src_path = path.dirname(url.fileURLToPath(import.meta.url))

export const files_path = path.join(src_path, '../files')
export const package_json_path = path.join(src_path, '../package.json')

const pkg = JSON.parse(await fs.readFile(package_json_path, 'utf-8'))
export const version: string = pkg.version
