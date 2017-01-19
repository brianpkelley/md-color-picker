require('es6-promise').polyfill(); // Needed for autoprefix and travis-ci

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	path = require('path'),
	gdebug = require('gulp-debug'),
	seq = require('run-sequence'),
	streamqueue = require('streamqueue'),
	iife = require('gulp-iife'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	templateCache = require('gulp-angular-templatecache'),
	ngAnnotate = require('gulp-ng-annotate'),
	autoprefix = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	injectReload = require('gulp-inject-reload'),
	http = require('http'),
	st = require('st'),
	del = require('del'),
	merge = require('merge-stream'),
	header = require('gulp-header'),
	fs = require('fs'),
	gulpJsdoc2md = require('gulp-jsdoc-to-markdown');


var debug = false;

var ports = {
	web: 3333,
	livereload: 3334
};

var moduleName = 'mdColorPicker';
var paths = {
	demo: 'src/demo',
	dist: 'dist/',
	src: {
		demo: ['demo/**/*.*'],
		less: ['src/less/mdColorPicker.less'],
		templates: ['src/templates/**/*.tpl.html'],
		js: [
			// Module
			'src/js/mdColorPicker.js',
			'src/js/mdColorPickerConfig.js',
			'src/js/mdColorPickerContainer.js',
			'src/js/mdColorPickerHistory.js',

			// Canvases ( require the module for config )
			'src/js/conicalGradient.js',
			'src/js/mdColorPickerGradientCanvas.js',
			'src/js/tabs/genericPalette.js',
			'src/js/tabs/materialPalette.js',
			'src/js/tabs/historyPalette.js'
		]
	}
};


var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');




/*====================================================================
 =                  Compile and minify less and css                  =
 ====================================================================*/

gulp.task('less', function () {
	gulp.src(paths.src.less)
		.pipe(less({strictMath: true}))
		.pipe(concat(moduleName + '.css'))
		.pipe(autoprefix({browsers: ['last 2 versions', 'last 4 Android versions']}))
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest(paths.dist))
		.pipe(rename({extname: '.min.css'}))
		.pipe(cssnano({ safe: true }))
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest(paths.dist))
		.pipe(livereload());
});


/*====================================================================
 =            Compile and minify js generating source maps            =
 ====================================================================*/
// - Orders ng deps automatically
// - Depends on templates task
gulp.task('js', function () {


	streamqueue({objectMode: true},
		gulp.src(paths.src.js),
		gulp.src(paths.src.templates)
			.pipe(templateCache({module: moduleName}))
	)
		// .pipe(debug({title: 'JS: '}))
		// .pipe(sourcemaps.init())

		// .pipe(sourcemaps.write('.'))
		// .pipe(closure(['angular', 'window', 'tinycolor']))
		// .pipe(ngAnnotate())
		.pipe(iife({
			useStrict: true,
			trimCode: true,
			prependSemicolon: true,
			params: ['window', 'angular', 'TinyColor', 'undefined'],
			args: ['window', 'window.angular', 'window.tinycolor']
		}))

		.pipe(concat(moduleName + '.js'))
		.pipe(header(banner, { pkg : pkg } ))


		.pipe(gulp.dest(paths.dist))

		.pipe(rename({suffix: '.min'}))
		/*.pipe(uglify({
			"compress": {
            	"drop_console": !debug,
				"drop_debugger": !debug
        	}
		}))*/
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest(paths.dist))
		.pipe(livereload());

});

/*====================================================================
 =            Build the demo and demo resources                     =
 ====================================================================*/

gulp.task('demo-resources', function () {
	gulp.src(['demo/js/*.js','demo/css/*.css'])
	//	.pipe(gulp.dest('dist/demo'))
		.pipe(livereload());
});

gulp.task('dist-resources', function () {
	gulp.src(['dist/*'])
	//	.pipe(gulp.dest('dist/demo/md-color-picker'))
		.pipe(livereload());
});

gulp.task('demo', ['demo-resources'], function () {
	gulp.src('demo/index.html')
		.pipe(injectReload({port: ports.livereload}))
	//	.pipe(gulp.dest('dist/demo'))
		.pipe(livereload());


});

/*===================================================================
 =            Start local demo/dev server                           =
 ===================================================================*/
gulp.task('server', ['build', 'demo', 'dist-resources'], function () {
	process.on('uncaughtException', function(err) {
	    console.log(err);
	    try {
			livereload.kill();
		} catch(e) {}
	    //process.kill();
  	});

	livereload.listen({port: ports.livereload, basePath: "."});

	http.createServer(
		st({path: __dirname, index: 'demo/redirect.html', cache: false})
	).listen(ports.web);


});


/*===================================================================
 =            Watch for source changes and rebuild/reload            =
 ===================================================================*/
gulp.task('watch', ['clean'], function () {

	gutil.log("Started dev server @ http://localhost:" + ports.web + "/demo/index.html");
	//gulp.watch(paths.src.html, ['html']);
	gulp.watch(['src/less/*.less'].concat(paths.src.js.concat(paths.src.templates)), ['build']);
	gulp.watch(paths.src.demo, ['demo']);


	gulp.start('server');


});

/*=========================================
 =            Create Doc Files            =
 =========================================*/

gulp.task('docs', function () {

		return gulp.src(paths.src.js)
    .pipe(gulpJsdoc2md())

    .pipe(rename(function (path) {
      path.extname = '.md';
    }))
    .pipe(gulp.dest('docs'));
});



/*=========================================
 =            Clean dest folder            =
 =========================================*/

gulp.task('clean', function (cb) {
	return del([paths.dist + '/**/*','docs/**/*.1']);
});


/*======================================
 =            Build Sequence            =
 ======================================*/

gulp.task('build', function (done) {
	process.on('uncaughtException', function(err) {
	    console.log(err);
	    try {
			livereload.kill();
		} catch(e) {}
	    //process.kill();
  	});


	var tasks = ['less', 'js', 'demo', 'dist-resources', 'docs'];
	seq('clean', tasks, done);
});

/*====================================
 =            Default Task            =
 ====================================*/
gulp.task('default', function () {
	debug = true;
	gulp.start('watch');
});
