const http = require('http');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const st = require('st');

const ports = require('../ports');

/**
 * Start local demo/dev server
 */
module.exports = function serverTask() {

	process.on('uncaughtException', function(err) {
		console.log(err);
		try {
			livereload.kill();
		} catch (e) {}
		// process.kill();
	});

	livereload.listen({
		port: ports.livereload,
		basePath: '.',
	});

	http
		.createServer(
			st({
				path: `${__dirname}/../..`,
				index: 'demo/redirect.html',
				cache: false
			})
		)
		.listen(ports.web)
	;

	gutil.log(`Started dev server @ http://localhost:${ports.web}/demo/index.html`);
};
