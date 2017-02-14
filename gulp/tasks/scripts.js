const streamqueue = require('streamqueue');

// Gulp plugins
const concat = require('gulp-concat');
const gulp = require('gulp');
const gdebug = require('gulp-debug');
const header = require('gulp-header');
const iife = require('gulp-iife');
const livereload = require('gulp-livereload');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Angular
const ngAnnotate = require('gulp-ng-annotate');
const templateCache = require('gulp-angular-templatecache');

// Data
const packageJson = require('../../package.json');
const banner = require('../banner');
const debug = require('../debug');
const moduleName = require('../module-name');
const paths = require('../paths');

/**
 * Compile and minify js generating source maps
 *
 * - Orders ng deps automatically
 * - Depends on templates task
 */
module.exports = function scriptsTask() {

	streamqueue(
		{objectMode: true},

		gulp.src(paths.src.js),

		gulp.src(paths.src.templates)
			.pipe(
				templateCache({module: moduleName})
			)
	)
		.pipe(
			gdebug({title: 'JS: '})
		)
		// .pipe(
		// 	sourcemaps.init()
		// )
		// .pipe(
		// 	sourcemaps.write('.')
		// )
		// .pipe(
		// 	ngAnnotate()
		// )
		.pipe(
			iife({
				useStrict: true,
				trimCode: true,
				prependSemicolon: true,
				params: [
					'window',
					'angular',
					'TinyColor',
					'undefined'
				],
				args: [
					'window',
					'window.angular',
					'window.tinycolor'
				],
			})
		)
		.pipe(
			concat(moduleName + '.js')
		)
		.pipe(
			header(banner, {pkg: packageJson})
		)
		.pipe(
			gulp.dest(paths.dist)
		)
		.pipe(
			rename({suffix: '.min'})
		)
		// .pipe(uglify({
		// 	compress: {
		// 		drop_console: debug.disabled,
		// 		drop_debugger: debug.disabled,
		// 	}
		// }))
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
