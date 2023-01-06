export const markTemplatesWithNotes = (templates) => {
  templates.forEach(template => {
    if (template.idPhrase) {
      for (let j = 0; j < template.dataRows.length; j++) {
        let row = template.dataRows[j]
        for (let k = 0; k < row.dataCells.length; k++) {
          let cell = row.dataCells[k]
          for (let l = 0; l < cell.cellSects.length; l++) {
            let sect = cell.cellSects[l]
            if (sect.notes) {
              template.hasNotes = true
              return
            }
          }
        }
      }
    }
  })
}
    


