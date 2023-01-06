import Vue from 'vue'
import App from './App'
import '@babel/polyfill'
import 'mutationobserver-shim'
import Vuelidate from 'vuelidate'
import { BootstrapVue, BootstrapVueIcons, EmbedPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { errorHandler } from './plugins/errorHandler'
import validators from './plugins/validators'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import router from './router'
import store from './store'



Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(EmbedPlugin)
Vue.use(errorHandler)
Vue.use(validators)

Sentry.init({        
  Vue, 
  dsn: process.env.VUE_APP_SENTRY_DSN,
  // logErrors: true,
  // debug: true,
  tracingOptions: {
    trackComponents: true,
  },
  integrations: [
    new Integrations.BrowserTracing()
  ],
  tracesSampleRate: 0.2  
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
