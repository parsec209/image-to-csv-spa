<template>
  <div>
    <b-form-input
      v-model="updatedCellValue.$model" 
      :state="$validateState(cellValue)"
      placeholder="Header value" 
      aria-describedby="headerCells-live-feedback"
    >
    </b-form-input>
    <b-badge v-if="cellIndex === 0" variant="secondary" href="#" id="headerCells-tip">
      <b-icon icon="question-circle-fill" aria-label="headerCells-tip"></b-icon>
    </b-badge>
    <b-popover target="headerCells-tip" triggers="hover focus">
      <InstructionsHeaderCells />        
    </b-popover>
    <b-form-invalid-feedback id="headerCells-live-feedback">
      Unique header value required
    </b-form-invalid-feedback>
  </div>
</template>


<script>
import InstructionsHeaderCells from './InstructionsHeaderCells'

export default {
  name: 'RecurringDocTableBodyHeaderCell',
  components: {
    InstructionsHeaderCells
  },
  props: {
    cellValue: Object,
    cellIndex: Number
  },
  data() {
    return {
      updatedCellValue: this.cellValue
    }
  }
}
</script>

