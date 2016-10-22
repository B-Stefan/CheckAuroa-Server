module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  router.get('/loaderio-2b88164b71707f9d69ea0a4fc9112222/', (req,res)=>{
    res.send("loaderio-2b88164b71707f9d69ea0a4fc9112222")
  });
  server.use(router);
};
