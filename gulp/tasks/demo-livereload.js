const gulp = require('gulp');
const injectReload = require('gulp-inject-reload');
const livereload = require('gulp-livereload');

const ports = require('../ports');

/**
 * Build assets for the demo
 */
module.exports = function demoTask() {

	return gulp
		.src('demo/index.html')
		.pipe(
			injectReload({port: ports.livereload})
		)
		.pipe(
			livereload()
		);
};
