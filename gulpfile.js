
var gulp = require('gulp');
var del = require('del');
var config = require('./jsdoc.json');
var jsdoc = require('gulp-jsdoc3');

gulp.task('del', function (cb) {
  //console.log('task: del');
  return del(['./dist']);
});

gulp.task('doc', ['del'], function (cb) {
  //console.log('task: doc');
  gulp.src(['lib/ttbsdk.js'])
    .pipe(jsdoc(config, cb));
});

gulp.task('copy-lib', ['del'], function () {
  //console.log('task: copy-lib');
  return gulp.src(['lib/**/*.*'])
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('copy-sandbox', ['del'], function () {
  //console.log('task: copy-sandbox');
  return gulp.src(['src/**/*.*'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy', ['copy-sandbox', 'copy-lib']);

gulp.task('watch', ['doc', 'copy'], function () {
  //console.log('task: watch');
  gulp.watch(['lib/**/*.js', 'jsdoc.json'], ['copy-sandbox', 'doc']);
});

gulp.task('doc-dev', ['watch']);
