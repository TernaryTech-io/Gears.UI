import '@gears/ui/styles.css'
import '@gears/ui/plugins.css'
import './preview.css'

import { createApp } from 'vue'
import GearsUI, { useColorMode } from '@gears/ui'
import App from './App.vue'
import router from './router'

useColorMode()
createApp(App).use(router).use(GearsUI).mount('#app')
