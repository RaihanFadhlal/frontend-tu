//main
import { createApp } from 'vue'
import App from './App.vue'
import './global.css'
//vue routes
import router from './router'

//vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//localization
import { id } from 'vuetify/locale'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'

const messages = {
  id: {
    $vuetify: {
      ...id,
      datePicker: {
        title: 'Pilih Tanggal',
        header: 'Input Tanggal'
      },
    },
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'en',
  messages,
})

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    adapter: createVueI18nAdapter({
      i18n,
      useI18n
    }),
  },
})

createApp(App)
  .use(router)
  .use(vuetify)
  .use(i18n)
  .mount('#app')