// Gulp plugins
const gulp = require('gulp');
const gulpif = require('gulp-if');
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

const env = require('../env');

/**
 * Compile and minify less and css
 */
module.exports = function stylesTask() {

	let stream = gulp.src(paths.src.lessEntry);

	stream = stream
		.pipe(
			less({
				strictMath: true,
			})
		)
		.pipe(
			concat(moduleName + '.css')
		)
		.pipe(gulpif(env.prod,
			autoprefix({
				browsers: [
					'last 2 versions',
					'last 4 Android versions',
				],
			})
		))
		.pipe(
			header(banner, {pkg: packageJson})
		)
		.pipe(
			gulp.dest(paths.dist)
		)
	;

	// Minified build
	stream = stream
		// the duplicate minified file in dev env is still required
		// because it is referenced in the demo index file
		.pipe(
			rename({extname: '.min.css'})
		)
		.pipe(gulpif(env.prod,
			cssnano({safe: true})
		))
		.pipe(gulpif(env.prod,
			header(banner, {pkg: packageJson})
		))
		.pipe(
			gulp.dest(paths.dist)
		)
	;

	stream = stream
		.pipe(
			livereload()
		)
	;

	return stream;
};
