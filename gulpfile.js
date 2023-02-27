'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const autoprefixer = require('gulp-autoprefixer');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');

// SASS
gulp.task('sass', () => {
    // return gulp.src('styles/custom-styles.scss')
    return gulp
        .src('styles/*.scss') // comment out this line if not want to generate individual css files
        //.src('styles/custom-styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif('*.css', rename({ extname: '.css' }))) // comment out this line if not want to generate individual css files
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('assets'))
});

gulp.task('watch', () => {
    gulp.watch('styles/**/*.scss', gulp.series('sass'));
});
