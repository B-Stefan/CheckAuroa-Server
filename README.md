## Check-Aurora-Sever

[![Join the chat at https://gitter.im/B-Stefan/CheckAuroa-Server](https://badges.gitter.im/B-Stefan/CheckAuroa-Server.svg)](https://gitter.im/B-Stefan/CheckAuroa-Server?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repository contains the code for the data api server for the mobile application "Check-Aurora". 
The application originated from two study courses at the [Jamk.fi](http://jamk.fi) in 2015.
 
### Application idea 
The problem to solve is that all providers of forecast for northern lights not realy provide good data. Or if they provide accurate and good usable data they dont have an API or mobile application. 
This is the reason why we decide to develop a new aurora forecast application 

### System overview 
This api depend on multiple data sources the following diagram illustrate the system 


### Getting started 

To start this server you need the following dependencies: 
 
 * [node.js](http://nodejs.org)

To start the programm follow the next steps: 

1. run ```npm install ``` in the project folder (where the package.json is located)
2. run  ``` npm start ```  in the terminal to start the server 
3. open the api on http://localhost:8080

### Client libraries
To use this api in your application we provide several client libs. 
Possible libraries are: 

* Typescript-Angular
* Typescript-Node 
* Android
* Java 
* PHP 
* Scala 
* QT5
* c++ 

### Deploy instructions
To upload a new version to the heroku server push the tested version of the server to the **heroku-live** branch. 
After you pushed to this branch the server automatically update and restart and the the version is after 2 minutes online. 



