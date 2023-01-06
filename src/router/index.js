import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import axios from 'axios'
import { handleError } from '../plugins/errorHandler'
import AppLanding from '../views/AppLanding'
import UserLogin from '../views/UserLogin'
import UserRegister from '../views/UserRegister'
import AppInstructions from '../views/AppInstructions'
import UserProfile from '../views/UserProfile'
import UserPasswordForgot from '../views/UserPasswordForgot'
import UserPasswordReset from '../views/UserPasswordReset'
import UploadFiles from '../views/UploadFiles'
import RecurringDocIndex from '../views/RecurringDocIndex'
import RecurringDocTemplate from '../views/RecurringDocTemplate'
import PageNotFound from '../views/PageNotFound'



Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'AppLanding',
    component: AppLanding
  },
  {
    path: '/login/:msg?',
    name: 'UserLogin',
    props: true,
    component: UserLogin
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/instructions',
    name: 'AppInstructions',
    component: AppInstructions
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { 
      requiresAuth: true 
    }
  },
  {
    path: '/forgot',
    name: 'UserPasswordForgot',
    component: UserPasswordForgot
  },
  {
    path: '/reset/:token',
    name: 'UserPasswordReset',
    props: true,
    component: UserPasswordReset
  },
  {
    path: '/uploads',
    name: 'UploadFiles',
    component: UploadFiles,
    meta: { 
      requiresAuth: true 
    }
  },
  {
    path: '/index/:templateType(header|doc)/:msg?',
    name: 'RecurringDocIndex',
    props: true,
    component: RecurringDocIndex,
    meta: { 
      requiresAuth: true 
    }
  },
  {
    path: '/:templateType(header|doc)/:id?',
    name: 'RecurringDocTemplate',
    props: true,
    component: RecurringDocTemplate,
    meta: { 
      requiresAuth: true 
    }
  },
  {
    path: '/*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]


const router = new VueRouter({
  mode: 'history',
  routes
})


router.beforeEach(async (to, from, next) => {
  let errMsg = null
  //When app first loads, check for existing server session; if there is one, automatically login
  if (!store.getters.sessionChecked) {
    try {
      const user = await axios.get('/api/user/', { withCredentials: true })
      store.dispatch('setUser', user.data)
    } catch(err) {
      errMsg = handleError(err)
    }    
    store.dispatch('confirmSessionChecked')
  }
  //Successful navigations
  if (to.name === 'AppInstructions' || 
      to.name === 'PageNotFound' ||
      //to auth pages and user authenticated
      to.matched.some(record => record.meta.requiresAuth) && store.getters.user ||
      //to public pages and user unauthenticated
      !to.matched.some(record => record.meta.requiresAuth) && !store.getters.user) {
      next()
  //Reroute to login if navigating to auth pages while unauthenticated
  } else if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.user) {
    next({ 
      name: 'UserLogin', 
      params: { 
        msg: { 
          text: errMsg || 'Please login', 
          context: 'danger' 
        }
      }
    })
  //Reroute to upload page if navigating to public pages while authenticated
  } else if (!to.matched.some(record => record.meta.requiresAuth) && store.getters.user) {
    next({ name: 'UploadFiles' })
  } 
})


export default router



