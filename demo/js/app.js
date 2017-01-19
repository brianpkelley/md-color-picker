(function(window, angular, undefined ) {
	angular.module('plunker', ['ngMaterial', 'ngCookies', 'mdColorPicker','mdColorPickerConfig'])
	.config(['$mdColorPickerConfigProvider', function($mdColorPickerConfig){

		$mdColorPickerConfig.notations.add( {
			name: 'text',
			test: function() { return false; },
			toString: function( color ) {
				// An over simplified example on how to add a custom notation.
				var hue = color.toHsv().h;
				if ( hue >= 340 || hue < 15 ) {
					return "Red";
				} else if ( hue >= 15 && hue < 45 ) {
					return "Orange";
				} else if ( hue >= 45 && hue < 70 ) {
					return "Yellow";
				} else if ( hue >= 70 && hue < 115 ) {
					return "Lime";
				} else if ( hue >= 115 && hue < 150 ) {
					return "Green";
				} else if ( hue >= 150 && hue < 200 ) {
					return "Cyan";
				} else if ( hue >= 200 && hue < 255 ) {
					return "Blue";
				} else if ( hue >= 255 && hue < 300 ) {
					return "Violet";
				} else if ( hue >= 300 && hue < 340 ) {
					return "Fuchsia";
				}
			}
		});
		$mdColorPickerConfig.notations.order = ['rgb', 'hsl', 'text', 'hex'];


		


	}])
	.controller('MainCtrl', ['$rootScope', '$scope', '$mdColorPickerConfig', '$timeout', function($rootScope, $scope, $mdColorPickerConfig, $timeout ) {
		$scope.rootScope = $rootScope;
		$scope.textConfig = {};
		$scope.textConfig.fonts = [
			'Arial',
			'Arial Black',
			'Comic Sans MS',
			'Courier New',
			'Georgia',
			'Impact',
			'Times New Roman',
			'Trebuchet MS',
			'Verdana'
		];

		$scope.textConfig.font = undefined;
		$scope.textConfig.textColor = undefined;
		$scope.textConfig.textBackground = undefined;

		$scope.textConfig.backgroundOptions = {
			label: "Text Background",
			icon: "font_download",

			hasBackdrop: true,
			clickOutsideToClose: true,
			random: true,
			openOnInput: true,

			alphaChannel: false,
			history: false,
			defaultTab: 1,
		};
		$scope.textConfig.showPreview = true;

		$scope.$watch( 'textConfig.textBackground', function( newVal ) {
			if ( !newVal ) { return; }
			var baseColor = tinycolor( newVal ).toHsv();
			baseColor.v = 1;
			baseColor.s = 1;

			//	console.log( baseColor, oldColor );

			var palette = [];
			for ( var x = 0; x < 10; x++ ) {
				var row = [];

				var color = angular.copy( baseColor );
				color.v -= x * .10;

				for ( var y = 0; y < 10; y++ ) {
					var tmp = angular.copy( color );
					tmp.s -= y * .1;

					row.push( new tinycolor( tmp ).toHslString() );
				}
				palette.push( row );
			}

			paletteTabs = $mdColorPickerConfig.tabs.getFromCache('genericPalette');
			console.info( "textConfig.textBackground", newVal, palette );

			angular.forEach( paletteTabs, function( tab ) {
				tab.palette = palette;
			});
		} , true);


	}]);
})( window, window.angular );
