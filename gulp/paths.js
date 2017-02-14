module.exports = {

	dist: 'dist/',

	src: {

		demo: [
			'demo/**/*.*'
		],

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
		],

		less: [
			'src/less/mdColorPicker.less'
		],

		templates: [
			'src/templates/**/*.tpl.html'
		],
	}
};
