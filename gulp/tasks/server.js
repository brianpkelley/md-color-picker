const http = require('http');
const gutil = require('gulp-util');
const livereload = require('gulp-livereload');
const serveStatic = require('st');

const paths = require('../paths');
const ports = require('../ports');

/**
 * Start local demo/dev server
 */
module.exports = function serverTask() {

	process.on('uncaughtException', function(err) {
		console.log(err);
		try {
			livereload.kill();
		} catch (err) {}
	});

	http
		.createServer(
			serveStatic({
				path: `${__dirname}/../..`,
				index: paths.src.demoRedirect,
				cache: false
			})
		)
		.listen(ports.web)
	;

	gutil.log(`Started dev server @ http://localhost:${ports.web}/${paths.src.demoIndex}`);
};
