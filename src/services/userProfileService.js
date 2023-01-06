import axios from 'axios'
import store from '../store/index'
import router from '../router/index'
import { handleError } from '../plugins/errorHandler'



export const changePassword = async (form) => {
  await axios.post('/api/user/change', form, { withCredentials: true })
}

export const logout = async () => {
  store.dispatch('setUser', null)
  try {
    await axios.get('/api/user/logout', { withCredentials: true }) 
  } catch (err) {
    const errInfo = handleError(err)
    router.push({ name: 'UserLogin', params: { msg: { text: errInfo, context: 'danger' }}})
  }
}
