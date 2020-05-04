'use strict';
const gulp = require('gulp');
const rollup = require('gulp-better-rollup');

const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins 'gulp-' de package.json


// Variables de chemins
var source = './src'; // dossier de travail
var destination = './dist'; // dossier à livrer

gulp.task('sass', function () {
    return gulp.src(source + '/scss/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.csscomb())
        .pipe(plugins.cssbeautify({indent: '  '}))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(destination + '/css/'))
        .pipe(plugins.csso())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(destination + '/css/'));
});

gulp.task('scripts', () => {

    return gulp.src(source + '/js/Accordions.js')
        .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'iife'))
        .pipe(gulp.dest(destination + '/js/'))
        .pipe(plugins.terser())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest(destination + '/js/'));
});

gulp.task('build', gulp.parallel('sass', 'scripts'));
