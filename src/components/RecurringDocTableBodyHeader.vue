<template>
  <b-tr>
    <b-th class="align-middle">1</b-th>
    <b-td v-for="(cell, cellIndex) in $v.headerCells.$each.$iter" :key="cellIndex">
      <RecurringDocTableBodyHeaderCell :cellValue="cell.value" :cellIndex="parseInt(cellIndex, 10)" />   
    </b-td>
  </b-tr> 
</template>


<script>
import RecurringDocTableBodyHeaderCell from '../components/RecurringDocTableBodyHeaderCell'
import { required	} from 'vuelidate/lib/validators'

export default {
  name: 'RecurringDocTableBodyHeader',
  components: {
    RecurringDocTableBodyHeaderCell
  },
  props: {
    fetchedData: Object
  },
  expose: [
    'headerCells',
    '$v'
  ],
  data() {
    return {
      headerCells: [{ value: '' }],
    }
  },
  validations() {
    return {
      headerCells: {
        $each: {
          value: {
            required,
            isUniqueHeaderCellValue: this.$isUniqueHeaderCellValue(this.headerCells)
          }
        }
      },
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    fetchedData: function(newData, oldData) {
      this.headerCells = newData.table.headerCells
      this.$nextTick(() => {
        this.$v.headerCells.$reset()
      })   
    }
  } 
}
</script>


