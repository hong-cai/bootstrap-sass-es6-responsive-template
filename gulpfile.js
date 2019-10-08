/*
var module=require('module');
gulp.task -defin tasks
gulp.src-points to source files or folders
gulp.dest - destination to put the compiled files
gulp.watch - watch files folders
gulp.browser-sync doesn't have destination
*/

var project = 'daduan';

var gulp = require('gulp'),
    /*gulp-sass:compile scss components into one css file*/
    sass = require('gulp-sass'),
    /*autoprefixer: in case some css properties have prefix*/
    autoprefixer = require('gulp-autoprefixer'),
    /*concatinate css and js files*/
    concat = require('gulp-concat'),
    /* minify js files */
    uglify = require('gulp-uglify'),
    /*tell where the file with changed code is in dev tool*/
    sourcemaps = require('gulp-sourcemaps'),
    /*sync file changes with browser even on wifi*/
    browserSync = require('browser-sync').create();


//compile scss into css
function style() {
    //1. where is the scss file
    return gulp.src('./daduan/process/sass/*.scss')
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        //2. pass the file throught sass compiler
        //   logError only gives the detailed error msg
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        //3. where to store the compiled CSS
        .pipe(gulp.dest('./daduan/builds/css'))
        //4. stream changes to all browsers,even on wifi
        .pipe(browserSync.stream());
}

function javascript() {
    return gulp.src('./daduan/process/js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./daduan/builds/js/'));
}


function watch() {
    browserSync.init({
        server: {
            baseDir: './daduan/builds/'
        }
    });
    //this one doesn't refresh the page
    gulp.watch('./daduan/process/sass/*.scss', style);
    //if anything change in html the page refreshes
    gulp.watch('./daduan/builds/index.html').on('change', browserSync.reload);
    gulp.watch('./daduan/process/js/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
exports.javascript = javascript;

var build = gulp.parallel(watch);
gulp.task('default', build);