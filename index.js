import newrelic from "newrelic";
import express from "express";
import http from "http";
import swaggerTools from "swagger-tools";
import {isDevMode} from "./utils"
import Router from "./aurora-routes/Router"
const app = express();
const serverPort = process.env.PORT || 8080;


// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = require('./aurora-api/swagger.json');


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

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  const router = new Router(app);

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort,serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});