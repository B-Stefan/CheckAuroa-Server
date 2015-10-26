import gulp from "gulp"
import size  from "gulp-size"
import fs from "fs"
import request from "request"
import GulpConfig from "./../Gulp-config"

gulp.task("swagger-client-qt5", (callback)=>{

    /**
     * Angular client
     */
    request.post({
        url: "http://generator.swagger.io/api/gen/clients/qt5cpp",
        json:true,
        body:GulpConfig.swaggerPostData

    },(err,req,body)=>{
        request(body.link).pipe(fs.createWriteStream('aurora-api/clients/qt5cpp.zip')).on("end", callback);

    })

});