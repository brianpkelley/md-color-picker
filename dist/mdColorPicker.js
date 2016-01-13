;(function(angular, window, tinycolor) {
/*
md-color-picker 0.1.0
https://github.com/brianpkelley/md-color-picker
Brian Kelley
GNU GENERAL PUBLIC LICENSE
*/

'use strict';

angular.module('mdColorPicker', [])
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
			controller: ['$scope', '$element', '$mdDialog', function( $scope, $element, $mdDialog ) {
				var didJustClose = false;

				// Get ngModelController from the current element
				var ngModel = $element.controller('ngModel');

				// Quick function for updating the local 'value' on scope
				var updateValue = function(val) {
					console.log( val );
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
					$mdDialog.show({
						template: ''+
						'<md-dialog class="md-color-picker-dialog">'+
						'	<div md-color-picker-dialog value="value" default="{{default}}" random="{{random}}" ok="ok"></div>'+
						'	<md-actions layout="row">'+
						'		<md-button class="md-mini" flex ng-click="close()">Cancel</md-button>'+
						'		<md-button class="md-mini" flex ng-click="ok()">Select</md-button>'+
						'	</md-actions>'+
						'</md-dialog>',
						hasBackdrop: !!$scope.hasBackdrop,
						clickOutsideToClose: !!$scope.clickOutsideToClose,

						controller: ['$scope', 'value', 'defaultValue', 'random', function( $scope, value, defaultValue, random ) {
								$scope.close = function close() {
										$mdDialog.cancel();
								};
								$scope.ok = function ok() {
									$mdDialog.hide( $scope.value );
								};

								$scope.value = value;
								$scope.default = defaultValue;
								$scope.random = random;
								$scope.hide = $scope.ok;
						}],

						locals: {
							value: $scope.value,
							defaultValue: $scope.default,
							random: $scope.random
						},
						targetEvent: $event,
						focusOnOpen: false,
						onRemoving: function() {
							didJustClose = true;
							$timeout(function() {
								didJustClose = false;
							},500);
						}
					}).then(function(value) {
						$scope.value = value;
						colorHistory.add( new tinycolor( value ) );


					}, function() { });
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
				var input = angular.element( $element[0].querySelector('.md-color-picker-input') );
				var previewInput = angular.element( $element[0].querySelector('.md-color-picker-preview-input') );
				var materialPreview = false;

				var outputFn = [
					'toHexString',
					'toRgbString',
					'toHslString'
				];



				$scope.default = $scope.default ? $scope.default : $scope.random ? tinycolor.random() : 'rgb(127, 64, 64)';
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
					resultSpan.removeClass('switch');
					$timeout(function() {
						resultSpan.addClass('switch');
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

			controller: ['$scope',function($scope) {

			}],
			link: function( $scope, $element, $attrs ) {

				////////////////////////////
				// Variables
				////////////////////////////

				var height;

				var canvas = $element.children()[0];
				var marker = $element.children()[1];
				var context = canvas.getContext('2d');



				////////////////////////////
				// Functions
				////////////////////////////

				var getColorByMouse = function getColorByMouse( e ) {
					var x = e.pageX - offset.x;
					var y = e.pageY - offset.y;

					return getColorByPoint( x, y );
				};

				var getColorByPoint = function getColorByPoint( x, y ) {

					x = Math.max( 0, Math.min( x, canvas.width-1 ) );
					y = Math.max( 0, Math.min( y, canvas.height-1 ) );

					var imageData = context.getImageData( x, y, 1, 1 ).data;

					setMarkerCenter( y );

					var hsl = new tinycolor( {r: imageData[0], g: imageData[1], b: imageData[2] } );
					return hsl.toHsl().h;

				};

				var setMarkerCenter = function setMarkerCenter( y ) {
					angular.element(marker).css({'left': '0'});
					angular.element(marker).css({'top': y - ( marker.offsetHeight  /2 ) + 'px'});
				};


				var draw = function draw()  {

					height = 255; //$scope.height || $element[0].getBoundingClientRect().height || $element[0].offsetHeight;
					$element.css({'height': height + 'px'});

					canvas.height = height;
					canvas.width = 50;



					// Create gradient
					var hueGrd = context.createLinearGradient(90, 0.000, 90, height);

					// Add colors
					hueGrd.addColorStop(0.01,	'rgba(255, 0, 0, 1.000)');
					hueGrd.addColorStop(0.167, 	'rgba(255, 0, 255, 1.000)');
					hueGrd.addColorStop(0.333, 	'rgba(0, 0, 255, 1.000)');
					hueGrd.addColorStop(0.500, 	'rgba(0, 255, 255, 1.000)');
					hueGrd.addColorStop(0.666, 	'rgba(0, 255, 0, 1.000)');
					hueGrd.addColorStop(0.828, 	'rgba(255, 255, 0, 1.000)');
					hueGrd.addColorStop(0.999, 	'rgba(255, 0, 0, 1.000)');

					// Fill with gradient
					context.fillStyle = hueGrd;
					context.fillRect( 0, 0, canvas.width, height );
				};

				////////////////////////////
				// Watchers, Observes, Events
				////////////////////////////

				//$scope.$watch( function() { return color.getRgb(); }, hslObserver, true );

				var offset = {
					x: null,
					y: null
				};

				var $window = angular.element( window );
				$element.on( 'mousedown', function( e ) {
					// Prevent highlighting
					e.preventDefault();
					e.stopImmediatePropagation();

					$scope.previewUnfocus();

					$element.css({ 'cursor': 'none' });

					offset.x = canvas.getBoundingClientRect().left+1;
					offset.y = canvas.getBoundingClientRect().top;

					var fn = function( e ) {
						var hue = getColorByMouse( e );

						$scope.$broadcast( 'mdColorPicker:spectrumHueChange', {hue: hue});
					};

					$window.on( 'mousemove', fn );
					$window.one( 'mouseup', function( e ) {
						$window.off( 'mousemove', fn );
						$element.css({ 'cursor': 'crosshair' });
					});

					// Set the color
					fn( e );
				});
				$scope.$on('mdColorPicker:colorSet', function( e, args ) {
					var hsv = $scope.color.toHsv();
					setMarkerCenter( canvas.height - ( canvas.height * ( hsv.h / 360 ) ) );
				});

				////////////////////////////
				// init
				////////////////////////////

				draw();



			}
		};
	}])



	.directive( 'mdColorPickerAlpha', [function() {
		return {
			template: '<canvas width="100%" height="100%"></canvas><div class="md-color-picker-marker"></div>',

			controller: ['$scope',function($scope) {


			}],
			link: function( $scope, $element, $attrs ) {

				////////////////////////////
				// Variables
				////////////////////////////
				var height;

				var canvas = $element.children()[0];
				var marker = $element.children()[1];
				var context = canvas.getContext('2d');

				var currentColor = $scope.color.toRgb();


				////////////////////////////
				// Functions
				////////////////////////////
				var getColorByMouse = function getColorByMouse( e ) {
					var x = e.pageX - offset.x;
					var y = e.pageY - offset.y;

					return getColorByPoint( x, y );
				};

				var getColorByPoint = function getColorByPoint( x, y ) {

					x = Math.max( 0, Math.min( x, canvas.width-1 ) );
					y = Math.max( 0, Math.min( y, canvas.height-1 ) );

					var imageData = context.getImageData( x, y, 1, 1 ).data;

					setMarkerCenter( y );

					return imageData[3] / 255;

				};

				var setMarkerCenter = function setMarkerCenter( y ) {

					angular.element(marker).css({'left': '0'});
					angular.element(marker).css({'top': y - ( marker.offsetHeight  /2 ) + 'px'});
				};

				var alphaObserver = function( alpha ) {
					var pos = height - ( alpha * height );
					setMarkerCenter( pos );
				};

				var setAlpha = function setAlpha( alpha ) {
					$scope.color.setAlpha( alpha );
					$scope.alpha = alpha;
					$scope.$apply();
				};

				// Draw
				var draw = function draw()  {
					height = 255; // $scope.height || $element[0].getBoundingClientRect().height || $element[0].offsetHeight;
					$element.css({'height': height + 'px'});

					canvas.height = height;
					canvas.width = height;


					// Create gradient
					var hueGrd = context.createLinearGradient(90, 0.000, 90, height);



					// Add colors
					hueGrd.addColorStop(0.01,	'rgba(' + currentColor.r + ',' + currentColor.g + ',' + currentColor.b + ', 1.000)');
					hueGrd.addColorStop(0.999,	'rgba(' + currentColor.r + ',' + currentColor.g + ',' + currentColor.b + ', 0.000)');

					// Fill with gradient
					context.fillStyle = hueGrd;
					context.fillRect( 0, 0, canvas.width, height );
				};


				////////////////////////////
				// Watches, Observers, Events
				////////////////////////////


				var offset = { x: null, y: null };

				var $window = angular.element( window );
				$element.on( 'mousedown', function( e ) {
					// Prevent highlighting
					e.preventDefault();
					e.stopImmediatePropagation();

					$scope.previewUnfocus();

					$element.css({ 'cursor': 'none' });

					offset.x = canvas.getBoundingClientRect().left+1;
					offset.y = canvas.getBoundingClientRect().top;

					var fn = function( e ) {
						var alpha = getColorByMouse( e );
						setAlpha( alpha );
					};

					$window.on( 'mousemove', fn );
					$window.one( 'mouseup', function( e ) {
						$window.off( 'mousemove', fn );
						$element.css({ 'cursor': 'crosshair' });
					});

					// Set the color
					fn( e );
				});


				$scope.$on('mdColorPicker:spectrumColorChange', function( e, args ) {
					currentColor = args.color;
					draw();
				});
				$scope.$on('mdColorPicker:colorSet', function( e, args ) {
					currentColor = args.color.toRgb();
					draw();

					var alpha = args.color.getAlpha();
					var pos = canvas.height - ( canvas.height * alpha );

					setMarkerCenter( pos );
				});

				////////////////////////////
				// init
				////////////////////////////
				draw();
			}
		};
	}])


	.directive( 'mdColorPickerSpectrum', [function() {
		return {
			template: '<canvas width="100%" height="100%"></canvas><div class="md-color-picker-marker"></div>{{hue}}',

			controller: ['$scope',function($scope) {

			}],
			link: function( $scope, $element, $attrs ) {

				////////////////////////////
				// Variables
				////////////////////////////
				var height = 255; // Math.ceil( Math.min( $element[0].getBoundingClientRect().width || $element[0].offsetWidth , 255 ) );
				$element.css({'height': height + 'px'});

				var canvas = $element.children()[0];
				canvas.height = height;
				canvas.width = height;


				var marker = $element.children()[1];
				var context = canvas.getContext('2d');
				var currentHue = $scope.color.toHsl().h;


				////////////////////////////
				// Functions
				////////////////////////////
				var getColorByMouse = function getColorByMouse( e ) {
					var x = e.pageX - offset.x;
					var y = e.pageY - offset.y;

					return getColorByPoint( x, y );
				};

				var getColorByPoint = function getColorByPoint( x, y, forceApply ) {

					if ( forceApply === undefined ) {
						forceApply = true;
					}

					x = Math.max( 0, Math.min( x, canvas.width-1 ) );
					y = Math.max( 0, Math.min( y, canvas.height-1 ) );

					setMarkerCenter(x,y);

					var imageData = context.getImageData( x, y, 1, 1 ).data;
					return {
						r: imageData[0],
						g: imageData[1],
						b: imageData[2]
					};
				};

				var setMarkerCenter = function setMarkerCenter( x, y ) {
					angular.element(marker).css({'left': x - ( marker.offsetWidth / 2 ) + 'px'});
					angular.element(marker).css({'top': y - ( marker.offsetHeight  /2 ) + 'px'});
				};

				var getMarkerCenter = function getMarkerCenter() {
					var returnObj = {
						x: marker.offsetLeft + ( Math.floor( marker.offsetWidth / 2 ) ),
						y: marker.offsetTop + ( Math.floor( marker.offsetHeight / 2 ) )
					};
					return returnObj;
				};

				var draw = function draw() {
					context.clearRect(0, 0, canvas.width, canvas.height);
					// White gradient

					var whiteGrd = context.createLinearGradient(0, 0, canvas.width, 0);

					whiteGrd.addColorStop(0, 'rgba(255, 255, 255, 1.000)');
					whiteGrd.addColorStop(1, 'rgba(255, 255, 255, 0.000)');

					// Black Gradient
					var blackGrd = context.createLinearGradient(0, 0, 0, canvas.height);

					blackGrd.addColorStop(0, 'rgba(0, 0, 0, 0.000)');
					blackGrd.addColorStop(1, 'rgba(0, 0, 0, 1.000)');

					// Fill with solid
					context.fillStyle = 'hsl( ' + currentHue + ', 100%, 50%)';
					context.fillRect( 0, 0, canvas.width, canvas.height );

					// Fill with white
					context.fillStyle = whiteGrd;
					context.fillRect( 0, 0, canvas.width, canvas.height );

					// Fill with black
					context.fillStyle = blackGrd;
					context.fillRect( 0, 0, canvas.width, canvas.height );
				};

				var setColor = function setColor( color ) {
					$scope.color._r = color.r;
					$scope.color._g = color.g;
					$scope.color._b = color.b;
					$scope.$apply();
					$scope.$broadcast('mdColorPicker:spectrumColorChange', { color: color });
				};



				////////////////////////////
				// Watchers, Observers, Events
				////////////////////////////

				var offset = {
					x: null,
					y: null
				};

				var $window = angular.element( window );
				$element.on( 'mousedown', function( e ) {
					// Prevent highlighting
					e.preventDefault();
					e.stopImmediatePropagation();

					$scope.previewUnfocus();

					$element.css({ 'cursor': 'none' });

					offset.x = canvas.getBoundingClientRect().left+1;
					offset.y = canvas.getBoundingClientRect().top;

					var fn = function( e ) {
						var color = getColorByMouse( e );
						setColor( color );
					};

					$window.on( 'mousemove', fn );
					$window.one( 'mouseup', function( e ) {
						$window.off( 'mousemove', fn );
						$element.css({ 'cursor': 'crosshair' });
					});

					// Set the color
					fn( e );
				});

				$scope.$on('mdColorPicker:spectrumHueChange', function( e, args ) {
					currentHue = args.hue;
					draw();
					var markerPos = getMarkerCenter();
					var color = getColorByPoint( markerPos.x, markerPos.y );
					setColor( color );

				});

				$scope.$on('mdColorPicker:colorSet', function( e, args ) {
					var hsv = args.color.toHsv();
					currentHue = hsv.h;
					draw();

					var posX = canvas.width * hsv.s;
					var posY = canvas.height - ( canvas.height * hsv.v );

					setMarkerCenter( posX, posY );
				});

				////////////////////////////
				// init
				////////////////////////////

				draw();

			}
		};
	}])

    .factory('$mdColorPicker', ['$q', '$mdDialog', 'mdColorPickerHistory', function ($q, $mdDialog, colorHistory)
    {
        return {
            show: function (options)
            {
                var result = $q.defer();

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


                $mdDialog.show({
					template: ''+
					'<md-dialog class="md-color-picker-dialog">'+
					'	<div md-color-picker-dialog value="value" default="{{default}}" random="{{random}}" ok="ok"></div>'+
					'	<md-actions layout="row">'+
					'		<md-button class="md-mini" flex ng-click="close()">Cancel</md-button>'+
					'		<md-button class="md-mini" flex ng-click="ok()">Select</md-button>'+
					'	</md-actions>'+
					'</md-dialog>',
					hasBackdrop: options.hasBackdrop,
					clickOutsideToClose: options.clickOutsideToClose,

					controller: ['$scope', 'value', 'defaultValue', 'random', function( $scope, value, defaultValue, random ) {
							$scope.close = function close()
                            {
								$mdDialog.cancel();
							};
							$scope.ok = function ok()
							{
							    var responseTinycolor = new tinycolor($scope.value);

							    var response = {
                                    selectedValue: $scope.value,
							        hsv: responseTinycolor.toHslString(),
							        hex: responseTinycolor.toHexString(),
							        hex8: responseTinycolor.toHex8String(),
							        rgb: responseTinycolor.toRgbString(),
                                    percentageRgb: responseTinycolor.toPercentageRgbString()
							    };

								$mdDialog.hide( response );
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
                }).then(function (value)
                {
                    var selectedResult = {
                        value: value
                    }
                    colorHistory.add(new tinycolor(value));

                    result.resolve(selectedResult);
                }, function () { });

                return result.promise;
            }
		};
	}]);

angular.module("mdColorPicker").run(["$templateCache", function($templateCache) {$templateCache.put("mdColorPicker.tpl.html","<div class=\"md-color-picker-input-container\" layout=\"row\">\n	<div class=\"md-color-picker-preview md-color-picker-checkered-bg\" ng-click=\"showColorPicker()\">\n		<div class=\"md-color-picker-result\" ng-style=\"{background: value}\"></div>\n	</div>\n	<md-input-container flex>\n		<label><md-icon ng-if=\"icon\">{{icon}}</md-icon>{{label}}</label>\n		<input type=\"input\" ng-model=\"value\" class=\'md-color-picker-input\'  ng-mousedown=\"openOnInput && showColorPicker($mdOpenMenu, $event)\"/>\n	</md-input-container>\n	<md-button class=\"md-icon-button md-color-picker-clear\" ng-if=\"value\" ng-click=\"clearValue();\" aria-label=\"Clear Color\">\n		<md-icon>clear</md-icon>\n	</md-button>\n</div>\n");
$templateCache.put("mdColorPickerDialog.tpl.html","<div class=\"md-color-picker-container in\" layout=\"column\">\n	<div class=\"md-color-picker-arrow\" ng-style=\"{\'border-bottom-color\': color.toRgbString() }\"></div>\n\n	<div class=\"md-color-picker-preview md-color-picker-checkered-bg\"  ng-class=\"{\'dark\': !color.isDark() || color.getAlpha() < .45}\" flex=\"1\" layout=\"column\">\n\n		<div class=\"md-color-picker-result\" ng-style=\"{\'background\': color.toRgbString()}\" flex=\"100\" layout=\"column\" layout-fill layout-align=\"center center\" ng-click=\"focusPreviewInput( $event )\">\n			<!--<span flex  layout=\"column\" layout-align=\"center center\">{{value}}</span>-->\n			<div flex  layout=\"row\" layout-align=\"center center\">\n				<input class=\"md-color-picker-preview-input\" type=\"text\" ng-model=\"value\" ng-focus=\"previewFocus($event);\" ng-blur=\"previewBlur()\" ng-change=\"changeValue()\" ng-keypress=\"previewKeyDown($event)\" layout-fill />\n			</div>\n			<div class=\"md-color-picker-tabs\" style=\"width: 100%\">\n				<md-tabs md-selected=\"type\" md-stretch-tabs=\"always\" md-no-bar md-no-ink md-no-pagination=\"true\" >\n					<md-tab label=\"Hex\" ng-disabled=\"color.getAlpha() !== 1\" md-ink-ripple=\"#ffffff\"></md-tab>\n					<md-tab label=\"RGB\"></md-tab>\n					<md-tab label=\"HSL\"></md-tab>\n					<!--<md-tab label=\"HSV\"></md-tab>\n					<md-tab label=\"VEC\"></md-tab>-->\n				</md-tabs>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"md-color-picker-tabs md-color-picker-colors\">\n		<md-tabs md-stretch-tabs=\"always\" md-align-tabs=\"bottom\"  md-selected=\"whichPane\" md-no-pagination>\n			<md-tab>\n				<md-tab-label>\n					<md-icon>gradient</md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"row\" layout-align=\"space-between\" style=\"height: 255px\">\n						<div md-color-picker-spectrum></div>\n						<div md-color-picker-hue></div>\n						<div md-color-picker-alpha class=\"md-color-picker-checkered-bg\"></div>\n					</div>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon>tune</md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"column\" flex=\"100\" layout-fill layout-align=\"space-between start center\" class=\"md-color-picker-sliders\">\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">R</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"255\" ng-model=\"color._r\" aria-label=\"red\" class=\"red-slider\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\">\n								<input style=\"width: 100%;\" min=\"0\" max=\"255\" type=\"number\" ng-model=\"color._r\" aria-label=\"red\" aria-controls=\"red-slider\">\n							</div>\n						</div>\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">G</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"255\" ng-model=\"color._g\" aria-label=\"green\" class=\"green-slider\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\">\n								<input style=\"width: 100%;\" min=\"0\" max=\"255\" type=\"number\" ng-model=\"color._g\" aria-label=\"green\" aria-controls=\"green-slider\">\n							</div>\n						</div>\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">B</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"255\" ng-model=\"color._b\" aria-label=\"blue\" class=\"blue-slider\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\" >\n								<input style=\"width: 100%;\" min=\"0\" max=\"255\" type=\"number\" ng-model=\"color._b\" aria-label=\"blue\" aria-controls=\"blue-slider\">\n							</div>\n						</div>\n						<div layout=\"row\" layout-align=\"start center\" layout-wrap flex layout-fill>\n							<div flex=\"10\" layout layout-align=\"center center\">\n								<span class=\"md-body-1\">A</span>\n							</div>\n							<md-slider flex=\"65\" min=\"0\" max=\"1\" step=\".01\" ng-model=\"alpha\" aria-label=\"alpha\" class=\"md-primary\"></md-slider>\n							<span flex></span>\n							<div flex=\"20\" layout layout-align=\"center center\" >\n								<input style=\"width: 100%;\" min=\"0\" max=\"1\" step=\".01\" type=\"number\" ng-model=\"alpha\" aria-label=\"alpha\" aria-controls=\"blue-slider\">\n							</div>\n						</div>\n					</div>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon>view_comfy</md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"column\" layout-align=\"space-between start center\" flex>\n						<div ng-repeat=\"row in palette track by $index\" flex=\"15\"  layout-align=\"space-between\" layout=\"row\"  layout-fill>\n							<div ng-repeat=\"col in row track by $index\" flex=\"10\" style=\"height: 25.5px;\" ng-style=\"{\'background\': col};\" ng-click=\"setPaletteColor($event)\"></div>\n						</div>\n					</div>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon>line_weight</md-icon>\n				</md-tab-label>\n				<md-tab-body>\n					<div layout=\"column\" layout-fill flex class=\"md-color-picker-material\">\n						<div ng-repeat=\"(key, value) in material.colors2\">\n							<div ng-repeat=\"row in value track by $index\" ng-style=\"{\'background\': row, height: $index ? \'33px\':\'75px\'}\" ng-class=\"{\'md-color-picker-with-label\': $index !== 0, \'md-color-picker-material-title\': $index === 0, \'dark\': isDark( row )}\" ng-click=\"setPaletteColor($event)\">\n								<span ng-if=\"$index === 0\">{{key}}</span>\n								<span ng-if=\"$index !== 0\">{{material.labels[$index]}}</span>\n							</div>\n						</div>\n					</div>\n					<script>\n					/*\n					<div layout=\"row\" layout-align=\"space-between start center\"  layout-fill layout-wrap flex class=\"md-color-picker-material\">\n						<!--<div flex=\"25\"  layout-align=\"space-between\" layout=\"row\"  layout-fill>\n							<div ng-repeat=\"col in row track by $index\" flex=\"10\" style=\"height: 25.5px;\" ng-style=\"{\'background\': col};\" ng-click=\"setPaletteColor($event)\"></div>-->\n							<div ng-repeat=\"col in material.colors track by $index\" layout-column flex=\"33\">\n								<div ng-repeat=\"(name, row) in col track by $index\" layout-row style=\"height: 31px;\" ng-style=\"{\'background\': row[0]};\" ng-click=\"setMaterialColor($event, row)\" class=\"md-color-picker-with-label\">{{name}}</div>\n							</div>\n							<div layout-column flex=\"33\">\n								<div ng-repeat=\"(name, row) in material.greys track by $index\" layout-row style=\"height: 31px;\" ng-style=\"{\'background\': row[0]};\" ng-click=\"setMaterialColor($event, row)\" class=\"md-color-picker-with-label\">{{name}}</div>\n							</div>\n						<!--</div>-->\n					</div>\n					*/</script>\n				</md-tab-body>\n			</md-tab>\n			<md-tab>\n				<md-tab-label>\n					<md-icon>history</md-icon>\n				</md-tab-label>\n				<md-tab-body layout=\"row\" layout-fill>\n					<div layout=\"column\" flex layout-align=\"space-between start\" layout-wrap layout-fill class=\"md-color-picker-history\">\n						<div layout=\"row\" flex=\"80\" layout-align=\"space-between start start\" layout-wrap  layout-fill>\n							<div flex=\"10\" ng-repeat=\"historyColor in history.get() track by $index\">\n								<div  ng-style=\"{\'background\': historyColor.toRgbString()}\" ng-click=\"setPaletteColor($event)\"></div>\n							</div>\n						</div>\n\n\n						<md-button flex-end ng-click=\"history.reset()\" class=\"md-mini\">\n							<md-icon>delete</md-icon>\n							Clear history\n						</md-button>\n					</div>\n				</md-tab-body>\n			</md-tab>\n		</md-tabs>\n	</div>\n</div>\n");}]);
})(angular, window, tinycolor);