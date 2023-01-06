const fs = require('fs')

fs.writeFileSync('../.env', 
  `VUE_APP_SENTRY_DSN=${process.env.VUE_APP_SENTRY_DSN}\n 
  VUE_APP_BASE_URL=${process.env.VUE_APP_BASE_URL}\n`
)