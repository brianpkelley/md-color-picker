const streamqueue = require('streamqueue');

// Gulp plugins
const concat = require('gulp-concat');
const gulp = require('gulp');
const gulpif = require('gulp-if');
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
const env = require('../env');
const moduleName = require('../module-name');
const paths = require('../paths');

/**
 * Compile, minify, generate source maps
 */
module.exports = function scriptsTask() {

	// queue for sources that have their own piped plugins
	let stream = streamqueue({objectMode: true},

		gulp.src(paths.src.js),

		gulp.src(paths.src.templates)
			.pipe(
				templateCache({module: moduleName})
			)
	);

	stream = stream
		.pipe(
			gdebug({title: '[scripts]'})
		)
		// .pipe(gulpif(env.prod,
		// 	sourcemaps.init()
		// ))
		// .pipe(gulpif(env.prod,
		// 	sourcemaps.write('.')
		// ))
		.pipe(gulpif(env.prod,
			ngAnnotate()
		))
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
	;

	// Minified build
	stream = stream
		// the duplicate minified file in dev env is still required
		// because it is referenced in the demo index file
		.pipe(
			rename({suffix: '.min'})
		)
		.pipe(gulpif(env.prod,
			uglify({
				compress: {
					drop_console: !env.debug,
					drop_debugger: !env.debug,
				}
			})
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
