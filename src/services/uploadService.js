import axios from 'axios'



//Gets user's browser date, used when "today" is selected as the cell section input method 
export const getDateToday = () => {
  let today = new Date()
  let DD = String(today.getDate()).padStart(2, '0')
  let MM = String(today.getMonth() + 1).padStart(2, '0') //January is 0
  let YYYY = today.getFullYear()
  today = YYYY + '/' + MM + '/' + DD
  return today
}

//Upload files to cloud storage
export const upload = async (files) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('myFiles', file)
  })
  const res = await axios.post('/api/transfers/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true })
  const fileBatchID = res.data
  return fileBatchID
}

//Extract text from uploads and write CSV files from the data
export const extractText = async (fileBatchID, pageSelections) => {
  const res = await axios.post('/api/transfers/extract', {
    fileBatchID,
    pageSelections: pageSelections.length <= 3 ? [parseInt(pageSelections, 10)] : pageSelections.split(', ').map(page => parseInt(page, 10)),
    dateToday: getDateToday()
  }, { withCredentials: true })
  return res.data
}

//Combine all CSV files into one zip file
export const writeZip = async (fileBatchID) => {
  const res = await axios.post('/api/transfers/write', { fileBatchID }, { withCredentials: true })
  return res.data
}

//Automatically download the zip file once its ready
export const download = (url, windowDocument) => {
  const fileLink = windowDocument.createElement('a')
  fileLink.href = url
  fileLink.setAttribute('download', 'download')
  windowDocument.body.appendChild(fileLink)
  fileLink.click()
}