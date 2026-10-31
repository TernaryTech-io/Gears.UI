// Gears UI's code editor, on Monaco (an optional peer dependency, loaded the first time an editor
// is shown).
import type { App } from 'vue'
import TCodeEditor from './components/TCodeEditor.vue'

export {
  TCodeEditor
}


const components = {
  TCodeEditor
}

export const GearsUICodeEditor = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) app.component(name, component)
  }
}

declare module 'vue' {
  export interface GlobalComponents {
    TCodeEditor: typeof TCodeEditor
  }
}
