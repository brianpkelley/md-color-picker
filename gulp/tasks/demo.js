const gulp = require('gulp');
const injectReload = require('gulp-inject-reload');
const livereload = require('gulp-livereload');

const ports = require('../ports');

/**
 * Build the demo and demo resources                     =
 */
module.exports = function demoTask() {

	gulp
		.src('demo/index.html')
		.pipe(
			injectReload({port: ports.livereload})
		)
		// .pipe(
		// 	gulp.dest('dist/demo')
		// )
		.pipe(
			livereload()
		)
	;
};
