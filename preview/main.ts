import '@ternarytech-io/gears-ui/styles.css'
import '@ternarytech-io/gears-ui/plugins.css'
import './preview.css'

import { createApp } from 'vue'
import GearsUI, { useColorMode } from '@ternarytech-io/gears-ui'
import { GearsUICodeEditor } from '@ternarytech-io/gears-ui/code-editor'
import { GearsUIPlugins } from '@ternarytech-io/gears-ui/plugins'
import App from './App.vue'
import router from './router'

useColorMode()
createApp(App).use(router).use(GearsUI).use(GearsUICodeEditor).use(GearsUIPlugins).mount('#app')
