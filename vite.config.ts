import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import tsconfigPaths from 'vite-tsconfig-paths'
import { stringify } from 'yaml'

const packageJson = require('./package.json')
const config = require('./src/plugin.config');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    cssInjectedByJsPlugin(),
    AutoImport({
      imports: ["vue"],
      include: [
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
    }),
    vue(),
    {
      async buildStart(options) {
        console.log('Building plugin...')
        // create a plugin.json in assets
        this.emitFile({
          fileName: 'plugin.yml',
          type: 'asset',
          source: stringify(config.default),
        });
      },
    }
  ],
  build: {
    outDir: `dist/${config.default.identifier}`,
    minify: 'esbuild',
    lib: {
      entry: 'src/main.ts',
      fileName: 'plugin',
      formats: ['es'],
    },

  },
  server: {
    port: 3058,
    host: '127.0.0.1',
    cors: true,
  },
  define: {
    'process.env': JSON.stringify({
      cider: '2',
    }),
    'cplugin': {
      ce_prefix: packageJson?.plugin?.ce_prefix || 'mce',
      identifier: packageJson?.plugin?.identifier || 'mce',
    },
  }
})
