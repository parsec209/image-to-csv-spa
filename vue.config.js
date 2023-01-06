const HOST = process.env.VUE_APP_DEV_API_HOST || 'localhost'
const PORT = process.env.VUE_APP_DEV_API_PORT || 3000


module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: `http://${HOST}:${PORT}`
      }
    }
  }
}
  
