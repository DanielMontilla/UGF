import { resolve } from 'path';
import { defineConfig } from 'vite';

console.log(resolve(__dirname, '../../packages/ugf/src/index.ts'))

export default defineConfig({
  resolve: {
    alias: [
      {
        find: 'ugf', replacement: resolve(__dirname, '../../packages/ugf/src/index.ts')
      }
    ]
  }
})