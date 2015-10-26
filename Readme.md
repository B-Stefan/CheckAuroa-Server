#Check-Aurora-Sever
This repository contains the code for the data api server for the mobile application "Check-Aurora". 
The application originated from two study courses at the [Jamk.fi](http://jamk.fi) in 2015.

A live and running version of this server you can reach under the domain: 
 * https://check-aurora-api.herokuapp.com/docs/
 

##Application idea 
The problem to solve is that all providers of forecast for northern lights not realy provide good data. Or if they provide accurate and good usable data they dont have an API or mobile application. 
This is the reason why we decide to develop a new aurora forecast application 

##System overview 
This api depend on multiple data sources the following diagram illustrate the system 


##Getting started 

To start this server you need the following dependencies: 
 
 * [node.js](http://nodejs.org)

To start the programm follow the next steps: 

1. run ```npm install ``` in the project folder (where the package.json is located)
2. run  ``` npm start ```  in the terminal to start the server 
3. open the api on http://localhost:8080

##Client libraries
To use this api in your application we provide several client libs. 
Possible libraries are: 

* [Typescript-Angular](./aurora-api/clients/typescript-angular.zip?raw=true)
* Typescript-Node 
* [Android](./aurora-api/clients/android.zip?raw=true)
* Java 
* PHP 
* Scala 
* [QT5](./aurora-api/clients/qt5.zip?raw=true) 
* c++ 

##Upload new version 
To upload a new version to the heroku server push the tested version of the server to the **heroku-live** branch. 
After you pushed to this branch the server automatically update and restart and the the version is after 2 minutes online. 



