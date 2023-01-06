<template>
  <div class="container">
    <br>
    <b-row>
      <b-col md="6" offset-md="3">
        <b-card header-tag="header" footer-tag="footer">
          <template #header>
            <div class="text-center">
              <div v-if="isValidStatus">
                <b-alert :show="Boolean(status)" :variant="status.context">
                  {{ status.text }} 
                </b-alert>                
              </div>
              <div v-if="isLoading">
                <b-spinner variant="secondary" label="Loading"></b-spinner>
                <br>
                <br>
              </div>   
              <h3>Login</h3>
            </div>
          </template>
          <br>
          <b-form @submit.prevent="login" @input="status=null">
            <b-form-group>
              <b-form-input 
                placeholder="Enter username" 
                v-model="$v.form.username.$model" 
                :state="$validateState($v.form.username)" 
                aria-describedby="username-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="username-live-feedback">
                Username required
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <b-form-input 
                type="password"
                placeholder="Enter password" 
                autocomplete="on"
                v-model="$v.form.password.$model" 
                :state="$validateState($v.form.password)"
                aria-describedby="password-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="password-live-feedback">
                Password required
              </b-form-invalid-feedback>
            </b-form-group>
            <b-link to="/forgot">
              Forgot password?
            </b-link>
            <br>
            <br>
            <b-button type="submit" variant="info" @click="status=null">
              Sign in
            </b-button>
          </b-form>
          <template #footer>
            <b-link to="/register">
              New? Register here
            </b-link>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import axios from 'axios'
import { required	} from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  name: 'UserLogin',
  props: [ 
    'msg'
  ],
  data() {
    return {
      form: {
        username: '',
        password: ''
      }, 
      status: this.msg, 
      isLoading: false
    }
  },
  validations: {
    form: {
      username: {
        required, 
      },
      password: {
        required
      }
    }
  },

  computed: {
    isValidStatus() {
      return (typeof this.status === 'object' && 
      this.status !== null &&
      this.status.text &&
      this.status.context) ? true : false 
    }
  },

  methods: {
    ...mapActions(['setUser']),  
    
    async login() {
      this.$v.form.$touch()
      if (!this.$v.form.$anyError) {
        this.isLoading = true
        try {
          const user = await axios.post('/api/user/login', this.form, { withCredentials: true })
          this.setUser(user.data)
          this.$router.push({ name: 'UploadFiles' })
        } catch (err) {
          const errInfo = this.$handleError(err)
          this.status = { text: errInfo, context: 'danger' }
          this.isLoading = false 
        }
      }
    },
  },
  watch: {
    $route() {
      this.status = this.msg
    }
  } 
}
</script>


<style scoped>
.card-header {
  border-bottom: none;
}
.card-footer {
  border-top: none
}
</style>