import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { handleError } from '../plugins/errorHandler'



//Gets the default table cell section input values
export const getEmptyCellSect = () => {
  const emptySect = {
    searchOrInputMethod: '', 
    phraseOrValue: '',  
    phraseCount: 1,  
    stringType: 'phrase',  
    appendChars: '',
    dateFormat: '',
    daysAdded: 0,
    notes: ''
  }
  return emptySect
}

//Assigns the default values to the table cell section inputs if the fetched doc's corresponding props are undefined
const defineCellSectFormValues = (dataRows) => {
  const emptySect = getEmptyCellSect()
  dataRows.forEach(row => {
    row.dataCells.forEach(cell => {
      cell.cellSects.forEach(sect => {
        for (let prop in emptySect) {
          if (!sect[prop]) {
            sect[prop] = emptySect[prop]
          }
        }
      })
    })
  })
}

//Removes falsy input values before saving recurring doc to db
const removeFalsyFormValues = (formData) => {
  if (!formData.idPhrase2) {
    delete formData.idPhrase2
  }
  formData.dataRows.forEach(row => {
    row.dataCells.forEach(cell => {
      cell.cellSects.forEach(sect => {
        for (let prop in sect) {
          if (!sect[prop]) {
            delete sect[prop]  
          }
        }
      })
    })
  })
}

const getHeaderCellsWithoutIds = (cells) => {
  cells.forEach((cell, index, cells) => { 
    delete cells[index]._id
  })
  return cells
}

const getDataRowsWithoutIdsOrNotes = (rows) => {
  rows.forEach((row, index, rows) => {
    row.dataCells.forEach((cell, index, cells) => {
      cell.cellSects.forEach((sect, index, sects) => {
        delete sects[index]._id
        delete sects[index].notes
      })
      delete cells[index]._id
    })
    delete rows[index]._id
  })
  return rows
}

export const getFormData = async (templateType, templateID) => {
  let res
  let errorMsg = ''
  if (templateID) {
    try {
      res = await axios.get(`/api/${templateType}s/${templateID}`, { withCredentials: true })
    } catch (err) {
      errorMsg = handleError(err)
    }
  }
  const formData = { 
    id: uuidv4(), 
    main: {
      name: res ? res.data.name : '',
      idPhrase: res && res.data.idPhrase ? res.data.idPhrase : '',
      idPhrase2: res && res.data.idPhrase2 ? res.data.idPhrase2 : ''
    }, 
    table: {
      headerCells:  res ? res.data.cells || res.data.header : [{ value: '' }],
      get dataRows() { 
        if (res && res.data.dataRows) {
          defineCellSectFormValues(res.data.dataRows)
          return res.data.dataRows 
        } else {
          const dataCells = this.headerCells.map(() => {
            return { cellSects: [getEmptyCellSect()] }
          })
          const dataRows = [{ dataCells }]
          return dataRows
        }
      }
    },
    errorMsg
  }
  return formData
}

export const getHeaders = async () => {
  const res = await axios.get('/api/headers/', { withCredentials: true })
  const headers = res.data
  return headers
}

export const postTemplate = async (templateType, formData, templateID) => {
  if (templateType === 'header') {
    const headerPayload = { 
      name: formData.name, 
      cells: formData.headerCells 
    }
    templateID ? 
    await axios.put(`/api/headers/${templateID}`, headerPayload, { withCredentials: true }) : 
    await axios.post('/api/headers/', headerPayload, { withCredentials: true })
  } else if (templateType === 'doc') {
    const rowsPayload =  { 
      name: formData.name, 
      idPhrase: formData.idPhrase, 
      idPhrase2: formData.idPhrase2, 
      header: formData.headerCells, 
      dataRows: formData.dataRows 
    }
    removeFalsyFormValues(rowsPayload)
    templateID ? 
    await axios.put(`/api/docs/${templateID}`, rowsPayload, { withCredentials: true }) :
    await axios.post('/api/docs/', rowsPayload, { withCredentials: true })
  }
}

export const getCopiedTemplate = async (template) => {
  let copiedTemplate
  let copiedTemplateName = template.name + '-COPY-' + uuidv4().substring(0, 5)
  if (template.cells) {
    let res = await axios.post('/api/headers/', { name: copiedTemplateName, cells: getHeaderCellsWithoutIds(template.cells) }, { withCredentials: true })
    copiedTemplate = res.data
  } else {
    let copiedTemplateIdPhrase = template.idPhrase + '-COPY-' + uuidv4().substring(0, 5)
    let res = await axios.post('/api/docs/', { 
      name: copiedTemplateName, 
      idPhrase: copiedTemplateIdPhrase, 
      header: getHeaderCellsWithoutIds(template.header), 
      dataRows: getDataRowsWithoutIdsOrNotes(template.dataRows) 
    }, { withCredentials: true })
    copiedTemplate = res.data
  }
  return copiedTemplate
}