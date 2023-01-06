<template>
  <div>
    <RecurringDocTableHeaders v-if="templateType === 'doc'" @update-header="setHeader" />
    <br>
    <b-button-group size="sm">
      <b-button variant="outline-info" @click="addColumn">
        Add Column
      </b-button>
      <b-button variant="outline-info" @click="deleteColumn">
        Delete Column
      </b-button>
      <b-button v-if="templateType === 'doc'" variant="outline-info" @click="addDataRow">
        Add row
      </b-button>
      <b-button v-if="templateType === 'doc'" variant="outline-info" @click="deleteDataRow">
        Delete row
      </b-button>
      <b-button v-if="templateType === 'doc'" variant="outline-info" @click="copyLastRow">
        Copy last row
      </b-button>
    </b-button-group>
    <br>
    <br>
    <b-button variant="outline-dark" @click="resetTable(true)">
      Reset Table
    </b-button>
    <br>
    <br>
    <p class="errorDisplay" v-if="tableErrorDisplay.headerErrors.length">
      TABLE HEADER ERRORS: Please fix errors in the following cells: {{ tableErrorDisplay.headerErrors.join(', ') }} 
    </p>
    <p class="errorDisplay" v-if="tableErrorDisplay.cellSectErrors.length">
      TABLE CELL SECTION ERRORS: Please fix errors in the following cell sections: {{ tableErrorDisplay.cellSectErrors.join(', ') }} 
    </p>
    <p class="notesDisplay" v-if="notesDisplay.length">
      The following cell sections contain notes: {{ notesDisplay.join(', ') }} 
    </p>
    <b-table-simple striped hover bordered sticky-header responsive>
      <b-thead class="text-center">
        <b-tr>
          <b-th></b-th>
          <b-th v-for="columnLetter in columnLetters" :key="columnLetter">
            {{ columnLetter }}
          </b-th>
        </b-tr>
      </b-thead> 
      <b-tbody>
        <RecurringDocTableBodyHeader ref="header" :fetchedData="fetchedData" /> 
        <b-tr :class="{ dataRow: templateType === 'header' }" v-for="(row, rowIndex) in $v.dataRows.$each.$iter" :key="rowIndex">
          <b-th class="align-middle" >
            {{ parseInt(rowIndex, 10) + 2 }}
          </b-th>
          <b-td v-for="(dataCell, cellIndex) in row.dataCells.$each.$iter" :key="cellIndex">
            <RecurringDocTableBodyDataCell
              :rowIndex="parseInt(rowIndex, 10)" 
              :cellIndex="parseInt(cellIndex, 10)" 
              :cellSects="dataCell.cellSects.$each.$iter"
              :dataRows="dataRows"
            />
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>


<script>
import RecurringDocTableBodyHeader from './RecurringDocTableBodyHeader'
import RecurringDocTableBodyDataCell from './RecurringDocTableBodyDataCell'
import RecurringDocTableHeaders from './RecurringDocTableHeaders'
import { getNextColumnLetter, getColumnLetters, getheaderCellErrors, getDataCellErrors,  getNotes } from '../services/tableService'
import { getEmptyCellSect } from '../services/postService'
import { requiredIf	} from 'vuelidate/lib/validators'

export default {
  name: 'RecurringDocTable',
  components: {
    RecurringDocTableBodyHeader,
    RecurringDocTableBodyDataCell,
    RecurringDocTableHeaders,
  },
  props: {
    fetchedData: Object,
    templateType: String
  },
  expose: [
    'dataRows',
    '$v',
    'setErrorDisplay'
  ],
  data() {
    return {
      dataRows: [{
        dataCells: [{
          cellSects: [{
            searchOrInputMethod: '', 
            phraseOrValue: '',  
            phraseCount: 1,  
            stringType: 'phrase',  
            appendChars: '',
            dateFormat: '',
            daysAdded: 0,
            notes: ''
          }]   
        }]
      }],
      columnLetters: ['A'],
      tableErrorDisplay: { 
        headerErrors: [], 
        cellSectErrors: [] 
      },
      notesDisplay: []
    }
  },
  validations() {
    return {
      dataRows: {
        $each: {
          dataCells: {
            $each: {
              cellSects: {
                $each: {
                  searchOrInputMethod: {},
                  phraseOrValue: {
                    required: requiredIf(this.$notEmptyValueOrToday) 
                  },
                  phraseCount: {},
                  stringType: {},
                  appendChars: {},
                  dateFormat: {
                    areValidDateChars: this.$areValidDateChars
                  },
                  daysAdded: {},
                  notes: {}
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {  
    setErrorDisplay(isVisible) {
      if (isVisible) {
        this.tableErrorDisplay.headerErrors = getheaderCellErrors(this.$refs.header.$v.headerCells.$each.$iter, this.columnLetters)
        this.tableErrorDisplay.cellSectErrors = getDataCellErrors(this.$v.dataRows.$each.$iter, this.columnLetters)  
      } else {
        this.tableErrorDisplay = { headerErrors: [], cellSectErrors: [] }
      }
    },

    addDataRow() { 
      if (this.dataRows.length < 100) {
        const dataCells = this.$refs.header.headerCells.map(function() {
          return { cellSects: [getEmptyCellSect()] }
        })
        this.dataRows.push({ dataCells })
      }
    },

    deleteDataRow() {
      this.dataRows.pop()
      if (!this.dataRows.length) {
        this.addDataRow()
        this.$nextTick(() => {
          this.$v.dataRows.$reset()
        })          
      }
    },

    addColumn() {
      const headerCells = this.$refs.header.headerCells
      if (headerCells.length < 52) {
        headerCells.push({ value: '' }) 
        this.dataRows.forEach(row => {
          row.dataCells.push({ cellSects: [getEmptyCellSect()] })
        })
        this.columnLetters.push(getNextColumnLetter(this.columnLetters[this.columnLetters.length - 1]))
      }
    },

    deleteColumn() {
      const headerCells = this.$refs.header.headerCells
      headerCells.pop()
      this.dataRows.forEach(row => {
        row.dataCells.pop()
      })
      this.columnLetters.pop()
      if (!headerCells.length) {
        headerCells.push({ value: '' })
        this.dataRows = [{ dataCells: [{ cellSects: [getEmptyCellSect()] }] }]
        this.columnLetters.push('A')
        this.$nextTick(() => {
          this.$v.dataRows.$reset()
          this.$refs.header.$v.headerCells.$reset()
        })
      }
    },

    copyLastRow() {
      const rowToCopy = this.dataRows[this.dataRows.length - 1]
      const newRow = JSON.parse(JSON.stringify(rowToCopy))
      delete newRow._id
      newRow.dataCells.forEach(dataCell => {
        dataCell.cellSects.forEach(cellSect => {
          delete cellSect['_id']
        })
        delete dataCell['_id']
      })
      this.dataRows.push(newRow)
    },

    resetTable(confirmationNeeded, header) {
      if (confirmationNeeded) {
        if (!confirm('This will clear all data in the current table. Ok to proceed?')) {
          return
        }
      }    
      // eslint-disable-next-line no-unused-labels
      this.$refs.header.headerCells = header ?  header.cells.map(cell => { return { value: cell.value }}) : [{ value: '' }] 
      this.dataRows = []
      this.addDataRow()
      this.columnLetters = getColumnLetters(this.dataRows[0].dataCells)
      this.$nextTick(() => {
        this.$refs.header.$v.headerCells.$reset()
        this.$v.dataRows.$reset()
      })
      this.setErrorDisplay()
    },

    setHeader(header) {
      this.resetTable(false, header)
    },    
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    fetchedData: function(newData, oldData) {
      this.dataRows = newData.table.dataRows
      this.columnLetters = getColumnLetters(this.dataRows[0].dataCells)
      this.notesDisplay = getNotes(this.dataRows, this.columnLetters)
      this.$nextTick(() => {
        this.$v.dataRows.$reset()
      })    
      this.setErrorDisplay()
    }
  } 
}
</script>


<style scoped>
.dataRow {
  display: none;
}
.errorDisplay {
  color: red;
}
.notesDisplay {
  color: green;
  font-size: small;
}
</style>


<style>
.table {
  width: 0%;
}
td {
  min-width: 149px;
}
.popover-body {
  height: 150px;
  overflow-y: auto;
}
</style>


