const gulp = require('gulp');
const livereload = require('gulp-livereload');

module.exports = function distResourcesTask() {

	gulp
		.src('dist/*')
		// .pipe(
		// 	gulp.dest('dist/demo/md-color-picker')
		// )
		.pipe(
			livereload()
		)
	;

};
