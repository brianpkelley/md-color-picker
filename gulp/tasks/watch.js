const gulp = require('gulp');
const livereload = require('gulp-livereload');

const paths = require('../paths');
const ports = require('../ports');

/**
 * Watch for source changes and rebuild/reload
 *
 * @return {Function}
 */
module.exports = function watchTask() {

	const pathsForBuild = [].concat(
		paths.src.lessGlob,
		paths.src.js,
		paths.src.templates
	);

	livereload.listen({
		port: ports.livereload,
		basePath: '.',
	});

	gulp.watch(pathsForBuild, ['build']);
	gulp.watch(paths.src.demoGlob, ['demo']);
};
