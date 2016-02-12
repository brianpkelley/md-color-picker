;(function(angular, window, tinycolor) {
/*
md-color-picker 0.1.0
https://github.com/brianpkelley/md-color-picker
Brian Kelley
GNU GENERAL PUBLIC LICENSE
*/

(function( window, angular, undefined ) {
'use strict';


var GradientCanvas = function( type, restrictX ) {

	this.type = type;
	this.restrictX = restrictX;
	this.offset = {
		x: null,
		y: null
	};
	this.height = 255;

	this.$scope = null;
	this.$element = null;

	this.get = angular.bind(this, function( $temp_scope, $temp_element, $temp_attrs ) {
		////////////////////////////
		// Variables
		////////////////////////////

		this.$scope = $temp_scope;
		this.$element = $temp_element;


		this.canvas = this.$element.children()[0];
		this.marker = this.$element.children()[1];
		this.context = this.canvas.getContext('2d');
		this.currentColor = this.$scope.color.toRgb();
		this.currentHue = this.$scope.color.toHsv().h;
		////////////////////////////
		// Watchers, Observes, Events
		////////////////////////////

		//$scope.$watch( function() { return color.getRgb(); }, hslObserver, true );



		this.$element.on( 'mousedown', angular.bind( this, this.onMouseDown ) );
		this.$scope.$on('mdColorPicker:colorSet', angular.bind( this, this.onColorSet ) );
		if ( this.extra ) {
			this.extra();
		};
		////////////////////////////
		// init
		////////////////////////////

		this.draw();
	});

	//return angular.bind( this, this.get );

};
GradientCanvas.prototype.$window = angular.element( window );

GradientCanvas.prototype.getColorByMouse = function( e ) {
	var x = e.pageX - this.offset.x;
	var y = e.pageY - this.offset.y;

	return this.getColorByPoint( x, y );
};

GradientCanvas.prototype.setMarkerCenter = function( x, y ) {
	if ( y === undefined ) {
		y = x - ( this.marker.offsetHeight / 2 );
		x = 0;
	} else {
		x = x - ( this.marker.offsetWidth / 2 );
		y = y - ( this.marker.offsetHeight / 2 );
	}

	angular.element(this.marker).css({'left': x + 'px' });
	angular.element(this.marker).css({'top': y + 'px'});
};

GradientCanvas.prototype.getMarkerCenter = function() {
	var returnObj = {
		x: this.marker.offsetLeft + ( Math.floor( this.marker.offsetWidth / 2 ) ),
		y: this.marker.offsetTop + ( Math.floor( this.marker.offsetHeight / 2 ) )
	};
	return returnObj;
};

GradientCanvas.prototype.getImageData = function( x, y ) {
	x = Math.max( 0, Math.min( x, this.canvas.width-1 ) );
	y = Math.max( 0, Math.min( y, this.canvas.height-1 ) );

	var imageData = this.context.getImageData( x, y, 1, 1 ).data;
	return imageData;
};

GradientCanvas.prototype.onMouseDown = function( e ) {
	// Prevent highlighting
	e.preventDefault();
	e.stopImmediatePropagation();

	this.$scope.previewUnfocus();

	this.$element.css({ 'cursor': 'none' });

	this.offset.x = this.canvas.getBoundingClientRect().left+1;
	this.offset.y = this.canvas.getBoundingClientRect().top;

	var fn = angular.bind( this, function( e ) {
		switch( this.type ) {
			case 'hue':
				var hue = this.getColorByMouse( e );
				this.$scope.$broadcast( 'mdColorPicker:spectrumHueChange', {hue: hue});
				break;
			case 'alpha':
				var alpha = this.getColorByMouse( e );
				this.$scope.color.setAlpha( alpha );
				this.$scope.alpha = alpha;
				this.$scope.$apply();
				break;
			case 'spectrum':
				var color = this.getColorByMouse( e );
				this.setColor( color );
				break;
		}
	});
	console.log( this );
	this.$window.on( 'mousemove', fn );
	this.$window.one( 'mouseup', angular.bind(this, function( e ) {
		this.$window.off( 'mousemove', fn );
		this.$element.css({ 'cursor': 'crosshair' });
	}));

	// Set the color
	fn( e );
};

GradientCanvas.prototype.setColor = function( color ) {

		this.$scope.color._r = color.r;
		this.$scope.color._g = color.g;
		this.$scope.color._b = color.b;
		this.$scope.$apply();
		this.$scope.$broadcast('mdColorPicker:spectrumColorChange', { color: color });
};

GradientCanvas.prototype.onColorSet = function( e, args ) {
	switch( this.type ) {
		case 'hue':
			var hsv = this.$scope.color.toHsv();
			this.setMarkerCenter( this.canvas.height - ( this.canvas.height * ( hsv.h / 360 ) ) );
			break;
		case 'alpha':
			this.currentColor = args.color.toRgb();
			this.draw();

			var alpha = args.color.getAlpha();
			var pos = this.canvas.height - ( this.canvas.height * alpha );

			this.setMarkerCenter( pos );
			break;
		case 'spectrum':
			var hsv = args.color.toHsv();
			this.currentHue = hsv.h;
			this.draw();

			var posX = this.canvas.width * hsv.s;
			var posY = this.canvas.height - ( this.canvas.height * hsv.v );

			this.setMarkerCenter( posX, posY );
			break;
	}

};

var hueLinkFn = new GradientCanvas( 'hue', true );
hueLinkFn.getColorByPoint = function( x, y ) {
	var imageData = this.getImageData( x, y );
	this.setMarkerCenter( y );

	var hsl = new tinycolor( {r: imageData[0], g: imageData[1], b: imageData[2] } );
	return hsl.toHsl().h;

};
hueLinkFn.draw = function()  {


	this.$element.css({'height': this.height + 'px'});

	this.canvas.height = this.height;
	this.canvas.width = 50;



	// Create gradient
	var hueGrd = this.context.createLinearGradient(90, 0.000, 90, this.height);

	// Add colors
	hueGrd.addColorStop(0.01,	'rgba(255, 0, 0, 1.000)');
	hueGrd.addColorStop(0.167, 	'rgba(255, 0, 255, 1.000)');
	hueGrd.addColorStop(0.333, 	'rgba(0, 0, 255, 1.000)');
	hueGrd.addColorStop(0.500, 	'rgba(0, 255, 255, 1.000)');
	hueGrd.addColorStop(0.666, 	'rgba(0, 255, 0, 1.000)');
	hueGrd.addColorStop(0.828, 	'rgba(255, 255, 0, 1.000)');
	hueGrd.addColorStop(0.999, 	'rgba(255, 0, 0, 1.000)');

	// Fill with gradient
	this.context.fillStyle = hueGrd;
	this.context.fillRect( 0, 0, this.canvas.width, this.height );
};


var alphaLinkFn = new GradientCanvas( 'alpha', true );
alphaLinkFn.getColorByPoint = function( x, y ) {
	var imageData = this.getImageData( x, y );
	this.setMarkerCenter( y );

	return imageData[3] / 255;
};
alphaLinkFn.draw = function ()  {
	this.$element.css({'height': this.height + 'px'});

	this.canvas.height = this.height;
	this.canvas.width = this.height;

	// Create gradient
	var hueGrd = this.context.createLinearGradient(90, 0.000, 90, this.height);

	// Add colors
	hueGrd.addColorStop(0.01,	'rgba(' + this.currentColor.r + ',' + this.currentColor.g + ',' + this.currentColor.b + ', 1.000)');
	hueGrd.addColorStop(0.999,	'rgba(' + this.currentColor.r + ',' + this.currentColor.g + ',' + this.currentColor.b + ', 0.000)');

	// Fill with gradient
	this.context.fillStyle = hueGrd;
	this.context.fillRect( 0, 0, this.canvas.width, this.height );
};
alphaLinkFn.extra = function() {
	this.$scope.$on('mdColorPicker:spectrumColorChange', angular.bind( this, function( e, args ) {
		this.currentColor = args.color;
		this.draw();
	}));
};


var spectrumLinkFn = new GradientCanvas( 'spectrum', false );
spectrumLinkFn.getColorByPoint = function( x, y ) {
	var imageData = this.getImageData( x, y );
 	this.setMarkerCenter(x,y);

	return {
		r: imageData[0],
		g: imageData[1],
		b: imageData[2]
	};
};
spectrumLinkFn.draw = function() {
	this.canvas.height = this.height;
	this.canvas.width = this.height;
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	// White gradient

	var whiteGrd = this.context.createLinearGradient(0, 0, this.canvas.width, 0);

	whiteGrd.addColorStop(0, 'rgba(255, 255, 255, 1.000)');
	whiteGrd.addColorStop(1, 'rgba(255, 255, 255, 0.000)');

	// Black Gradient
	var blackGrd = this.context.createLinearGradient(0, 0, 0, this.canvas.height);

	blackGrd.addColorStop(0, 'rgba(0, 0, 0, 0.000)');
	blackGrd.addColorStop(1, 'rgba(0, 0, 0, 1.000)');

	// Fill with solid
	this.context.fillStyle = 'hsl( ' + this.currentHue + ', 100%, 50%)';
	this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );

	// Fill with white
	this.context.fillStyle = whiteGrd;
	this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );

	// Fill with black
	this.context.fillStyle = blackGrd;
	this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
};
spectrumLinkFn.extra = function() {
	this.$scope.$on('mdColorPicker:spectrumHueChange', angular.bind( this, function( e, args ) {
		this.currentHue = args.hue;
		this.draw();
		var markerPos = this.getMarkerCenter();
		var color = this.getColorByPoint( markerPos.x, markerPos.y );
		this.setColor( color );

	}));
};


angular.module('mdColorPicker', [])
	.run(['$templateCache', function ($templateCache) {
		//icon resource should not be dependent  
		//credit to materialdesignicons.com
		var shapes = {
			'clear': '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
			'gradient': '<path d="M11 9h2v2h-2zm-2 2h2v2H9zm4 0h2v2h-2zm2-2h2v2h-2zM7 9h2v2H7zm12-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V5h14v6z"/>',
			'tune': '<path d="M13 21v-2h8v-2h-8v-2h-2v6h2zM3 17v2h6v-2H3z"/><path d="M21 13v-2H11v2h10zM7 9v2H3v2h4v2h2V9H7z"/><path d="M15 9h2V7h4V5h-4V3h-2v6zM3 5v2h10V5H3z"/>',
			'view_module': '<path d="M4 11h5V5H4v6z"/><path d="M4 18h5v-6H4v6z"/><path d="M10 18h5v-6h-5v6z"/><path d="M16 18h5v-6h-5v6z"/><path d="M10 11h5V5h-5v6z"/><path d="M16 5v6h5V5h-5z"/>',
			'view_headline': '<path d="M4 15h17v-2H4v2z"/><path d="M4 19h17v-2H4v2z"/><path d="M4 11h17V9H4v2z"/><path d="M4 5v2h17V5H4z"/>',
			'history': '<path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/><path d="M12 8v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>',
		};
		for (var i in shapes) {
			if (shapes.hasOwnProperty(i)) {
				$templateCache.put([i, 'svg'].join('.'),
					['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">', shapes[i], '</svg>'].join(''));
			}
		}
	}])
	.factory('mdColorPickerHistory', ['$injector', function( $injector ) {

		var history = [];
		var strHistory = [];

		var $cookies = false;
		try {
			$cookies = $injector.get('$cookies');
		} catch(e) {

		}

		if ( $cookies ) {
			var tmpHistory = $cookies.getObject( 'mdColorPickerHistory' ) || [];
			for ( var i = 0; i < tmpHistory.length; i++ ) {
				history.push( tinycolor( tmpHistory[i] ) );
				strHistory.push( tmpHistory[i] );
			}
		}

		var length = 40;

		return {
			length: function() {
				if ( arguments[0] ) {
					length = arguments[0];
				} else {
					return history.length;
				}
			},
			add: function( color ) {
				for( var x = 0; x < history.length; x++ ) {
					if ( history[x].toRgbString() === color.toRgbString() ) {
						history.splice(x, 1);
						strHistory.splice(x, 1);
					}
				}

				history.unshift( color );
				strHistory.unshift( color.toRgbString() );

				if ( history.length > length ) {
					history.pop();
					strHistory.pop();
				}
				if ( $cookies ) {
					$cookies.putObject('mdColorPickerHistory', strHistory );
				}
			},
			get: function() {
				return history;
			},
			reset: function() {
				history = [];
				strHistory = [];
				if ( $cookies ) {
					$cookies.putObject('mdColorPickerHistory', strHistory );
				}
			}
		};
	}])
	.directive('mdColorPicker', [ '$timeout', 'mdColorPickerHistory', function( $timeout, colorHistory ) {

		return {
			templateUrl: "mdColorPicker.tpl.html",

			// Added required controller ngModel
			require: '^ngModel',
			scope: {
				type: '@',
				label: '@',
				icon: '@',
				default: '@',
				random: '@',
				openOnInput: '@',
				hasBackdrop: '@',
				clickOutsideToClose: '@'
			},
			controller: ['$scope', '$element', '$mdDialog', '$mdColorPicker', function( $scope, $element, $mdDialog, $mdColorPicker ) {
				var didJustClose = false;

				// Get ngModelController from the current element
				var ngModel = $element.controller('ngModel');

				// Quick function for updating the local 'value' on scope
				var updateValue = function(val) {
					$scope.value = val || ngModel.$viewValue || '';
				};

				// Set the starting value
				updateValue();

				// Keep an eye on changes
				$scope.$watch(function() {
					return ngModel.$modelValue;
				},function(newVal) {
					updateValue(newVal);
				});

				// Watch for updates to value and set them on the model
				$scope.$watch('value',function(newVal,oldVal) {
					if (newVal !== '' && typeof newVal !== 'undefined' && newVal && newVal !== oldVal) {
						ngModel.$setViewValue(newVal);
					}
				});

				// The only other ngModel changes

				$scope.clearValue = function clearValue() {
					$scope.value = '';
				};
				$scope.showColorPicker = function showColorPicker($event) {
					if ( didJustClose ) {
						return;
					}
					$mdColorPicker.show({
						value: $scope.value,
						defaultValue: $scope.default,
						random: $scope.random,
						clickOutsideToClose: $scope.clickOutsideToClose,
						hasBackdrop: $scope.hasBackdrop
					}).then(function( color ) {
						$scope.value = color;
					});
				};
			}],
			compile: function( element, attrs ) {
				//attrs.value = attrs.value || "#ff0000";
				attrs.type = attrs.type !== undefined ? attrs.type : 0;
			}
		};
	}])
	.directive( 'mdColorPickerDialog', ['$compile','$timeout','mdColorPickerHistory', function( $compile, $timeout, colorHistory ) {
		return {
			templateUrl: 'mdColorPickerDialog.tpl.html',
			scope: {
				value: '=?',
				default: '@',
				random: '@',
				ok: '=?'
			},
			controller: ["$scope", "$element", "$attrs", function( $scope, $element, $attrs ) {

				///////////////////////////////////
				// Variables
				///////////////////////////////////
				var container = angular.element( $element[0].querySelector('.md-color-picker-container') );
				var resultSpan = angular.element( container[0].querySelector('.md-color-picker-result') );
				var previewInput = angular.element( $element[0].querySelector('.md-color-picker-preview-input') );
				var materialPreview = false;

				var outputFn = [
					'toHexString',
					'toRgbString',
					'toHslString'
				];



				$scope.default = $scope.default ? $scope.default : $scope.random ? tinycolor.random() : 'rgb(127, 64, 64)';
				if ( $scope.value.search('#') >= 0 ) {
					$scope.type = 0;
				} else if ( $scope.value.search('rgb') >= 0 ) {
					$scope.type = 1;
				} else if ( $scope.value.search('hsl') >= 0 ) {
					$scope.type = 2;
				}
				$scope.color = new tinycolor($scope.value || $scope.default); // Set initial color
				$scope.alpha = $scope.color.getAlpha();
				$scope.history =  colorHistory;
				$scope.materialFamily = [];

				$scope.whichPane = 0;
				$scope.inputFocus = false;

				// Colors for the palette screen
				///////////////////////////////////
				var steps = 9;
				var freq = 2*Math.PI/steps;
				var basePalette = [
					tinycolor('rgb(255, 0, 0)'),		// Red
					tinycolor('rgb(255, 128, 0)'),		// Orange
					tinycolor('rgb(255, 255, 0)'),		// Yellow
					tinycolor('rgb(0, 255, 0)'),		// Green
					tinycolor('rgb(0, 255, 128)'),		//
					tinycolor('rgb(0, 255, 255)'),		// Teal
					tinycolor('rgb(0, 128, 255)'),		//
					tinycolor('rgb(0, 0, 255)'),		// Blue
					tinycolor('rgb(128, 0, 255)'),		// Purple
					tinycolor('rgb(255, 0, 255)')		// Fusia
				];
				var grays = [
					'rgb(255, 255, 255)',				//	White
					'rgb(205, 205, 205)',				//	  |
					'rgb(178, 178, 178)',				//	  |
					'rgb(153, 153, 153)',				//	  |
					'rgb(127, 127, 127)',				//	  |
					'rgb(102, 102, 102)',				//	  |
					'rgb(76, 76, 76)',					//	  |
					'rgb(51, 51, 51)',					//	\ | /
					'rgb(25, 25, 25)',					//	 \|/
					'rgb(0, 0, 0)'						//	Black
				];
				$scope.palette = [

				];

				var colors = [];
				var x, y;
				for ( x = -4; x <= 4; x++ ) {
					colors = [];
					for ( y = 0; y < basePalette.length; y++ ) {
						var newColor = new tinycolor( basePalette[y].toRgb() );
						if ( x < 0 ) {
							colors.push( newColor.lighten( Math.abs( x * 10 ) ).toRgbString() );
						}
						if ( x === 0 ) {
							colors.push( basePalette[y].toRgbString() );
						}
						if ( x > 0 ) {
							colors.push( newColor.darken( (x * ( x / 5 )) * 10 ).toRgbString() );
						}
					}
					$scope.palette.push( colors );
				}
				$scope.palette.push( grays );


				$scope.material = {
					colors: [{
						"Red": 			["#F44336","#FFEBEE","#FFCDD2","#EF9A9A","#E57373","#EF5350","#F44336","#E53935","#D32F2F","#C62828","#B71C1C","#FF8A80","#FF5252","#FF1744","#D50000"],
						"Pink": 		["#E91E63","#FCE4EC","#F8BBD0","#F48FB1","#F06292","#EC407A","#E91E63","#D81B60","#C2185B","#AD1457","#880E4F","#FF80AB","#FF4081","#F50057","#C51162"],
						"Purple": 		["#9C27B0","#F3E5F5","#E1BEE7","#CE93D8","#BA68C8","#AB47BC","#9C27B0","#8E24AA","#7B1FA2","#6A1B9A","#4A148C","#EA80FC","#E040FB","#D500F9","#AA00FF"],
						"Deep Purple": 	["#673AB7","#EDE7F6","#D1C4E9","#B39DDB","#9575CD","#7E57C2","#673AB7","#5E35B1","#512DA8","#4527A0","#311B92","#B388FF","#7C4DFF","#651FFF","#6200EA"],
						"Indigo": 		["#3F51B5","#E8EAF6","#C5CAE9","#9FA8DA","#7986CB","#5C6BC0","#3F51B5","#3949AB","#303F9F","#283593","#1A237E","#8C9EFF","#536DFE","#3D5AFE","#304FFE"],
						"Blue": 		["#2196F3","#E3F2FD","#BBDEFB","#90CAF9","#64B5F6","#42A5F5","#2196F3","#1E88E5","#1976D2","#1565C0","#0D47A1","#82B1FF","#448AFF","#2979FF","#2962FF"],
						"Light Blue": 	["#03A9F4","#E1F5FE","#B3E5FC","#81D4FA","#4FC3F7","#29B6F6","#03A9F4","#039BE5","#0288D1","#0277BD","#01579B","#80D8FF","#40C4FF","#00B0FF","#0091EA"],
						"Cyan": 		["#00BCD4","#E0F7FA","#B2EBF2","#80DEEA","#4DD0E1","#26C6DA","#00BCD4","#00ACC1","#0097A7","#00838F","#006064","#84FFFF","#18FFFF","#00E5FF","#00B8D4"],
					},{
						"Teal": 		["#009688","#E0F2F1","#B2DFDB","#80CBC4","#4DB6AC","#26A69A","#009688","#00897B","#00796B","#00695C","#004D40","#A7FFEB","#64FFDA","#1DE9B6","#00BFA5"],
						"Green": 		["#4CAF50","#E8F5E9","#C8E6C9","#A5D6A7","#81C784","#66BB6A","#4CAF50","#43A047","#388E3C","#2E7D32","#1B5E20","#B9F6CA","#69F0AE","#00E676","#00C853"],
						"Light Green": 	["#8BC34A","#F1F8E9","#DCEDC8","#C5E1A5","#AED581","#9CCC65","#8BC34A","#7CB342","#689F38","#558B2F","#33691E","#CCFF90","#B2FF59","#76FF03","#64DD17"],
						"Lime": 		["#CDDC39","#F9FBE7","#F0F4C3","#E6EE9C","#DCE775","#D4E157","#CDDC39","#C0CA33","#AFB42B","#9E9D24","#827717","#F4FF81","#EEFF41","#C6FF00","#AEEA00"],
						"Yellow": 		["#FFEB3B","#FFFDE7","#FFF9C4","#FFF59D","#FFF176","#FFEE58","#FFEB3B","#FDD835","#FBC02D","#F9A825","#F57F17","#FFFF8D","#FFFF00","#FFEA00","#FFD600"],
						"Amber": 		["#FFC107","#FFF8E1","#FFECB3","#FFE082","#FFD54F","#FFCA28","#FFC107","#FFB300","#FFA000","#FF8F00","#FF6F00","#FFE57F","#FFD740","#FFC400","#FFAB00"],
						"Orange": 		["#FF9800","#FFF3E0","#FFE0B2","#FFCC80","#FFB74D","#FFA726","#FF9800","#FB8C00","#F57C00","#EF6C00","#E65100","#FFD180","#FFAB40","#FF9100","#FF6D00"],
						"Deep Orange": 	["#FF5722","#FBE9E7","#FFCCBC","#FFAB91","#FF8A65","#FF7043","#FF5722","#F4511E","#E64A19","#D84315","#BF360C","#FF9E80","#FF6E40","#FF3D00","#DD2C00"]
					}],

					colors2: {
						"Red": 			["#F44336","#FFEBEE","#FFCDD2","#EF9A9A","#E57373","#EF5350","#F44336","#E53935","#D32F2F","#C62828","#B71C1C","#FF8A80","#FF5252","#FF1744","#D50000"],
						"Pink": 		["#E91E63","#FCE4EC","#F8BBD0","#F48FB1","#F06292","#EC407A","#E91E63","#D81B60","#C2185B","#AD1457","#880E4F","#FF80AB","#FF4081","#F50057","#C51162"],
						"Purple": 		["#9C27B0","#F3E5F5","#E1BEE7","#CE93D8","#BA68C8","#AB47BC","#9C27B0","#8E24AA","#7B1FA2","#6A1B9A","#4A148C","#EA80FC","#E040FB","#D500F9","#AA00FF"],
						"Deep Purple": 	["#673AB7","#EDE7F6","#D1C4E9","#B39DDB","#9575CD","#7E57C2","#673AB7","#5E35B1","#512DA8","#4527A0","#311B92","#B388FF","#7C4DFF","#651FFF","#6200EA"],
						"Indigo": 		["#3F51B5","#E8EAF6","#C5CAE9","#9FA8DA","#7986CB","#5C6BC0","#3F51B5","#3949AB","#303F9F","#283593","#1A237E","#8C9EFF","#536DFE","#3D5AFE","#304FFE"],
						"Blue": 		["#2196F3","#E3F2FD","#BBDEFB","#90CAF9","#64B5F6","#42A5F5","#2196F3","#1E88E5","#1976D2","#1565C0","#0D47A1","#82B1FF","#448AFF","#2979FF","#2962FF"],
						"Light Blue": 	["#03A9F4","#E1F5FE","#B3E5FC","#81D4FA","#4FC3F7","#29B6F6","#03A9F4","#039BE5","#0288D1","#0277BD","#01579B","#80D8FF","#40C4FF","#00B0FF","#0091EA"],
						"Cyan": 		["#00BCD4","#E0F7FA","#B2EBF2","#80DEEA","#4DD0E1","#26C6DA","#00BCD4","#00ACC1","#0097A7","#00838F","#006064","#84FFFF","#18FFFF","#00E5FF","#00B8D4"],
						"Teal": 		["#009688","#E0F2F1","#B2DFDB","#80CBC4","#4DB6AC","#26A69A","#009688","#00897B","#00796B","#00695C","#004D40","#A7FFEB","#64FFDA","#1DE9B6","#00BFA5"],
						"Green": 		["#4CAF50","#E8F5E9","#C8E6C9","#A5D6A7","#81C784","#66BB6A","#4CAF50","#43A047","#388E3C","#2E7D32","#1B5E20","#B9F6CA","#69F0AE","#00E676","#00C853"],
						"Light Green": 	["#8BC34A","#F1F8E9","#DCEDC8","#C5E1A5","#AED581","#9CCC65","#8BC34A","#7CB342","#689F38","#558B2F","#33691E","#CCFF90","#B2FF59","#76FF03","#64DD17"],
						"Lime": 		["#CDDC39","#F9FBE7","#F0F4C3","#E6EE9C","#DCE775","#D4E157","#CDDC39","#C0CA33","#AFB42B","#9E9D24","#827717","#F4FF81","#EEFF41","#C6FF00","#AEEA00"],
						"Yellow": 		["#FFEB3B","#FFFDE7","#FFF9C4","#FFF59D","#FFF176","#FFEE58","#FFEB3B","#FDD835","#FBC02D","#F9A825","#F57F17","#FFFF8D","#FFFF00","#FFEA00","#FFD600"],
						"Amber": 		["#FFC107","#FFF8E1","#FFECB3","#FFE082","#FFD54F","#FFCA28","#FFC107","#FFB300","#FFA000","#FF8F00","#FF6F00","#FFE57F","#FFD740","#FFC400","#FFAB00"],
						"Orange": 		["#FF9800","#FFF3E0","#FFE0B2","#FFCC80","#FFB74D","#FFA726","#FF9800","#FB8C00","#F57C00","#EF6C00","#E65100","#FFD180","#FFAB40","#FF9100","#FF6D00"],
						"Deep Orange": 	["#FF5722","#FBE9E7","#FFCCBC","#FFAB91","#FF8A65","#FF7043","#FF5722","#F4511E","#E64A19","#D84315","#BF360C","#FF9E80","#FF6E40","#FF3D00","#DD2C00"]
					},

					greys: {
						"Brown": 		["#795548","#EFEBE9","#D7CCC8","#BCAAA4","#A1887F","#8D6E63","#795548","#6D4C41","#5D4037","#4E342E","#3E2723"],
						"Grey": 		["#9E9E9E","#FAFAFA","#F5F5F5","#EEEEEE","#E0E0E0","#BDBDBD","#9E9E9E","#757575","#616161","#424242","#212121"],
						"Blue Grey": 	["#607D8B","#ECEFF1","#CFD8DC","#B0BEC5","#90A4AE","#78909C","#607D8B","#546E7A","#455A64","#37474F","#263238"],
					},
					"Black": 		["#000000"],
					"White": 		["#FFFFFF"],
					labels: ["","50","100","200","300","400","500","600","700","800","900","A100","A200","A300","A400"]
				};


				///////////////////////////////////
				// Functions
				///////////////////////////////////
				$scope.isDark = function isDark( color ) {
					return tinycolor( color ).isDark();
				}
				$scope.previewFocus = function() {
					$scope.inputFocus = true;
					$timeout( function() {
						previewInput[0].setSelectionRange(0, previewInput[0].value.length);
					});
				};
				$scope.previewUnfocus = function() {
					$scope.inputFocus = false;
					previewInput[0].blur();
				};
				$scope.previewBlur = function() {
					$scope.inputFocus = false;
					$scope.setValue();
				};
				$scope.previewKeyDown = function( $event ) {

					if ( $event.keyCode == 13 ) {
						$scope.ok && $scope.ok();
					}
				};
				$scope.setPaletteColor = function( event ) {
					$scope.color = tinycolor( event.currentTarget.style.background );
				};
				$scope.setMaterialColor = function( event, family ) {
					if ( materialPreview ) {
						materialPreview.remove();
					}
					$scope.materialFamily = [];

					console.log( family, family.length - 1);
					var currentEl = angular.element( event.currentTarget );
					materialPreview = $compile([	'<div class="md-color-picker-material-colors" layout="column" >',
										  		'<div ng-repeat="shade in materialFamily track by $index" ng-style="{\'background\': shade };" style="height: '+(100 / (family.length-1) )+'%; width: 100%"  ng-click="setPaletteColor($event)" class="md-color-picker-with-label">{{material.labels[$index]}}</div>',
											'</div>'].join('\n'))($scope);
					var parent = currentEl.parent().parent();

					materialPreview.css({
						'background': currentEl[0].style.background,
						'top': currentEl[0].offsetTop + 'px',
						'left': currentEl[0].offsetLeft + 'px',
						'right': Math.max( 0, parent[0].offsetWidth - ( currentEl[0].offsetLeft + currentEl[0].offsetWidth ) ) + 'px',
						'bottom': Math.max( 0, parent[0].offsetHeight - ( currentEl[0].offsetTop + currentEl[0].offsetHeight ) ) + 'px'
					});

					$scope.color = tinycolor( event.currentTarget.style.background );
					var materialFamily = angular.copy(family);
					materialFamily.splice(0,1);

					parent.append( materialPreview );
					$scope.materialFamily = materialFamily;
					$timeout(function() {
						materialPreview.css({
							top: 0,
							bottom: '7px',
							right: '8px',
							left: '8px'
						});
					});

				/*	var x = 0;
					var showShades = function showShades() {
						$scope.materialFamily.push( materialFamily[x] );
						x++;
						if ( x < materialFamily.length ) {
							$timeout( showShades, 50 );
						}
					};
					showShades();
				*/


				};
				$scope.setValue = function setValue() {
					// Set the value if available
					if ( $scope.color && $scope.color && outputFn[$scope.type] && $scope.color.toRgbString() !== 'rgba(0, 0, 0, 0)' ) {
						$scope.value = $scope.color[outputFn[$scope.type]]();
					}
				};

				$scope.changeValue = function changeValue() {
					$scope.color = tinycolor( $scope.value );
					$scope.$broadcast('mdColorPicker:colorSet', { color: $scope.color });
				};


				///////////////////////////////////
				// Watches and Events
				///////////////////////////////////
				$scope.$watch( 'alpha', function( newValue ) {
					$scope.color.setAlpha( newValue );
				});

				$scope.$watch( 'whichPane', function( newValue ) {
					// 0 - spectrum selector
					// 1 - sliders
					// 2 - palette
					$scope.$broadcast('mdColorPicker:colorSet', {color: $scope.color });
					if ( materialPreview ) {
						materialPreview.remove();
					}
				});

				$scope.$watch( 'type', function() {
					previewInput.removeClass('switch');
					$timeout(function() {
						previewInput.addClass('switch');
					});
				});

				$scope.$watchGroup(['color.toRgbString()', 'type'], function( newValue ) {
					if ( !$scope.inputFocus ) {
						$scope.setValue();
					}
				});


				///////////////////////////////////
				// INIT
				// Let all the other directives initialize
				///////////////////////////////////
				$timeout( function() {
					$scope.$broadcast('mdColorPicker:colorSet', { color: $scope.color });
					previewInput.focus();
					$scope.previewFocus();
				});
			}]
		}
	}])

	.directive( 'mdColorPickerHue', [function() {
		return {
			template: '<canvas width="100%" height="100%"></canvas><div class="md-color-picker-marker"></div>',
			link: hueLinkFn.get
		};
	}])

	.directive( 'mdColorPickerAlpha', [function() {
		return {
			template: '<canvas width="100%" height="100%"></canvas><div class="md-color-picker-marker"></div>',
			link: alphaLinkFn.get
		};
	}])

	.directive( 'mdColorPickerSpectrum', [function() {
		return {
			template: '<canvas width="100%" height="100%"></canvas><div class="md-color-picker-marker"></div>{{hue}}',
			link: spectrumLinkFn.get
		};
	}])

    .factory('$mdColorPicker', ['$q', '$mdDialog', 'mdColorPickerHistory', function ($q, $mdDialog, colorHistory)
    {
        return {
            show: function (options)
            {
                //var result = $q.defer();

                if (options === undefined)
                {
                    options = {};
                }

                if (options.hasBackdrop === undefined)
                    options.hasBackdrop = true;

                if (options.clickOutsideToClose === undefined)
                    options.clickOutsideToClose = true;

                if (options.defaultValue === undefined)
                    options.defaultValue = '#FFFFFF';

                if (options.focusOnOpen === undefined)
                    options.focusOnOpen = false;


                var dialog = $mdDialog.show({
					template: ''+
					'<md-dialog class="md-color-picker-dialog">'+
					'	<div md-color-picker-dialog value="value" default="{{defaultValue}}" random="{{random}}" ok="ok"></div>'+
					'	<md-actions layout="row">'+
					'		<md-button class="md-mini" flex ng-click="close()">Cancel</md-button>'+
					'		<md-button class="md-mini" flex ng-click="ok()">Select</md-button>'+
					'	</md-actions>'+
					'</md-dialog>',
					hasBackdrop: options.hasBackdrop,
					clickOutsideToClose: options.clickOutsideToClose,

					controller: ['$scope', 'value', 'defaultValue', 'random', function( $scope, value, defaultValue, random ) {
							console.log( value );
							$scope.close = function close()
                            {
								$mdDialog.cancel();
							};
							$scope.ok = function ok()
							{
								$mdDialog.hide( $scope.value );
							};

							$scope.value = value;
							$scope.default = defaultValue;
							$scope.random = random;
							$scope.hide = $scope.ok;
					}],

					locals: {
						value: options.value,
						defaultValue: options.default,
						random: options.random
					},
					targetEvent: options.$event,
					focusOnOpen: options.focusOnOpen
                });

				dialog.then(function (value) {
                    colorHistory.add(new tinycolor(value));
                }, function () { });

                return dialog;
            }
		};
	}]);
})( window, window.angular );

angular.module("mdColorPicker").run(["$templateCache", function($templateCache) {$templateCache.put("mdColorPicker.tpl.html","<div class=\"md-color-picker-input-container\" layout=\"row\">\n	<div class=\"md-color-picker-preview md-color-picker-checkered-bg\" ng-click=\"showColorPicker()\">\n		<div class=\"md-color-picker-result\" ng-style=\"{background: value}\"></div>\n	</div>\n	<md-input-container flex>\n		<label><md-icon ng-if=\"icon\">{{icon}}</md-icon>{{label}}</label>\n		<input type=\"input\" ng-model=\"value\" class=\'md-color-picker-input\'  ng-mousedown=\"openOnInput && showColorPicker($mdOpenMenu, $event)\"/>\n	</md-input-container>\n	<md-button class=\"md-icon-button md-color-picker-clear\" ng-if=\"value\" ng-click=\"clearValue();\" aria-label=\"Clear Color\">\n		<md-icon md-svg-icon=\"clear.svg\"></md-icon>\n	</md-button>\n</div>\n");
$templateCache.put("mdColorPickerDialog.tpl.html","<div class=\"md-color-picker-container in\" layout=\"column\">\n	<div class=\"md-color-picker-arrow\" ng-style=\"{\'border-bottom-color\': color.toRgbString() }\"></div>\n\n	<div class=\"md-color-picker-preview md-color-picker-checkered-bg\" ng-class=\"{\'dark\': !color.isDark() || color.getAlpha() < .45}\" flex=\"1\" layout=\"column\">\n\n		<div class=\"md-color-picker-result\" ng-style=\"{\'background\': color.toRgbString()}\" flex=\"100\" layout=\"column\" layout-fill layout-align=\"center center\" ng-click=\"focusPreviewInput( $event )\">\n			<!--<span flex  layout=\"column\" layout-align=\"center center\">{{value}}</span>-->\n			<div flex  layout=\"row\" layout-align=\"center center\">\n				<input class=\"md-color-picker-preview-input\" type=\"text\" ng-model=\"value\" ng-focus=\"previewFocus($event);\" ng-blur=\"previewBlur()\" ng-change=\"changeValue()\" ng-keypress=\"previewKeyDown($event)\" layout-fill />\n			</div>\n			<div class=\"md-color-picker-tabs\" style=\"width: 100%\">\n				<md-tabs md-selected=\"type\" md-stretch-tabs=\"always\" md-no-bar md-no-ink md-no-pagination=\"true\" >\n					<md-tab label=\"Hex\" ng-disabled=\"color.getAlpha() !== 1\" md-ink-ripple=\"#ffffff\"></md-tab>\n					<md-tab label=\"RGB\"></md-tab>\n					<md-tab label=\"HSL\"></md-tab>\n					<!--<md-tab label=\"HSV\"></md-tab>\n					<md-tab label=\"VEC\"></md-tab>-->\n				</md-tabs>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"md-color-picker-tabs md-color-picker-colors\">\n		<md-tabs md-stretch-tabs=\"always\" md-align-tabs=\"bottom\"  md-selected=\"whichPane\" md-no-pagination>\n			<md-tab>\n				<md-tab-label>\n					<md-icon md-svg-icon=\"gradient.svg\"></md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"row\" layout-align=\"space-between\" style=\"height: 255px\">\n						<div md-color-picker-spectrum></div>\n						<div md-color-picker-hue></div>\n						<div md-color-picker-alpha class=\"md-color-picker-checkered-bg\"></div>\n					</div>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon md-svg-icon=\"tune.svg\"></md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"column\" flex=\"100\" layout-fill layout-align=\"space-between start center\" class=\"md-color-picker-sliders\">\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">R</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"255\" ng-model=\"color._r\" aria-label=\"red\" class=\"red-slider\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\">\n								<input style=\"width: 100%;\" min=\"0\" max=\"255\" type=\"number\" ng-model=\"color._r\" aria-label=\"red\" aria-controls=\"red-slider\">\n							</div>\n						</div>\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">G</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"255\" ng-model=\"color._g\" aria-label=\"green\" class=\"green-slider\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\">\n								<input style=\"width: 100%;\" min=\"0\" max=\"255\" type=\"number\" ng-model=\"color._g\" aria-label=\"green\" aria-controls=\"green-slider\">\n							</div>\n						</div>\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">B</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"255\" ng-model=\"color._b\" aria-label=\"blue\" class=\"blue-slider\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\" >\n								<input style=\"width: 100%;\" min=\"0\" max=\"255\" type=\"number\" ng-model=\"color._b\" aria-label=\"blue\" aria-controls=\"blue-slider\">\n							</div>\n						</div>\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">A</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"1\" step=\".01\" ng-model=\"alpha\" aria-label=\"alpha\" class=\"md-primary\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\" >\n								<input style=\"width: 100%;\" min=\"0\" max=\"1\" step=\".01\" type=\"number\" ng-model=\"alpha\" aria-label=\"alpha\" aria-controls=\"blue-slider\">\n							</div>\n						</div>\n					</div>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon md-svg-icon=\"view_module.svg\"></md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"column\" layout-align=\"space-between start center\" flex>\n						<div ng-repeat=\"row in palette track by $index\" flex=\"15\"  layout-align=\"space-between\" layout=\"row\"  layout-fill>\n							<div ng-repeat=\"col in row track by $index\" flex=\"10\" style=\"height: 25.5px;\" ng-style=\"{\'background\': col};\" ng-click=\"setPaletteColor($event)\"></div>\n						</div>\n					</div>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon md-svg-icon=\"view_headline.svg\"></md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"column\" layout-fill flex class=\"md-color-picker-material\">\n						<div ng-repeat=\"(key, value) in material.colors2\">\n							<div ng-repeat=\"row in value track by $index\" ng-style=\"{\'background\': row, height: $index ? \'33px\':\'75px\'}\" ng-class=\"{\'md-color-picker-with-label\': $index !== 0, \'md-color-picker-material-title\': $index === 0, \'dark\': isDark( row )}\" ng-click=\"setPaletteColor($event)\">\n								<span ng-if=\"$index === 0\">{{key}}</span>\n								<span ng-if=\"$index !== 0\">{{material.labels[$index]}}</span>\n							</div>\n						</div>\n					</div>\n					<script>\n					/*\n					<div layout=\"row\" layout-align=\"space-between start center\"  layout-fill layout-wrap flex class=\"md-color-picker-material\">\n						<!--<div flex=\"25\"  layout-align=\"space-between\" layout=\"row\"  layout-fill>\n							<div ng-repeat=\"col in row track by $index\" flex=\"10\" style=\"height: 25.5px;\" ng-style=\"{\'background\': col};\" ng-click=\"setPaletteColor($event)\"></div>-->\n							<div ng-repeat=\"col in material.colors track by $index\" layout-column flex=\"33\">\n								<div ng-repeat=\"(name, row) in col track by $index\" layout-row style=\"height: 31px;\" ng-style=\"{\'background\': row[0]};\" ng-click=\"setMaterialColor($event, row)\" class=\"md-color-picker-with-label\">{{name}}</div>\n							</div>\n							<div layout-column flex=\"33\">\n								<div ng-repeat=\"(name, row) in material.greys track by $index\" layout-row style=\"height: 31px;\" ng-style=\"{\'background\': row[0]};\" ng-click=\"setMaterialColor($event, row)\" class=\"md-color-picker-with-label\">{{name}}</div>\n							</div>\n						<!--</div>-->\n					</div>\n					*/</script>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon md-svg-icon=\"history.svg\"></md-icon>\n				</md-tab-label>\n				<md-tab-body layout=\"row\" layout-fill>\n					<div layout=\"column\" flex layout-align=\"space-between start\" layout-wrap layout-fill class=\"md-color-picker-history\">\n						<div layout=\"row\" flex=\"80\" layout-align=\"space-between start start\" layout-wrap  layout-fill>\n							<div flex=\"10\" ng-repeat=\"historyColor in history.get() track by $index\">\n								<div  ng-style=\"{\'background\': historyColor.toRgbString()}\" ng-click=\"setPaletteColor($event)\"></div>\n							</div>\n						</div>\n\n\n						<md-button flex-end ng-click=\"history.reset()\" class=\"md-mini\">\n							<md-icon md-svg-icon=\"clear.svg\"></md-icon>\n						</md-button>\n					</div>\n				</md-tab-body>\n			</md-tab>\n		</md-tabs>\n	</div>\n\n</div>\n");}]);
})(angular, window, tinycolor);