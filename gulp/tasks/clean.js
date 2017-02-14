const del = require('del');

const paths = require('../paths');

/**
 * Clean dest folder
 */
module.exports = function cleanTask() {

	return del.sync([
		paths.dist + '/**/*', 'docs/**/*.1',
	]);
};
