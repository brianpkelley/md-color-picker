'use strict';
const gulp = require('gulp');
const runSequence = require('run-sequence');

const env = require('./gulp/env');

const taskClean = require('./gulp/tasks/clean');
const taskDemoLivereload = require('./gulp/tasks/demo-livereload');
const taskDocs = require('./gulp/tasks/docs');
const taskScripts = require('./gulp/tasks/scripts');
const taskServer = require('./gulp/tasks/server');
const taskStyles = require('./gulp/tasks/styles');
const taskWatch = require('./gulp/tasks/watch');

gulp.task('default', ['env:debug', 'watch-server']);
gulp.task('watch-server', () => {
	runSequence(['build', 'demo-livereload'], 'watch', 'server');
});
gulp.task('build', (cb) => {
	runSequence('clean', ['scripts', 'styles'], cb);
});
gulp.task('build:production', ['env:prod', 'build', 'docs']);

gulp.task('clean', taskClean);
gulp.task('demo-livereload', taskDemoLivereload);
gulp.task('watch', taskWatch);
gulp.task('server', taskServer);

gulp.task('scripts', taskScripts);
gulp.task('styles', taskStyles);

gulp.task('docs', taskDocs);

gulp.task('env:debug', () => env.debug = true);
gulp.task('env:prod', () => env.prod = true);
