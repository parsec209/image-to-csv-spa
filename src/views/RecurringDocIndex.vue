<template>
  <div class="container"> 
    <br>
    <b-row>
      <b-col md="6" offset-md="3">
        <div class="text-center">
          <b-alert :show="loadError.length" variant="danger">
            {{ loadError }}
          </b-alert>
          <b-alert :show="Object.keys(postStatus).length && !loadError.length" :variant="postStatus.context">
            {{ postStatus.text }}
          </b-alert>
          <div v-if="isLoading">
            <b-spinner variant="secondary" label="Loading"></b-spinner>
            <br>
            <br>
          </div>   
        </div>
        <br>
        <b-button block variant="info" size="lg" :to="`/${templateType}`">
          Add {{ templateType === 'doc' ? 'recurring document' : 'header' }}
        </b-button>
        <br>
        <b-list-group>
          <b-list-group-item class="text-center" v-if="!templates.length">
            No {{ templateType }}s added yet
          </b-list-group-item>
          <b-list-group-item 
            :key="template._id" 
            v-for="(template, index) in templates" 
            class="d-flex justify-content-between align-items-center" 
            :to="`/${templateType}/${template._id}`"
            :variant="alternateRowColors(index)"
          >
            {{ template.name }}
            <div>
              <b-badge class="mr-1" variant="warning" v-if="template.hasNotes">
                Notes
              </b-badge>
              <b-badge class="mr-1" href="#"  @click="deleteTemplate(template)" variant="secondary">
                Delete
              </b-badge>
              <b-badge href="#"  @click="copyTemplate(template)" variant="secondary">
                Copy
              </b-badge>
            </div>
          </b-list-group-item>
        </b-list-group>
        <br>       
        <b-link to="/uploads">
          Go to main page
        </b-link>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import axios from 'axios'
import { markTemplatesWithNotes } from '../services/indexService.js'
import { getCopiedTemplate } from '../services/postService'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RecurringDocIndex',
  props: [
    'msg',
    'templateType'
  ],
  data() {
    return {
      loadError: '',
      postStatus: {},
      templates: [],
      isLoading: false
    }
  },
  computed: mapGetters(['user']),
  methods: {
    ...mapActions(['setUser']), 

    alternateRowColors(index) {
      let variant
      if (index % 2 === 0 ) {
        variant = 'light'
      } else {
        variant = 'secondary'
      }
      return variant
    },

    async getTemplates() {
      this.isLoading = true
      try {
        const res = await axios.get(`/api/${this.templateType}s/`, { withCredentials: true })
        this.templates = res.data
        this.templates.sort((a, b) => (a.name > b.name) ? 1 : -1)
        markTemplatesWithNotes(this.templates)
      } catch (err) {
        this.loadError = this.$handleError(err)
      }
      this.isLoading = false
    },

    async deleteTemplate(template) {
      if (confirm(`Are you sure you want to permanently delete ${template.name}?`)) {
        this.isLoading = true
        try {
          await axios.delete(`/api/${this.templateType}s/${template._id}`, { withCredentials: true })
          this.templates = this.templates.filter(t => t._id !== template._id)
          this.templates.sort((a, b) => (a.name > b.name) ? 1 : -1)
          this.postStatus = { text: `${template.name} successfully deleted`, context: 'success' }
        } catch (err) {
          const errInfo = this.$handleError(err)
          this.postStatus = { text: errInfo, context: 'danger' }
        }
        this.isLoading = false
      } else {
        return 
      }
    },

    async copyTemplate(template) {
      this.isLoading = true
      try {
        const copiedTemplate = await getCopiedTemplate(template)
        this.templates.push(copiedTemplate)
        this.templates.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.postStatus = { text: `${copiedTemplate.name} created`, context: 'success' }
      } catch (err) {
        const errInfo = this.$handleError(err)
        this.postStatus = { text: errInfo, context: 'danger' }
      }
      this.isLoading = false
    }
  },
  async mounted () {
    if (this.msg && this.msg.text) {
      this.postStatus = this.msg
    }
    await this.getTemplates()
  },
  watch: {
    async $route() {
      this.isLoading = false
      this.templates = []
      this.loadError = '',
      this.postStatus = {}, 
      await this.getTemplates()
    }
  } 
}
</script>      
