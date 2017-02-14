const gulp = require('gulp');

const debug = require('./gulp/debug');

const cleanTask = require('./gulp/tasks/clean');
const demoTask = require('./gulp/tasks/demo');
const demoResourcesTask = require('./gulp/tasks/demo-resources');
const distResourcesTask = require('./gulp/tasks/dist-resources');
const docsTask = require('./gulp/tasks/docs');
const scriptsTask = require('./gulp/tasks/scripts');
const serverTask = require('./gulp/tasks/server');
const stylesTask = require('./gulp/tasks/styles');
const watchTask = require('./gulp/tasks/watch');

gulp.task('build-watch-serve', ['server', 'watch']);
gulp.task('watch', ['clean'], watchTask);
gulp.task('server', ['build', 'demo', 'dist-resources'], serverTask);
gulp.task('build', ['clean', 'scripts', 'styles', 'demo', 'dist-resources', 'docs']);

gulp.task('styles', stylesTask);
gulp.task('scripts', scriptsTask);

gulp.task('demo', demoTask);
gulp.task('demo-resources', demoResourcesTask);
gulp.task('dist-resources', distResourcesTask);

gulp.task('clean', cleanTask);
gulp.task('docs', docsTask);

gulp.task('default', function() {
	debug.enabled = true;
	gulp.start('watch');
});
