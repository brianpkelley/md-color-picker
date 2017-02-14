// Gulp plugins
const gulp = require('gulp');
const concat = require('gulp-concat');
const header = require('gulp-header');
const livereload = require('gulp-livereload');
const rename = require('gulp-rename');

// Transpiler
const less = require('gulp-less');

// Production
const autoprefix = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');

// Data
const packageJson = require('../../package.json');
const banner = require('../banner');
const moduleName = require('../module-name');
const paths = require('../paths');

/**
 * Compile and minify less and css
 */
module.exports = function stylesTask() {

	return gulp
		.src(paths.src.less)
		.pipe(
			less({
				strictMath: true,
			})
		)
		.pipe(
			concat(moduleName + '.css')
		)
		.pipe(
			autoprefix({
				browsers: [
					'last 2 versions',
					'last 4 Android versions',
				],
			})
		)
		.pipe(
			header(banner, {pkg: packageJson})
		)
		.pipe(
			gulp.dest(paths.dist)
		)
		.pipe(
			rename({extname: '.min.css'})
		)
		.pipe(
			cssnano({safe: true})
		)
		.pipe(
			header(banner, {pkg: packageJson})
		)
		.pipe(
			gulp.dest(paths.dist)
		)
		.pipe(
			livereload()
		)
		;
};
