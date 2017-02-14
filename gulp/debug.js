const debug = {};
let enabled = false;

Object.defineProperty(debug, 'enabled', {
	get: () => enabled,
	set: (value) => enabled = value,
});

Object.defineProperty(debug, 'disabled', {
	get: () => !enabled,
	set: (value) => enabled = !value,
});

module.exports = debug;

