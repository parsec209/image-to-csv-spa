<template>
  <div class="container"> 
    <br>
    <b-row>
      <b-col md="6" offset-md="3">
        <b-card bg-variant="light">
          <div class="text-center">
            <b-button variant="info" class="mr-1" to="/index/header">
              My Headers
            </b-button>
            <b-button variant="info" to="/index/doc">
              My Recurring Docs
            </b-button>
          </div>
          <br>
          <br>
          <b-form @submit.prevent="getCSV">
            <b-form-group>
              <b-badge variant="secondary" href="#" id="upload-tip">
                <b-icon icon="question-circle-fill" aria-label="upload-tip"></b-icon>
              </b-badge>
              <b-popover target="upload-tip" triggers="hover focus">
                <InstructionsUploads />        
              </b-popover>
              <b-form-input 
                placeholder="Enter up to five pages to scan (e.g. 1, 3, -1, -2)"
                v-model="$v.form.pageSelections.$model" 
                :state="$validateState($v.form.pageSelections)"
                aria-describedby="pageSelections-live-feedback"
                :disabled="isProcessing"
              >
              </b-form-input>
              <b-form-invalid-feedback id="pageSelections-live-feedback">
                Invalid format or range
              </b-form-invalid-feedback>
            </b-form-group>
            <br>
            <b-form-group>
              <b-form-file
                id="file-input"
                placeholder="Select up to 20 files, 10MB max per file"
                v-model="$v.form.files.$model" 
                accept=".TIF, .tiff, .gif, .pdf"
                :state="$validateState($v.form.files)"
                :file-name-formatter="formatNames"
                multiple
                aria-describedby="files-live-feedback"
                @input="statusMsgs = []"
                :disabled="isProcessing"
              >
              </b-form-file>
              <b-form-invalid-feedback id="files-live-feedback">
                Invalid file size or number of files
              </b-form-invalid-feedback>
            </b-form-group>
            <b-button class="my-2" variant="secondary" @click="resetFiles" :disabled="isProcessing">
              Reset
            </b-button>
            <p class="mb-3" v-for="file in form.files" :key="file.name"> 
              {{ file.name + ', ' + getFileSize(file.size) }}
            </p>
            <br>
            <div class="text-center">
              <div v-if="isProcessing" class="mb-2">
                <b-spinner variant="secondary" label="Loading"></b-spinner>
              </div>   
              <b-alert show v-for="statusMsg in statusMsgs" :key="statusMsg.text" :variant="statusMsg.context">
                {{ statusMsg.text }}
              </b-alert>
            </div>
            <br>
            <div class="text-center">
              <b-button block type="submit" variant="primary" size="lg" @click="statusMsgs = []" :disabled="isProcessing">
                Get CSV
              </b-button>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import InstructionsUploads from '../components/InstructionsUploads'
import { upload, extractText, writeZip, download } from '../services/uploadService.js'
import { required, maxLength, maxValue } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UploadFiles',
  components: {
    InstructionsUploads
  },
  data() {
    return {
      form: {
        pageSelections: '',
        files: null
      }, 
      statusMsgs: [],
      isProcessing: false
    }
  },
  computed: mapGetters(['user']),
  validations() {
    return {
      form: {
        pageSelections: {
          required, 
          isValidPageFormat: this.$isValidPageFormat
        },
        files: { 
          required,
          maxLength: maxLength(20),
          $each: {
            size: {
              maxValue: maxValue(10 * 1024 * 1024)
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapActions(['setUser']), 

    //Displays number of files selected inside the file picker
    formatNames(files) {
      return files.length === 1 ? `${files.length} file selected` : `${files.length} files selected`
    },

    //Displays file size in KB or MB
    getFileSize(number) {
      if (number < 1024) {
        return number + 'bytes'
      } else if (number >= 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + 'KB'
      } else if (number >= 1048576) {
        return (number/1048576).toFixed(1) + 'MB'
      }
    },

    //Clears selected files and status messages 
    resetFiles() {
      this.form.files = null
      this.$nextTick(() => {
        this.$v.form.files.$reset()
      })
      this.statusMsgs = []
    },

    //Displays status of upload and CSV generation process step by step to user
    async getCSV() { 
      this.$v.form.$touch()
      if (!this.$v.form.$anyError) {
        this.isProcessing = true
        try {
          this.statusMsgs.push({ text: 'Step 1 of 4: Uploading files...', context: 'info' })
          const fileBatchID = await upload(this.form.files)
          this.statusMsgs.push({ text: 'Step 2 of 4: Getting CSV data...', context: 'info' })
          const { identifiedDocs, unidentifiedDocs } = await extractText(fileBatchID, this.form.pageSelections)
          if (!identifiedDocs.length) {
            throw new Error('No uploads were recognized as recurring docs')
          } 
          identifiedDocs.forEach(doc => {
            this.statusMsgs.push({ text: `Data retrieved from ${doc}`, context: 'success' })
          })
          unidentifiedDocs.forEach(doc => {
            this.statusMsgs.push({ text: `Unable to recognize ${doc} as a recurring doc`, context: 'warning' })
          })
          this.statusMsgs.push({ text: 'Step 3 of 4: Writing Zip file...', context: 'info' })
          const zipURL = await writeZip(fileBatchID)
          this.statusMsgs.push({ text: 'Step 4 of 4: Standby for download', context: 'success' })
          download(zipURL, document)
        } catch (err) {
          const errInfo = this.$handleError(err)
          this.statusMsgs.push({ text: `PROCESS ABORTED: ${errInfo}`, context: 'danger' })
        }
        this.isProcessing = false
      } 
    }
  }
}
</script>






