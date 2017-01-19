angular.module('mdColorPicker')
	.directive( 'mdColorPickerContainer', ['$compile','$timeout','$mdColorPickerConfig', '$mdColorPickerHistory', function( $compile, $timeout, $mdColorPickerConfig, $mdColorPickerHistory ) {
		return {
			templateUrl: 'mdColorPickerContainer.tpl.html',
			require: ['^ngModel'],
			scope: {
				value: '=ngModel',
				default: '@',
				random: '=',
				// ok: '=?',
				// mdColorAlphaChannel: '=',
				// mdColorSpectrum: '=',
				// mdColorSliders: '=',
				// mdColorGenericPalette: '=',
				// mdColorMaterialPalette: '=',
				// mdColorHistory: '=',
				// mdColorHex: '=',
				// mdColorRgb: '=',
				// mdColorHsl: '=',
				// mdColorDefaultTab: '='
			},
			controller: function( $scope, $element, $attrs ) {

				// Allow link functions to pass in ngModelController to be used here.
				var $ngModelController;
				$scope.setNgModelController = function( ngModel ) {
					$ngModelController = ngModel;
				};
				///////////////////////////////////
				// Variables
				///////////////////////////////////
				$scope.data = {
					color: undefined
				};
				$scope.config = {
					options: {
						displayAlpha: true//$mdColorPickerConfig.useAlpha
					}
				};

				var container = angular.element( $element[0].querySelector('.md-color-picker-container') );
				var resultSpan = angular.element( container[0].querySelector('.md-color-picker-result') );
				var previewInput = angular.element( $element[0].querySelector('.md-color-picker-preview-input') );

				// Set up the opening color
				console.log( "ASSIGNING OPENING COLOR ",  $scope.random, $mdColorPickerConfig.defaults.mdColorPicker.default, $mdColorPickerConfig.defaults.mdColorPicker.random,  $scope.random || ( !$mdColorPickerConfig.defaults.mdColorPicker.default && $mdColorPickerConfig.defaults.mdColorPicker.random ));
				if ( !$scope.default ) {
					if ( $scope.random || ( !$mdColorPickerConfig.defaults.mdColorPicker.default && $mdColorPickerConfig.defaults.mdColorPicker.random ) ) {
						console.log( "RANDOM COLOR");
						$scope.default = TinyColor.random().toHexString();
					} else if ( $mdColorPickerConfig.defaults.mdColorPicker.default ) {
						console.log( "CONFIG DEFAULT COLOR");
						$scope.default = $mdColorPickerConfig.defaults.mdColorPicker.default;
					} else {
						console.log( "WHITE");
						$scope.default = '#ffffff';
					}
				}
				// $scope.default = $scope.default ? $scope.default : $scope.random ? TinyColor.random().toHexString() : 'rgb(255,255,255)';
				//$scope.default = $scope.value || $scope.default;
				$scope.value = $scope.value || $scope.default;

				$scope.data.history = $mdColorPickerHistory;
				$scope.config.notations = $mdColorPickerConfig.notations;
				$scope.config.currentNotation = $mdColorPickerConfig.notations.select( $scope.value );
				$scope.config.selectedNotation = $scope.config.currentNotation.index;

				$scope.data.color = new TinyColor($scope.value); // Set initial color

			//	$scope.config.tabs = $mdColorPickerConfig.tabs;
				if ( $scope.mdColorDefaultTab ) {
					var defaultTab = $mdColorPickerConfig.tabs.order.indexOf( $scope.mdColorDefaultTab );
					if ( defaultTab != -1 ) {
						$scope.config.defaultTab = defaultTab;
					} else {
						$scope.config.defaultTab = $mdColorPickerConfig.defaultTab || 0;
					}
				} else {
					$scope.config.defaultTab = $mdColorPickerConfig.defaultTab || 0;
				}
				$scope.config.currentTab = $scope.config.defaultTab;

				// $scope.config.options.displayAlpha;

				$scope.inputFocus = false;

				///////////////////////////////////
				// Functions
				///////////////////////////////////

				$scope.isDark = function isDark( color ) {
					if ( angular.isArray( color ) ) {
						return TinyColor( {r: color[0], g: color[1], b: color[2] }).isDark();
					} else {
						return TinyColor( color ).isDark();
					}

				};
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
					$scope.setValue( $scope.value );
				};
				$scope.previewKeyDown = function( $event ) {

					if ( $event.keyCode == 13 && $scope.ok ) {
						$scope.ok();
					}
				};

				$scope.setValue = function setValue( value ) {
					$scope.value = $scope.config.currentNotation.toString( value );
					$ngModelController.$setViewValue( $scope.config.currentNotation.toString( value ) );
					$ngModelController.$commitViewValue();
				};

				$scope.updateValue = function updateValue( value ) {
					$scope.data.color = new TinyColor( value );
					$scope.data.hue = $scope.data.color.toHsl().h;
					setNotation( $scope.data.color );
				};


				///////////////////////////////////
				// Watches and Events
				///////////////////////////////////
				function setNotation( value ) {
					$scope.config.currentNotation = $mdColorPickerConfig.notations.get( $scope.config.selectedNotation );
					$scope.setValue( value );
				}
				$scope.$watch( 'config.selectedNotation', function() {
					// TODO: set this up using $ngAnimate service
					previewInput.removeClass('switch');
					$timeout(function() {
						previewInput.addClass('switch');
					});
					setNotation( $scope.data.color );
				});
				//
				// $scope.$watch('data.color', function( newValue ) {
				// 	console.log( 'Color Change', newValue );
				// 	if ( !$scope.inputFocus ) {
				// 		setNotation();
				// 	}
				//
				// }, true);

				// $ngModel.$formatters.push( viewFormatter );
				// $ngModel.$parsers.push( viewParser );
				// $scope.$watch( function() { return $ngModelController.$viewValue; }, function( value ) {
				// 	console.log( "NEW ngModel VALUE: ", $ngModelController.$viewValue );
				// 	//$element[0].value = viewParser( $ngModelController.$viewValue );
				// 	// console.log( "NEW ngModel VALUE: ", $element.val() );
				// 	//$scope.data.color = new TinyColor( value );
				// 	setNotation( value )
				// });

				// Watch for our changes
				$scope.$watch( 'data.color', function( value ) {
					if ( !$scope.inputFocus ) {
						setNotation( value );
					}
				});

				// Watch for their changes
				$scope.$watch( function() {
					return $ngModelController.$modelValue;
				}, function( value ) {
					$scope.updateValue( value );
					setNotation( $scope.data.color );
				});

				$scope.$watch( 'value', $scope.updateValue );


				///////////////////////////////////
				// INIT
				// Let all the other directives initialize
				///////////////////////////////////

				// http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
				function is_touch_device() {
					return 'ontouchstart' in window        // works on most browsers
					|| navigator.maxTouchPoints;       // works on IE10/11 and Surface
				}

				$timeout( function() {
					if ( !is_touch_device() ) {
						previewInput.focus();
						$scope.previewFocus();
					}
				});
			},
			link: function( scope, element, attrs, controllers ) {
				var $ngModelController = controllers[0];
				scope.setNgModelController( $ngModelController );


				var tabContainer = element[0].querySelector( '.md-color-picker-colors' );
				var tabsElement = angular.element( tabContainer.querySelector('md-tabs') );
				tabContainer = angular.element( tabContainer );

				scope.config.tabs = $mdColorPickerConfig.tabs.get();
				scope.config.tabKeys = Object.keys( scope.config.tabs );
				scope.config.tabOrder = $mdColorPickerConfig.tabs.order;




				scope.$watch( function() { return $mdColorPickerConfig.tabs.order; }, function( newVal, oldVal ) {
					// Update tabs

					$timeout(function() {
						// Get the tab DOM elements so we can append them
						var compiledTabs = tabsElement.find('md-tabs-content-wrapper').find('md-tab-content');
						var x = 0;
						var diff = oldVal.filter(function(i) {return newVal.indexOf(i) < 0;})
						console.log( "ORDER DIFF", diff );

						// Loop through each tab
						angular.forEach( newVal, function( tabName ) {
							// If this is a new tab we need to add it.
							if ( scope.config.tabKeys.indexOf( tabName ) === -1 ) {
								scope.config.tabs[ tabName ] = $mdColorPickerConfig.tabs.get( tabName );
								scope.config.tabKeys.push( tabName );
							}
							// If the tab does not have an $element, we need to create it and append it to the DOM
							if ( !scope.config.tabs[tabName].$element && compiledTabs[x] ) {
								var $element = angular.element( compiledTabs[x].querySelector('div[md-tabs-template] > div[layout="row"]') );
								scope.config.tabs[ tabName ].$element = $element;

								// Get the tab template and $compile it
								scope.config.tabs[ tabName ].getTemplate().then( function( data ) {
									var theTab = data.tab;
									var tpl = data.tpl;
									if ( tpl != '' ) {
										var compiledTemplate = $compile( tpl )( scope );
										theTab.$element.append( compiledTemplate );
									}
									// Run the Link function if available
									if ( typeof( theTab.link ) === 'function' ) {
										theTab.link( scope, theTab.$element );
									}
								});

							}
							x++;
						}, this );

						angular.forEach( diff, function( tab, i ) {
							scope.config.tabs[tab].$destroy();
						});


					}, false);
				}, true);

				scope.$on('$destroy', function() {
					scope.default = undefined;
					scope.data.color = undefined;
					scope.value = undefined;
					angular.forEach( scope.config.tabs, function( tab, i ) {
						tab.$destroy();
					});
				});
			}
		};
	}]);
