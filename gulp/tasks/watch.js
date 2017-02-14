const gulp = require('gulp');

const paths = require('../paths');
const ports = require('../ports');

/**
 * Watch for source changes and rebuild/reload
 *
 * @return {Function}
 */
module.exports = function watchTask() {

	const pathsLess = ['src/less/*.less'];
	const pathsJs = paths.src.js;
	const pathsHtml = paths.src.templates;

	const pathsToWatch = pathsLess.concat(pathsJs, pathsHtml);

	// gulp.watch(paths.src.html, ['html']);
	gulp.watch(pathsToWatch, ['build']);
	gulp.watch(paths.src.demo, ['demo']);
};
