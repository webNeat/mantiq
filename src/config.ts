import path from 'node:path'
import fs from 'node:fs/promises'
import url from 'node:url'

const dist_path = path.dirname(url.fileURLToPath(import.meta.url))
const is_nested = dist_path.endsWith('/cli') || dist_path.endsWith('/lib')
const root_path = is_nested ? path.join(dist_path, '..') : dist_path

export const files_path = path.join(root_path, '../files')
export const package_json_path = path.join(root_path, '../package.json')

const pkg = JSON.parse(await fs.readFile(package_json_path, 'utf-8'))
export const version: string = pkg.version
