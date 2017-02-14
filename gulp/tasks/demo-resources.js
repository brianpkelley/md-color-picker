const gulp = require('gulp');
const livereload = require('gulp-livereload');

module.exports = function demoResourcesTask() {

	gulp
		.src([
			'demo/js/*.js',
			'demo/css/*.css',
		])
		// .pipe(
		// 	gulp.dest('dist/demo')
		// )
		.pipe(
			livereload()
		)
	;
};
