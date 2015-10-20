import gulp from "gulp"
import size  from "gulp-size"
import fs from "fs"


gulp.task("swagger", (callback)=>{

    var CodeGen = require('swagger-js-codegen').CodeGen;

    var file = 'api/swagger.json';
    var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
    var nodejsSourceCode = CodeGen.getNodeCode({ className: 'Test', swagger: swagger });

    console.log(nodejsSourceCode);
    var output = fs.writeFileSync("api/api.js", nodejsSourceCode);
    callback();
});