<template>
  <div class="container">
    <br>
    <b-card header-tag="header" footer-tag="footer">
      <template #header>
        <div class="text-center">
          <b-alert :show="postError.length" variant="danger">
            {{ postError }}
          </b-alert>
          <div v-if="isLoading">
            <b-spinner variant="secondary" label="loading"></b-spinner>
            <br>
            <br>
          </div>   
          <h3>
            {{ formTitle }}
          </h3>
        </div>
      </template>
      <br>
      <b-form @submit.prevent="submitForm" @input="postError = ''">
        <b-row>
          <b-col md="6" offset-md="3">
            <b-form-group label="Name:" label-for="name-input">
              <b-form-input 
                id="name-input"
                :placeholder="`Enter ${templateType} name`" 
                v-model="$v.form.name.$model" 
                :state="$validateState($v.form.name)" 
                aria-describedby="name-live-feedback"
              >
              </b-form-input>
              <b-form-invalid-feedback id="name-live-feedback">
                Name required
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group v-if="templateType === 'doc'" label="ID Phrase:" label-for="idPhrase-input">
              <b-form-input       
                id="idPhrase-input"
                placeholder="Enter ID phrase" 
                v-model="$v.form.idPhrase.$model" 
                :state="$validateState($v.form.idPhrase)" 
                aria-describedby="idPhrase-live-feedback"
              >
              </b-form-input>
              <b-badge variant="secondary" href="#" id="phrase-tip">
                <b-icon icon="question-circle-fill" aria-label="phrase-tip"></b-icon>
              </b-badge>
              <b-popover target="phrase-tip" triggers="hover focus">
                <InstructionsDocID />
              </b-popover>
              <b-form-invalid-feedback id="idPhrase-live-feedback">
                ID phrase required
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group v-if="templateType === 'doc'" label="Second ID Phrase (Optional):" label-for="idPhrase2-input">
              <b-form-input       
                id="idPhrase2-input"
                placeholder="Enter second ID phrase"
                v-model="form.idPhrase2" 
                aria-describedby="idPhrase2-live-feedback"
              >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <br>
        <RecurringDocTable ref="table" :fetchedData="fetchedData" :templateType="templateType" />
        <b-button type="submit" variant="primary" @click="postError = ''">
          Submit
        </b-button>
      </b-form>
      <template #footer>
        <b-link :to="`/index/${templateType}`">
          Back to {{ templateType }}s
        </b-link>
      </template>
    </b-card>
  </div>
</template>          


<script>
import InstructionsDocID from '../components/InstructionsDocID'
import RecurringDocTable from '../components/RecurringDocTable'
import { getFormData, postTemplate } from '../services/postService'
import { required, requiredIf	} from 'vuelidate/lib/validators'

export default {
  name: 'RecurringDocTemplate',
  components: {
    InstructionsDocID,
    RecurringDocTable
  },
  props: [
    'templateType',
    'id'
  ],
  data() {
    return {
      form: {
        name: '',
        idPhrase: '',
        idPhrase2: ''
      },
      isLoading: false,
      postError: '',
      fetchedData: {}
    }
  },
  computed: {
    formTitle() {
      return this.templateType === 'doc' ? 'Recurring Document' : 'CSV Header'
    }
  },
  validations() {
    return {
      form: {
        name: {
          required, 
        },
        idPhrase: {
          required: requiredIf(this.$isDocTemplate(this.templateType)) 
        }
      }
    }
  },
  methods: {
    async submitForm() {
      const table = this.$refs.table
      const header = table.$refs.header
      const formValidator = this.$v.form
      const tableValidator = table.$v.dataRows
      const headerValidator = header.$v.headerCells
      const validators = [formValidator, tableValidator, headerValidator]
      let errorsExist = false
      validators.forEach(function(validator) {
        validator.$touch()
        errorsExist = validator.$anyError || errorsExist
      })
      if (!errorsExist) {
        this.isLoading = true
        table.setErrorDisplay()
        try {
          await postTemplate(this.templateType, { ...this.form, dataRows: table.dataRows, headerCells: header.headerCells }, this.id)
          this.$router.push({ 
            name: 'RecurringDocIndex', 
            params: { 
              templateType: this.templateType, 
              msg: { 
                text: `${this.form.name} successfully ${this.id ? 'updated' : 'added'}`, 
                context: 'success' 
              }
            }
          })
        } catch (err) {
          this.postError = this.$handleError(err)
          this.isLoading = false
        }
      } else {
        table.setErrorDisplay(true)
      }
    },

    async getPageData() {
      this.isLoading = true
      this.fetchedData = await getFormData(this.templateType, this.id)
      this.form.name = this.fetchedData.main.name
      this.form.idPhrase = this.fetchedData.main.idPhrase
      this.form.idPhrase2 = this.fetchedData.main.idPhrase2
      this.postError = this.fetchedData.errorMsg
      this.$v.form.$reset()
      this.isLoading = false
    }   
  },
  async mounted() {
    await this.getPageData()
  },
  watch: {
    async $route() {
      await this.getPageData()
    }
  } 
}
</script>

