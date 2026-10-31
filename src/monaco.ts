// Monaco, set up once: bundled web workers (no CDN; Gears may run offline) and light and dark
// themes on the Gears palette. TCodeEditor loads this the first time an editor is shown, so apps
// that never show one don't download Monaco.
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/languages/features/json/json.worker?worker'

self.MonacoEnvironment = {
  getWorker(_id: string, label: string) {
    return label === 'json' ? new JsonWorker() : new EditorWorker()
  }
}

monaco.editor.defineTheme('gears-light', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: { 'editor.background': '#ffffff', 'editorLineNumber.foreground': '#a2a8b1', 'editor.lineHighlightBackground': '#f6f7f9' }
})
monaco.editor.defineTheme('gears-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: { 'editor.background': '#232525', 'editorLineNumber.foreground': '#5d6470', 'editor.lineHighlightBackground': '#2c2f2f' }
})

export default monaco
