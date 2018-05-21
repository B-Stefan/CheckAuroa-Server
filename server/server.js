require('babel-register')()

function bootstrap () {
  return new Promise((resolve, reject) => {
    const loopback = require('loopback')
    const boot = require('loopback-boot')

    const app = module.exports = loopback()

    app.start = function () {
      // start the web server
      const server = app.listen(function () {
        app.emit('started')
        const baseUrl = app.get('url').replace(/\/$/, '')
        console.log('Web server listening at: %s', baseUrl)
        if (app.get('loopback-component-explorer')) {
          const explorerPath = app.get('loopback-component-explorer').mountPath
          console.log('Browse your REST API at %s%s', baseUrl, explorerPath)
        }
        resolve({app, server})
      })
    }

    // Bootstrap the application, configure models, datasources and middleware.
    // Sub-apps like REST API are mounted via boot scripts.
    boot(app, {
      appRootDir: __dirname,
      bootDirs: ['./boot-server']
    }, function (err) {
      if (err) reject(err)

      app.start()
    })
  })
}

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error(err)
  })
} else {
  module.exports = bootstrap
}
