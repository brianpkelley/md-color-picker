const gulp = require('gulp');
const gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
const rename = require('gulp-rename');

const paths = require('../paths');

/**
 * Create markdown documentation from jsdocs
 */
module.exports = function docsTask() {

	return gulp
		.src(paths.src.js)
		.pipe(
			gulpJsdoc2md()
		)
		.pipe(
			rename(function(pathConverted) {
				pathConverted.extname = '.md';
			})
		)
		.pipe(
			gulp.dest('docs')
		)
		;
};
