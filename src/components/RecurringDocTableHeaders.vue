<template>
  <div class="text-center">
    <b-dropdown id="dropdown-headers" text="Use saved header" class="m-md-2" variant="info">
      <b-dropdown-item v-for="header in headers" :key="header.name" @click="passHeaderToTable(header)">
        {{ header.name }}
      </b-dropdown-item>
    </b-dropdown>
    <b-badge variant="secondary" href="#" id="headers-tip">
      <b-icon icon="question-circle-fill" aria-label="headers-tip"></b-icon>
    </b-badge>
    <b-popover target="headers-tip" triggers="hover focus">
      <InstructionsHeaders />
    </b-popover>
  </div>
</template>


<script>
import InstructionsHeaders from './InstructionsHeaders'
import { getHeaders } from '../services/postService'

export default {
  name: 'RecurringDocTableHeaders',
  components: {
    InstructionsHeaders
  },
  data() {
    return {
      headers: []
    }
  },
  methods: {     
    passHeaderToTable(header) {
      if (confirm('Selecting this header will clear all cell section data in the current table. Ok to proceed?')) {
        this.$emit('update-header', header)
      }
    }
  },
  async mounted() {
    this.headers = await getHeaders()
  },
  watch: {
    async $route() {
      this.headers = await getHeaders()
    }
  } 
}
</script>