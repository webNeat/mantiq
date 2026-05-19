import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsup'

const project_root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  entry: ['src/index.ts', 'src/*/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      '@src': resolve(project_root, 'src'),
    }
  },
})
