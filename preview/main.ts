import '@gears/ui/styles.css'
import '@gears/ui/plugins.css'
import './preview.css'

import { createApp } from 'vue'
import GearsUI, { useColorMode } from '@gears/ui'
import { GearsUICodeEditor } from '@gears/ui/code-editor'
import { GearsUIPlugins } from '@gears/ui/plugins'
import App from './App.vue'
import router from './router'

useColorMode()
createApp(App).use(router).use(GearsUI).use(GearsUICodeEditor).use(GearsUIPlugins).mount('#app')
