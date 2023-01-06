<template>
  <div class="container">
    <br>
    <b-row>
      <b-col lg="6" offset-lg="3">
        <b-card header-tag="header" footer-tag="footer">
          <template #header>
            <div class="text-center">
              <b-alert :show="Object.keys(status).length" :variant="status.context">
                {{ status.text }}
              </b-alert>
              <div v-if="isLoading">
                <b-spinner variant="secondary" label="Loading"></b-spinner>
                <br>
                <br>
              </div>   
              <h3>Account Settings</h3>
            </div>
          </template>
          <br>
          <b-form @submit.prevent="update" @input="status={}">
            <b-form-group description="Username and email cannot be changed" label="Username:" label-for="username-input">
              <b-form-input 
                id="username-input" 
                :value="user ? user.username : ''" 
                disabled
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Email:" label-for="email-input">
              <b-form-input 
                id="email-input" 
                :value="user ? user.email : ''" 
                disabled>
              </b-form-input>
            </b-form-group>
            <b-form-group label="Change password:" label-for="password-input">
              <b-form-input 
                id="password-input"
                :type="passwordFieldType"
                placeholder="Enter current password" 
                autocomplete="on"
                v-model="$v.form.oldPassword.$model" 
                :state="$validateState($v.form.oldPassword)"
                aria-describedby="oldPassword-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="oldPassword-live-feedback">
                Current password required
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <b-form-input 
                :type="passwordFieldType"
                placeholder="Enter new password" 
                autocomplete="on"
                v-model="$v.form.password.$model" 
                :state="$validateState($v.form.password)"
                aria-describedby="password-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="password-live-feedback">
                Valid password required, and must differ from current password
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <b-form-input 
                :type="passwordFieldType"
                placeholder="Confirm new password" 
                autocomplete="on"
                v-model="$v.form.confirmedPassword.$model" 
                :state="$validateState($v.form.confirmedPassword)"
                aria-describedby="confirmedPassword-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="confirmedPassword-live-feedback">
                Confirmed password must match new password
              </b-form-invalid-feedback>
            </b-form-group>
            <div id="password-details"> 
              <b-form-checkbox v-model="passwordFieldType" value="text" unchecked-value="password">
                Show Passwords
              </b-form-checkbox>
              <br>
              <p>Password must contain:</p>
              <ul>
                <li>At least eight characters</li>
                <li>At least one upper case letter</li>
                <li>At least one lower case letter</li>
                <li>At least one number</li>
                <li>No special characters (i.e. #*@)</li>
              </ul>
            </div>
            <br>
            <b-button type="submit" variant="info" @click="status={}">
              Save Changes
            </b-button>
          </b-form>
          <template #footer>
            <b-link to="/uploads">
              Go to main page
            </b-link>
          </template>
        </b-card>
      </b-col>
    </b-row>      
  </div>
</template>


<script>
import { required, sameAs, not } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { changePassword, logout } from '../services/userProfileService'

export default {
  name: 'UserProfile',
  data() {
    return {
      passwordFieldType: 'password',
      form: {
        oldPassword: '',
        password: '',
        confirmedPassword: ''
      }, 
      status: {},
      isLoading: false
    }
  },
  validations() {
    return {
      form: {
        oldPassword: {
          required
        },
        password: {
          required,
          isStrongPassword: this.$isStrongPassword,
          notSameAsOldPassword: not(sameAs('oldPassword'))
        },
        confirmedPassword: {
          required,
          sameAsPassword: sameAs('password')
        }
      }
    }
  },
  computed: mapGetters(['user']),
  methods: { 
    async update() {
      this.$v.form.$touch()
      if (!this.$v.form.$anyError) {
        this.isLoading = true
        try {
          await changePassword(this.form)
          await logout()
          this.$router.push({ 
            name: 'UserLogin', 
            params: { 
              msg: { 
                text: 'Password successfully changed and an email confirmation was sent to you. Please login with new password.', 
                context: 'success' 
              }
            }
          })
        } catch (err) {
          const errInfo = this.$handleError(err)
          this.status = { text: errInfo, context: 'danger' }
          this.isLoading = false
        }
      }
    }
  }
}
</script>


<style scoped>
.card-header {
  border-bottom: none;
}
#password-details {
  font-size: smaller;
}
.card-footer {
  border-top: none
}
</style>