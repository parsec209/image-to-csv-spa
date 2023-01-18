import * as Sentry from '@sentry/vue'  
import router from '../router/index'
import store from '../store/index'



export const handleError = function(error) {
  //Axios errors
  if (error.response) {
    const message = error.response.data.message || error.response.data
    //Automatically logout if unauthenticated API call is made while already logged in (i.e. server session has expired)
    if (error.response.status === 401 && store.getters.sessionChecked && router.currentRoute.name !== 'UserLogin') {
      store.dispatch('setUser', null)
      return router.push({ 
        name: 'UserLogin', 
        params: { 
          msg: { 
            text: message, 
            context: 'danger' 
          }
        }
      })
    }
    return message
  }
  //Network error (server disconnected)
  else if (error.message === 'Network Error') {
    Sentry.captureException(error)    
    return 'Server connection error, please try again' 
  }
  //Other operational errors (i.e. no uploads were recognized as recurring docs)
  else {
    return error.message
  }
}

export const errorHandler = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.prototype.$handleError = handleError
  }
}







