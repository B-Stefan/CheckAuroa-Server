import gulp from "gulp"
import size  from "gulp-size"
import fs from "fs"
import request from "request"
import GulpConfig from "./../Gulp-config"
import jsdoc from "gulp-jsdoc"
import babel from "gulp-babel"

gulp.task("jsdoc", ()=>{

    return gulp.src([

        "./aurora-classes/**/*.js",
        "./aurora-routes/**/*.js",
        "./aurora-services/**/*.js",
        "./Readme.md"
    ])
        .pipe(babel())
        .pipe(jsdoc('./docs'))

});