import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// `npm run dev` serves the preview site (preview/), which uses the library the way an app does:
// through `@gears/ui`. `npm run build` builds the site into dist/.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // The package's entry points, as package.json `exports` names them.
    alias: [
      { find: /^@gears\/ui$/, replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
      { find: /^@gears\/ui\/plugins$/, replacement: fileURLToPath(new URL('./src/plugins/index.ts', import.meta.url)) },
      { find: /^@gears\/ui\/code-editor$/, replacement: fileURLToPath(new URL('./src/code-editor.ts', import.meta.url)) },
      { find: /^@gears\/ui\/styles\.css$/, replacement: fileURLToPath(new URL('./src/styles/gears.css', import.meta.url)) },
      { find: /^@gears\/ui\/plugins\.css$/, replacement: fileURLToPath(new URL('./src/styles/plugins.css', import.meta.url)) }
    ]
  },
  // Monaco (src/monaco.ts) is one ~4 MB chunk, loaded only when a code editor is first shown.
  build: { chunkSizeWarningLimit: 4500 },
  server: { port: 5175 }
})
