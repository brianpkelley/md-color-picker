var gulp = require('gulp'),
	debug = require('gulp-debug'),
	seq = require('run-sequence'),
	streamqueue = require('streamqueue'),
	closure = require('gulp-jsclosure'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	minifyCss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	templateCache = require('gulp-angular-templatecache'),
	ngAnnotate = require('gulp-ng-annotate'),
	autoprefix = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	http = require('http'),
	st = require('st'),
	del = require('del');


var moduleName = 'mdColorPicker';
var paths = {
	demo: 'demo',
	dist: 'dist/',
	src: {
		less: ['src/less/*.less'],
		templates: ['src/templates/*.tpl.html'],
		js: ['src/js/*.js', 'dist/templates.js']
	}
};


/*====================================================================
 =                  Compile and minify less and css                  =
 ====================================================================*/

gulp.task('less', function () {
	gulp.src(paths.src.less)
		.pipe(debug({title: 'LESS: '}))
		.pipe(less({strictMath: true}))
		.pipe(concat(moduleName + '.css'))
		.pipe(autoprefix({browsers: ['> 1%'], cascade: true}))
		.pipe(gulp.dest(paths.dist))
		.pipe(rename({extname: '.min.css'}))
		.pipe(minifyCss())
		.pipe(gulp.dest(paths.dist));
});


/*====================================================================
 =            Create angular templates            =
 ====================================================================*/
// - Precompile templates to ng templateCache
gulp.task('templates', function () {
	gulp.src(paths.src.templates)

		.pipe(templateCache({module: moduleName}))


		.pipe(gulp.dest(paths.dist));

});

/*====================================================================
 =            Compile and minify js generating source maps            =
 ====================================================================*/
// - Orders ng deps automatically
// - Depends on templates task
gulp.task('js', ['templates'], function () {


	gulp.src(paths.src.js)


		.pipe(debug({title: 'JS: '}))
		//.pipe(sourcemaps.init())
		.pipe(concat(moduleName + '.js'))
		//.pipe(sourcemaps.write('.'))
		.pipe(closure(['angular', 'window', 'tinycolor']))
		.pipe(ngAnnotate())
		.pipe(gulp.dest(paths.dist))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist));
});


/*===================================================================
 =            Watch for source changes and rebuild/reload            =
 ===================================================================*/
gulp.task('server', ['build'], function () {
	http.createServer(
		st({path: __dirname, index: 'demo/index.html', cache: false})
	).listen(3334);
});
gulp.task('watch', ['server'], function () {
	livereload.listen({port: 3333, basePath: "."});
	//gulp.watch(paths.src.html, ['html']);
	gulp.watch(paths.src.less, ['less']);
	gulp.watch(paths.src.js, ['js']);


});

gulp.task('livereload', function () {
	gulp.src(paths.demo, '*.html');
});

/*=========================================
 =            Clean dest folder            =
 =========================================*/

gulp.task('clean', function (cb) {
	return del([paths.dist + '/**/*']);
});


/*======================================
 =            Build Sequence            =
 ======================================*/

gulp.task('build', function (done) {
	var tasks = ['less', 'js'];
	seq('clean', tasks, done);
});

/*====================================
 =            Default Task            =
 ====================================*/
gulp.task('default', ['watch'], function () {

});
