const validators = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.prototype.$isStrongPassword = function(password) {
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
      return regex.test(password)
    }
    Vue.prototype.$isValidPageFormat = function(pageSelections) {
      const regex = /(-?[1-9][0-9]?,\s){0,4}(-?[1-9][0-9]?){1}/
      const match = pageSelections.match(regex)
      return (match && pageSelections === match[0] ? true : false)
    }
    Vue.prototype.$isUniqueHeaderCellValue = function(headerCells) {
      return function(value) {
        let count = 0
        for (let i = 0; i < headerCells.length; i++) {
          let v = headerCells[i].value
          if (v === value) {
            count++
          }
          if (count > 1) {
            return false
          }
        }
        return true
      }
    }
    Vue.prototype.$isDocTemplate = function(templateType) {
      // eslint-disable-next-line no-unused-vars
      return function(value) {
        return templateType === 'doc'
      }
    }
    Vue.prototype.$areValidDateChars = function(date) {
      if (typeof date === 'string') {
        for (let i = 0; i < date.length; i++) {
          if (!'MDY-/ ,'.includes(date[i])) {
            return false
          }
        }
        return true 
      }
    }
    Vue.prototype.$notEmptyValueOrToday = function(cellSect) {
      return cellSect.searchOrInputMethod && cellSect.searchOrInputMethod !== 'today'
    }
    Vue.prototype.$validateState = function(vFormProp) {
      const { $dirty, $error } = vFormProp
      return $dirty ? !$error : null
    }
  }
}


export default validators








   