<template>
  <div>
    <b-button variant="link" size="sm" @click="addCellSect">
      Add Section
    </b-button>
    <b-button variant="link" size="sm" @click="deleteCellSect">
      Delete Section
    </b-button> 
    <div v-for="(cellSect, sectIndex) in cellSects" :key="sectIndex">
      <b-button variant="outline-info" v-b-modal="`modal-${rowIndex}-${cellIndex}-${sectIndex}`">
        {{ getSectDescription(cellSect, sectIndex) }}
      </b-button>  
      <br>
      <b-badge v-if="rowIndex === 0 && cellIndex === 0 && parseInt(sectIndex, 10) === 0" variant="secondary" href="#" id="dataCells-tip">
        <b-icon icon="question-circle-fill" aria-label="dataCells-tip"></b-icon>
      </b-badge>
      <b-popover target="dataCells-tip" triggers="hover focus">
        <InstructionsDataCells />        
      </b-popover>
      <b-modal :id="`modal-${rowIndex}-${cellIndex}-${sectIndex}`" title="Cell section value parser"> 
        <RecurringDocTableBodyDataCellSection :cellSect="cellSect" /> 
      </b-modal>
    </div>
  </div>
</template>


<script>
import InstructionsDataCells from './InstructionsDataCells'
import RecurringDocTableBodyDataCellSection from './RecurringDocTableBodyDataCellSection'
import { getEmptyCellSect } from '../services/postService'

export default {
  name: 'RecurringDocTableBodyDataCell',
  components: {
    InstructionsDataCells,
    RecurringDocTableBodyDataCellSection
  },
  props: {
    rowIndex: Number,
    cellIndex: Number,
    cellSects: Object, 
    dataRows: Array 
  },
  methods: { 
    addCellSect() {
      const cellSects = this.dataRows[this.rowIndex].dataCells[this.cellIndex].cellSects
      if (cellSects.length < 4) {
        //do not add another sect if last sect has 'Empty cell' selected
        if (cellSects.length && !cellSects[cellSects.length - 1].searchOrInputMethod) {
          return
        }
        cellSects.push(getEmptyCellSect())
      }
    },

    deleteCellSect() {
      const cellSects = this.dataRows[this.rowIndex].dataCells[this.cellIndex].cellSects
      cellSects.pop()
      if (!cellSects.length) {
        this.addCellSect()
        this.$nextTick(() => {
          cellSects.$reset()
        })
      }
    },

    getSearchMethodDisplay(method) {
      let methodDisplay
      if (method === 'topPhrase') {
        methodDisplay = 'anchorVert'
      } else if (method === 'leftPhrase') {
        methodDisplay = 'anchorHoriz'
      } else if (method === 'pattern') {
        methodDisplay = 'regExp'
      } else {
        methodDisplay = method
      }
      return methodDisplay
    },

    getSectDescription(cellSect, sectIndex) {
      return `Sect#${parseInt(sectIndex, 10) + 1}-${this.getSearchMethodDisplay(cellSect.searchOrInputMethod.$model)}-${cellSect.phraseOrValue.$model}`  
    }
  }
}
</script>

