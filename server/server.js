require("babel-register")();
require("pmx").init({
  http          : true, // HTTP routes logging (default: false)
  http_latency  : 200,  // Limit of acceptable latency
  http_code     : 500,  // Error code to track'
  alert_enabled : true,  // Enable alerts (If you add alert subfield in custom it's going to be enabled)
  ignore_routes : [/socket\.io/, /notFound/], // Ignore http routes with this pattern (default: [])
  errors        : true, // Exceptions loggin (default: true)
  custom_probes : true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics (default: true)
  network       : true, // Network monitoring at the application level (default: false)
  ports         : true  // Shows which ports your app is listening on (default: false)
});
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if(err) console.error(err);

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
