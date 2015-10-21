import newrelic from "newrelic";
import connect from "connect";
import http from "http";
import swaggerTools from "swagger-tools";
import {isDevMode} from "./utils"
const app = connect();
const serverPort = process.env.PORT || 8080;

// swaggerRouter configuration
const options = {
  controllers: './controllers',
  useStubs: isDevMode()// Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = require('./api/swagger.json');


if(isDevMode()){
  console.log("Starting in developer mode ")
  swaggerDoc.host = "localhost:" + serverPort;
}

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort,serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});