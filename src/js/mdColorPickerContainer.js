angular.module('mdColorPicker')
	.directive( 'mdColorPickerContainer', ['$compile','$timeout','$mdColorPickerConfig', '$mdColorPickerHistory', function( $compile, $timeout, $mdColorPickerConfig, $mdColorPickerHistory ) {
		return {
			templateUrl: 'mdColorPickerContainer.tpl.html',
			require: ['^ngModel'],
			scope: {
				value: '=ngModel',
				// default: '@?',
				// random: '=?',
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
				var previewInput = angular.element( $element[0].querySelector('.md-color-picker-preview-input') );
				
				
				///////////////////////////////////
				// Variables
				///////////////////////////////////
				$scope.data = {
					color: new TinyColor($scope.value), // Set the initial color.
					history: $mdColorPickerHistory
				};
				$scope.config = {
					notations: $mdColorPickerConfig.notations,
					currentNotation: $mdColorPickerConfig.notations.select( $scope.value ),
					selectedNotation: undefined,
					defaultTab: undefined,
					currentTab: undefined
				};
				$scope.config.selectedNotation = $scope.config.currentNotation.index;
				$scope.inputFocus = false;
				
				
				var defaultTab = $mdColorPickerConfig.tabs.order.indexOf( $scope.mdColorDefaultTab || $mdColorPickerConfig.defaults.mdColorPicker.defaultTab );
				if ( defaultTab != -1 ) {
					$scope.config.defaultTab = defaultTab;
				} else {
					$scope.config.defaultTab = 0;
				}
				
				$scope.config.currentTab = $scope.config.defaultTab;
				
				
				
				
				
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
					// console.log( 'preview un focus');
					$scope.inputFocus = false;
					previewInput[0].blur();
				};
				$scope.previewBlur = function() {
					// console.log( 'preview blur');
					$scope.inputFocus = false;
					// $scope.setValue( $scope.value );
				};
				$scope.previewKeyDown = function( $event ) {
					
					if ( $event.keyCode == 13 && $scope.ok ) {
						$scope.ok();
					}
				};
				$scope.setValue = function setValue( value ) {
					// console.warn( 'SET VALUE.........', $scope.value, value, $scope.data.color );
					// console.trace();
					
					$ngModelController.$setViewValue( $scope.config.currentNotation.toString( value ) );
					$ngModelController.$commitViewValue();
				};
				$scope.updateValue = function updateValue( value ) {
					$scope.data.color = $scope.config.currentNotation.toTinyColorObject( value );
					$scope.data.hue = $scope.data.color.toHsl().h;
					setNotation( $scope.data.color, false );
				};
				$scope.setNgModelController = function( ngModel ) {
					$ngModelController = ngModel;
					$scope.setValue( $scope.data.color, true );
					
				};
				
				
				
				
				///////////////////////////////////
				// Watches and Events
				///////////////////////////////////
				function setNotation( value, setValue ) {
					setValue = setValue !== undefined ? setValue : true;
					
					$scope.config.currentNotation = $mdColorPickerConfig.notations.get( $scope.config.selectedNotation );
					console.log( "Set Notation", value, setValue );
					if ( setValue ) {
						$scope.setValue( value );
					}
				}
				$scope.$watch( 'config.selectedNotation', function() {
					// TODO: set this up using $ngAnimate service
					previewInput.removeClass('switch');
					$timeout(function() {
						previewInput.addClass('switch');
					});
					setNotation( $scope.data.color );
				});
				
				
				// Watch for our changes
				$scope.$watch( 'data.color', function( value, oldValue ) {
					if ( value.toHex8String() !== oldValue.toHex8String() && !$scope.inputFocus ) {
						console.warn("COLOR CHANGE", $scope.inputFocus, value.toHex8String(), oldValue.toHex8String() );
						value.setAlpha( value._a );
						setNotation( value );
					}
				}, true);
				
				// Watch for their changes
				$scope.$watch( function() {
					return $ngModelController.$modelValue;
				}, $scope.updateValue );
				
				
				
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
				},100);
				
				
				console.timeEnd('1. Open Color Picker');
				
			},
			link: function( scope, element, attrs, controllers ) {
				console.time('2. Add Color Picker');
				var $ngModelController = controllers[0];
				scope.setNgModelController( $ngModelController );
				
				// console.log( 'START VALUE', scope );
				
				var tabContainer = element[0].querySelector( '.md-color-picker-colors' );
				var tabsElement = angular.element( tabContainer.querySelector('md-tabs') );
				
				scope.config.tabs = $mdColorPickerConfig.tabs.get();
				scope.config.tabKeys = Object.keys( scope.config.tabs );
				scope.config.tabOrder = $mdColorPickerConfig.tabs.order;
				
				
				$timeout( function() {
					scope.$watch( function () {
						return $mdColorPickerConfig.tabs.order;
					}, function ( newVal, oldVal ) {
						// Update tabs
						var compiledTabs = tabsElement.find( 'md-tabs-content-wrapper' )
							.find( 'md-tab-content' );
						$timeout( function () {
							// Get the tab DOM elements so we can append them
							
							var diff = oldVal.filter( function ( i ) {
								return newVal.indexOf( i ) < 0;
							} )
							
							renderTab( newVal[ scope.config.currentTab ], scope.config.currentTab, compiledTabs );
							
							// Loop through each tab
							$timeout( function () {
								angular.forEach( newVal, function ( tabName, x ) {
									if ( x !== scope.config.currentTab ) {
										renderTab( tabName, x, compiledTabs );
									}
								}, this );
							}, 1000 );
							angular.forEach( diff, function ( tab, i ) {
								scope.config.tabs[ tab ].$destroy();
							} );
							
							
						}, false );
					}, true );
					
				});
				
				
				
				
				function renderTab ( tabName, x, compiledTabs ) {
					// If this is a new tab we need to add it.
					if ( scope.config.tabKeys.indexOf( tabName ) === -1 ) {
						scope.config.tabs[ tabName ] = $mdColorPickerConfig.tabs.get( tabName );
						scope.config.tabKeys.push( tabName );
					}
					// If the tab does not have an $element, we need to create it and append it to the DOM
					if ( !scope.config.tabs[ tabName ].$element && compiledTabs[x] ) {
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
				}
				
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
