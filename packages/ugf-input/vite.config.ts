import { resolve } from 'path';
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ugf-input',
      fileName: 'ugf-input',
    },
    minify: true
  },
  resolve: {
    alias: {
      // '@': resolve(__dirname, '.src')
    }
  },
  plugins: [dts()]
})