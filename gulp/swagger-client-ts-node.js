import gulp from "gulp"
import size  from "gulp-size"
import request from "request"
import unzip from "unzip";
import GulpConfig from "./../Gulp-config"

gulp.task("swagger-client-ts-node", (callback)=>{
    /**
     * Node client
     */
    request.post({
        url: "http://generator.swagger.io/api/gen/clients/typescript-node",
        json:true,
        body:GulpConfig.swaggerPostData
    },(err, req,body)=>{

        console.log(err,body)

        let path = __dirname + '/../aurora-api/clients/';
        request(body.link)
            .pipe(unzip.Extract({ path: path})).on("end",function(){

            callback();
        })

    });

});