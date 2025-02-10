import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const require = createRequire(fileURLToPath(import.meta.url))

const isCommonjs = process.argv.slice(2).includes('--commonjs')

const compilerOptions = {
  "moduleResolution": "node",
  "module": isCommonjs ? "commonjs": "es2020",
  "allowJs": true
}

const esm = require('ts-node/dist/esm')
export const { resolve, getFormat, transformSource } = esm
  .registerAndCreateEsmHooks({ 
    transpileOnly: true, 
    compilerOptions 
  })