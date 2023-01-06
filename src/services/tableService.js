export const getNextColumnLetter = (referenceLetter) => {
  let nextColumnLetter
  if (!referenceLetter) { 
    nextColumnLetter = 'A'
  } else if (referenceLetter === 'Z') { 
    nextColumnLetter = 'AA'
  } else if (referenceLetter.length === 1) {
    nextColumnLetter = String.fromCharCode(referenceLetter.charCodeAt(referenceLetter.length - 1) + 1)
  } else { 
    nextColumnLetter = 'A' + String.fromCharCode(referenceLetter.charCodeAt(referenceLetter.length - 1) + 1)
  }  
  return nextColumnLetter 
}

export const getColumnLetters = (dataCells) => {
  let refLetter
  const columnLetters = dataCells.map(() => {
    refLetter = getNextColumnLetter(refLetter)
    return refLetter
  })
  return columnLetters
}

//Display that helps user to quickly find which table header cells contain errors after clicking submit button
export const getheaderCellErrors = (headerCells, columnLetters) => {
  const headerCellErrors = []
  for (const i in headerCells) {
    if (headerCells[i].$anyError) {
      headerCellErrors.push(columnLetters[parseInt(i, 10)] + '1')
    }
  }
  return headerCellErrors
}

//Display that helps user to quickly find which table data cell sections contain errors after clicking submit button
export const getDataCellErrors = (dataRows, columnLetters) => {
  const dataCellErrors = []
  for (const x in dataRows) {
    const dataCells = dataRows[x].dataCells.$each.$iter
    for (const y in dataCells) {
      const cellSects = dataCells[y].cellSects.$each.$iter
      for (const z in cellSects) {
        if (cellSects[z].$anyError) {
          dataCellErrors.push(`${columnLetters[parseInt(y, 10) % 52]}${parseInt(x, 10) + 2}-Section ${parseInt(z, 10) + 1}`)
        }
      }
    }
  }
  return dataCellErrors
}

//Display that helps user to quickly find which table cell sections contain notes after page load
export const getNotes = (dataRows, columnLetters) => {
  const notes = []
  dataRows.forEach((row, rowIndex) => {
    row.dataCells.forEach((cell, cellIndex) => {
      cell.cellSects.forEach((sect, sectIndex) => {
        if (sect.notes) {
          notes.push(`${columnLetters[cellIndex % 52]}${rowIndex + 2}-Section ${sectIndex + 1}`)
        }
      })
    })
  }) 
  return notes
}