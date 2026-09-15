import './style.css'
import 'primeicons/primeicons.css'
import '@kobbejager/jsonforms-primevue/index.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import Tooltip from 'primevue/tooltip'

import App from './App.vue'

const KikirpaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#faf6ef',
      100: '#f3ead8',
      200: '#e6d4b0',
      300: '#d4b87f',
      400: '#c29d58',
      500: '#af8d55',
      600: '#96733f',
      700: '#7a5c35',
      800: '#654c30',
      900: '#56402b',
      950: '#302116',
    },
  },
})

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: KikirpaPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
})

app.directive('tooltip', Tooltip)

app.mount('#app')
