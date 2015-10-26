import gulp from "gulp"
import size  from "gulp-size"
import fs from "fs"
import request from "request"
import GulpConfig from "./../Gulp-config"

gulp.task("swagger-client-ts-angular", (callback)=>{

    /**
     * Angular client
     */
    request.post({
        url: "http://generator.swagger.io/api/gen/clients/typescript-angular",
        json:true,
        body:GulpConfig.swaggerPostData

    },(err,req,body)=>{
        request(body.link).pipe(fs.createWriteStream('aurora-api/clients/typescript-angular.zip')).on("end", callback);

    })

});