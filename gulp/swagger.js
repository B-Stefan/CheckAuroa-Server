import gulp from "gulp"
import size  from "gulp-size"
import fs from "fs"
import request from "request"
import unzip from "unzip";
gulp.task("swagger", (callback)=>{

    var CodeGen = require('swagger-js-codegen').CodeGen;

    var file = 'api/swagger.json';


    var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
/*
    var nodejsSourceCode = CodeGen.getCustomCode({
        className: 'CheckAuroraClient',
        swagger: swagger,
        template: {
            class: fs.readFileSync(__dirname + '/templates/node-class.mustache', 'utf-8'),
            method: fs.readFileSync(__dirname + '/templates/node-method.mustache', 'utf-8'),
            request: fs.readFileSync(__dirname + '/templates/node-request.mustache', 'utf-8')
        }

    });
    */

    var data = {
        "spec": swagger
    }

    request.post({
        url: "http://generator.swagger.io/api/gen/clients/typescript-node",
        json:true,
        body:data
    },(err, req,body)=>{

        console.log(err,body)

        let path = __dirname + '/../api/clients/';
        request(body.link)
            .pipe(unzip.Extract({ path: path})).on("end",function(){

            callback();
        })



    });

});