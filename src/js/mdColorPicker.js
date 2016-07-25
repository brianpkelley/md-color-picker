
(function( window, angular, tinycolor, undefined ) {
'use strict';

var dateClick;










angular.module('mdColorPicker', ['mdColorPickerConfig','mdColorPickerHistory','mdColorPickerGradientCanvas'])
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
			'clear_all': '<path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/>',
			'wheel': '	<path d="M11.7,11.3L11.2,2C9,2.2,7.1,3.1,5.6,4.4L11.7,11.3z"/><path d="M11.3,12.3L2,12.8c0.2,2.1,1,4.1,2.3,5.6L11.3,12.3z"/><path d="M12.8,2l-0.6,9.2l6.1-6.9C16.9,3.1,15,2.2,12.8,2z"/><path d="M11.3,11.7L4.4,5.6C3.1,7.1,2.2,9,2,11.2L11.3,11.7z"/><path d="M12.7,12.3l6.9,6.1c1.3-1.5,2.1-3.5,2.3-5.6L12.7,12.3z"/><path d="M12.7,11.7l9.2-0.6c-0.2-2.1-1-4.1-2.3-5.6L12.7,11.7z"/><path d="M12.3,12.7l0.6,9.2c2.1-0.2,4.1-1,5.6-2.3L12.3,12.7z"/><path d="M11.7,12.7l-6.1,6.9c1.5,1.3,3.5,2.1,5.6,2.3L11.7,12.7z"/>'
		};
		for (var i in shapes) {
			if (shapes.hasOwnProperty(i)) {
				$templateCache.put([i, 'svg'].join('.'),
					['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">', shapes[i], '</svg>'].join(''));
			}
		}
	}])
	.config( ['$mdColorPickerConfigProvider', function( $mdColorPickerConfigProvider ) {

	}])
	.directive('mdColorPickerPreview', function() {
		return {
			template: '<div class="md-color-picker-preview md-color-picker-checkered-bg" ng-click="showColorPicker($event)"><div class="md-color-picker-result" ng-style="{background: preview.value}"></div></div>',
			require: '^ngModel',
		//	scope: {},
			link: function( $scope, $element, $attrs, $ngModel ) {
				$scope.preview = {
					value: ''
				};

				// Keep an eye on changes
				$scope.$watch(function() {
					return $ngModel.$modelValue;
				},function(newVal) {
					$scope.preview.value = $ngModel.$viewValue;
				});
			}
		};
	})
/*	.directive('mdColorPicker', [ '$timeout', '$mdColorPickerConfig', '$mdColorPickerHistory', function( $timeout, $mdColorPickerConfig, $mdColorPickerHistory ) {

		return {
			//templateUrl: "mdColorPicker.tpl.html",
			transclude: true,
			// Added required controller ngModel
			require: '^ngModel',
			scope: {
				options: '=mdColorPicker',

				// Input options
				notation: '@',
				random: '@?',
				default: '@?',

				// Dialog Options
				openOnInput: '=?',
				hasBackdrop: '=?',
				clickOutsideToClose: '=?',
				skipHide: '=?',
				preserveScope: '=?',

				// Advanced options
				mdColorClearButton: '=?',
				mdColorPreview: '=?',

				mdColorAlphaChannel: '=?',
				mdColorDefaultTab: '=?'
			},
			controller: ['$scope', '$element', '$attrs', '$mdColorPickerDialog', '$mdColorPickerPanel', function( $scope, $element, $attrs, $mdColorPickerDialog, $mdColorPickerPanel ) {
				var didJustClose = false;

				// Merge Options Object with scope.  Scope will take precedence much like css vs style attribute.
				if ( $scope.options !== undefined ) {
					for ( var opt in $scope.options ) {
						if ( $scope.options.hasOwnProperty( opt ) ) {
							var scopeKey;
							//if ( $scope.hasOwnProperty( opt ) ) { // Removing this because optional scope properties are not added to the scope.
								scopeKey = opt;
							//} else
							if ( $scope.hasOwnProperty( 'mdColor' + opt.slice(0,1).toUpperCase() + opt.slice(1) ) ) {
								scopeKey = 'mdColor' + opt.slice(0,1).toUpperCase() + opt.slice(1);
							}
							if ( scopeKey && ( $scope[scopeKey] === undefined || $scope[scopeKey] === '' ) ) {
								$scope[scopeKey] = $scope.options[opt];
							}
						}
					}
				}


				// Quick function for updating the local 'value' on scope
				var updateValue = function(val) {
					console.log("updateValue", val || ngModel.$viewValue || '');
					$scope.data.value = val || ngModel.$viewValue || '';
					return $scope.data.value;
				};

				// Defaults
				// Everything is enabled by default.
				$scope.mdColorClearButton = $scope.mdColorClearButton === undefined ? true : $scope.mdColorClearButton;
				$scope.mdColorPreview = $scope.mdColorPreview === undefined ? true : $scope.mdColorPreview;
				$scope.mdColorAlphaChannel = $scope.mdColorAlphaChannel === undefined ? true : $scope.mdColorAlphaChannel;

				$scope.openOnInput = $scope.openOnInput === undefined ? true : $scope.openOnInput;

				// Set the starting value
				var INITIAL_VALUE = updateValue();

				// Keep an eye on changes
				$scope.$watch(function() {
					return ngModel.$modelValue;
				},function(newVal) {
					updateValue(newVal);
				});

				// Watch for updates to value and set them on the model
				$scope.$watch('data.value',function(newVal,oldVal) {
					console.info( "VALUE CHANGE", newVal, ' ', oldVal );
					console.trace();

					if ( typeof newVal !== 'undefined' && newVal !== oldVal) {
						ngModel.$setViewValue(newVal);
					}
				});

				// The only other ngModel changes

				$scope.clearValue = function clearValue() {
					ngModel.$setViewValue('');
					INITIAL_VALUE = '';
				};


				var dialogOptions = {
					defaultValue: $scope.default,
					random: $scope.random,
					clickOutsideToClose: $scope.clickOutsideToClose,
					hasBackdrop: $scope.hasBackdrop,
					skipHide: $scope.skipHide,
					preserveScope: $scope.preserveScope,


					mdColorAlphaChannel: $scope.mdColorAlphaChannel,
					mdColorDefaultTab: $scope.mdColorDefaultTab,



				};



				$scope.showColorPicker = function showColorPicker($event) {
					console.log("CLICK");
					if ( didJustClose ) {
						return;
					}
				//	dateClick = Date.now();
				//	console.log( "CLICK OPEN", dateClick, $scope );
					dialogOptions.$event = $event;
					dialogOptions.value = $scope.data.value;

					var colorPicker = $mdColorPickerPanel.show( dialogOptions );
					//var colorPicker = $mdColorPickerDialog.show( dialogOptions );


					var removeWatch = $scope.$watch( function() { return dialogOptions.value; }, function( newVal ) {
						console.log('Color Updated dialog watch');
						$scope.data.value = newVal;
					});

					colorPicker.then(function( color ) {
						removeWatch();
						INITIAL_VALUE = $scope.data.value = color;
						$mdColorPickerHistory.add( color );

					}, function() {
						removeWatch();
						console.log('Color Updated by rejection', INITIAL_VALUE);
						$scope.data.value = INITIAL_VALUE;
					});


				};
			}],
			compile: function( element, attrs ) {

				//attrs.value = attrs.value || "#ff0000";
				attrs.currentNotation = attrs.currentNotation !== undefined ? attrs.currentNotation : $mdColorPickerConfig.notations.get(0);
			}
		};
	}])
	*/
	.directive( 'mdColorPicker', ['$mdColorPickerConfig', '$mdColorPickerHistory', '$mdColorPickerDialog', '$mdColorPickerPanel', function( $mdColorPickerConfig, $mdColorPickerHistory, $mdColorPickerDialog, $mdColorPickerPanel ) {
		return {
			require: '^ngModel',
			scope: {
				options: '=mdColorPicker',
				ngModel: '=ngModel',
				// Input options
				notation: '@',
				random: '@?',
				default: '@?',

				// Dialog Options
				openOnInput: '=?',
				hasBackdrop: '=?',
				clickOutsideToClose: '=?',
				skipHide: '=?',
				preserveScope: '=?',

				// Advanced options
				mdColorClearButton: '=?',
				mdColorPreview: '=?',

				mdColorAlphaChannel: '=?',
				mdColorDefaultTab: '=?'
			},
			link: function( $scope, $element, $attrs, $ngModel ) {
				console.log( "ELEMENT", $element );

				var isInputElement = $element.prop('tagName') === 'INPUT';
				var INITIAL_VALUE = undefined;

				$scope.data = {};

				/*
				 * Model / Value Changes
				 */


				// Quick function for updating the local 'value' on scope
				var updateValue = function(val) {
					$scope.data.value = val || $ngModel.$viewValue || '';
				//	INITIAL_VALUE = $scope.data.value;
					return $scope.data.value;
				};

				// Set the starting value
				INITIAL_VALUE = updateValue();

				// Keep an eye on changes
				$scope.$watch(function() {
					return $ngModel.$modelValue;
				},function(newVal) {
					updateValue(newVal);
				});

				// console.log( 'IDDDD DDRDFG ', isInputElement, $element.prop('type').toLowerCase() );
				function viewParser( value ) {
					var formatted = new tinycolor( value ).toHexString();
					console.log( "parsing ", $element.prop('tagName'), value, formatted );
					return formatted;
				}
				if ( isInputElement && $element.prop('type').toLowerCase() === 'color' ) {
					console.log("Adding formatter");
					$ngModel.$formatters.push(function( value ) {
						var formatted = new tinycolor( value ).toHexString();
						console.log( "formatting ", value, formatted );
						return formatted;
					});

					$ngModel.$parsers.push( viewParser );
				}

				// Watch for updates to value and set them on the model
				$scope.$watch('data.value',function(newVal,oldVal) {
					if ( typeof newVal !== 'undefined' && newVal !== oldVal) {
						$ngModel.$setViewValue(newVal);
						isInputElement && $element.val( viewParser( $scope.data.value ) );
					}
				});

				//

				var showColorPicker = function showColorPicker($event) {
					INITIAL_VALUE = $scope.data.value;

					var dialogOptions = {
						value: $scope.data.value,
						defaultValue: $scope.default,
						random: $scope.random,
						clickOutsideToClose: $scope.clickOutsideToClose,
						hasBackdrop: $scope.hasBackdrop,
						skipHide: $scope.skipHide,
						preserveScope: $scope.preserveScope,
						$event: $event,


						mdColorAlphaChannel: true, //$scope.mdColorAlphaChannel,
						mdColorDefaultTab: $scope.mdColorDefaultTab,



					};


					//var colorPicker = $mdColorPickerPanel.show( dialogOptions );
					var colorPicker = $mdColorPickerDialog.show( dialogOptions );


					var removeWatch = $scope.$watch( function() { return dialogOptions.value; }, function( newVal ) {
						$scope.data.value = newVal;
						isInputElement && $element.val( $scope.data.value );
					});

					colorPicker.then(function( color ) {
						removeWatch();
						INITIAL_VALUE = $scope.data.value = color;
						$mdColorPickerHistory.add( color );

					}, function() {
						removeWatch();
						$scope.data.value = INITIAL_VALUE;
					});


				};

				$element.on('mousedown', showColorPicker );
			},

		};
	}		])
	.directive( 'mdColorPickerContainer', ['$compile','$timeout','$mdColorPickerConfig', '$mdColorPickerHistory', function( $compile, $timeout, $mdColorPickerConfig, $mdColorPickerHistory ) {
		return {
			templateUrl: 'mdColorPickerContainer.tpl.html',
			scope: {
				value: '=?',
				default: '@',
				random: '@',
				ok: '=?',
				mdColorAlphaChannel: '=',
				mdColorSpectrum: '=',
				mdColorSliders: '=',
				mdColorGenericPalette: '=',
				mdColorMaterialPalette: '=',
				mdColorHistory: '=',
				mdColorHex: '=',
				mdColorRgb: '=',
				mdColorHsl: '=',
				mdColorDefaultTab: '='
			},
			controller: function( $scope, $element, $attrs ) {
			//	console.log( "mdColorPickerContainer Controller", Date.now() - dateClick, $scope );


				///////////////////////////////////
				// Variables
				///////////////////////////////////
				$scope.data = {};
				$scope.config = {
					options: {
						displayAlpha: $mdColorPickerConfig.useAlpha
					}
				};

				var container = angular.element( $element[0].querySelector('.md-color-picker-container') );
				var resultSpan = angular.element( container[0].querySelector('.md-color-picker-result') );
				var previewInput = angular.element( $element[0].querySelector('.md-color-picker-preview-input') );

				$scope.default = $scope.default ? $scope.default : $scope.random ? tinycolor.random().toHexString() : 'rgb(255,255,255)';
				$scope.default = $scope.value || $scope.default;


				$scope.data.history = $mdColorPickerHistory;
				$scope.config.notations = $mdColorPickerConfig.notations;
				$scope.config.currentNotation = $mdColorPickerConfig.notations.select( $scope.default );
				$scope.config.selectedNotation = $scope.config.currentNotation.index;

				$scope.data.color = new tinycolor($scope.default); // Set initial color

				$scope.config.tabs = $mdColorPickerConfig.tabs;

//				$scope.config.options.displayAlpha;

				$scope.inputFocus = false;

				///////////////////////////////////
				// Functions
				///////////////////////////////////

				$scope.isDark = function isDark( color ) {
					if ( angular.isArray( color ) ) {
						return tinycolor( {r: color[0], g: color[1], b: color[2] }).isDark();
					} else {
						return tinycolor( color ).isDark();
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
					$scope.setValue();
				};
				$scope.previewKeyDown = function( $event ) {

					if ( $event.keyCode == 13 && $scope.ok ) {
						$scope.ok();
					}
				};

				$scope.setValue = function setValue() {
					console.log( "SET VALUE", $scope.data.color, $scope.config.currentNotation,  $scope.config.currentNotation.toString( $scope.data.color ) );
					console.trace();
					$scope.value = $scope.config.currentNotation.toString( $scope.data.color );
				};

				$scope.changeValue = function changeValue() {
					$scope.data.color = tinycolor( $scope.value );
				};


				///////////////////////////////////
				// Watches and Events
				///////////////////////////////////
				function setNotation() {
					$scope.config.currentNotation = $mdColorPickerConfig.notations.get( $scope.config.selectedNotation );
					$scope.setValue();
				}
				$scope.$watch( 'config.selectedNotation', function() {
					previewInput.removeClass('switch');
					$timeout(function() {
						previewInput.addClass('switch');
					});
					setNotation();
				});

				$scope.$watch('data.color', function( newValue ) {
					console.log( 'Color Change', newValue );
					if ( !$scope.inputFocus ) {
						setNotation();
					}
				}, true);


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
			link: function( scope, element, attrs ) {




				var tabContainer = element[0].querySelector( '.md-color-picker-colors' );
				var tabsElement = angular.element( tabContainer.querySelector('md-tabs') );
				tabContainer = angular.element( tabContainer );



				scope.$watch( 'config.tabs.order', function( newVal ) {
					console.log("TAB CHANGE", newVal );

					$timeout(function() {
						var compiledTabs = tabsElement.find('md-tabs-content-wrapper').find('md-tab-content');
						var tabs = scope.config.tabs.get();
						var x = 0;
						angular.forEach( tabs, function( tab, i ) {
							console.log("Draw Tabs: " + tab.name, tab.$element );
							if ( !tab.$element ) {

								var $element = angular.element( compiledTabs[x].querySelectorAll('div[md-tabs-template] > div[layout="row"]') );
								tab.$element = $element;

								tab.getTemplate().then( function( data ) {
									var tab = data.tab;
									var tpl = data.tpl;
									if ( tpl != '' ) {
										var compiledTemplate = $compile( tpl )( scope );
										tab.$element.append( compiledTemplate );
									}
									if ( typeof( tab.link ) === 'function' ) {
										tab.link( scope, tab.$element );
									}
								});
							}
							x++;

						}, this );

					});
				}, true);

				console.log( scope );
				scope.$on('$destroy', function() {
					scope.default = undefined;
					scope.data.color = undefined;
					scope.value = undefined;
					var tabs = scope.config.tabs.get();
					angular.forEach( tabs, function( tab, i ) {
						console.log( 'Destroying ' + tab.name, tab.$element );
						tab.$element.remove();
						tab.$element = undefined;
					});
				});
			}
		};
	}])

	.factory('$mdColorPickerDialog', ['$q', '$mdDialog', '$mdColorPickerHistory', function ($q, $mdDialog, $mdColorPickerHistory) {
		var dialog;

        return {
            show: function (options)
            {
                if ( options === undefined ) {
                    options = {};
                }
				//console.log( 'DIALOG OPTIONS', options );
				// Defaults
				// Dialog Properties
                options.hasBackdrop = options.hasBackdrop === undefined ? true : options.hasBackdrop;
				options.clickOutsideToClose = options.clickOutsideToClose === undefined ? true : options.clickOutsideToClose;
				options.defaultValue = options.defaultValue === undefined ? '#FFFFFF' : options.defaultValue;
				options.focusOnOpen = options.focusOnOpen === undefined ? false : options.focusOnOpen;
				options.preserveScope = options.preserveScope === undefined ? true : options.preserveScope;
				options.skipHide = options.skipHide === undefined ? true : options.skipHide;


				// mdColorPicker Properties
				options.mdColorAlphaChannel = options.mdColorAlphaChannel === undefined ? false : options.mdColorAlphaChannel;
				options.mdColorSpectrum = options.mdColorSpectrum === undefined ? true : options.mdColorSpectrum;
				options.mdColorSliders = options.mdColorSliders === undefined ? true : options.mdColorSliders;
				options.mdColorGenericPalette = options.mdColorGenericPalette === undefined ? true : options.mdColorGenericPalette;
				options.mdColorMaterialPalette = options.mdColorMaterialPalette === undefined ? true : options.mdColorMaterialPalette;
				options.mdColorHistory = options.mdColorHistory === undefined ? true : options.mdColorHistory;
				options.mdColorRgb = options.mdColorRgb === undefined ? true : options.mdColorRgb;
				options.mdColorHsl = options.mdColorHsl === undefined ? true : options.mdColorHsl;
				options.mdColorHex = ((options.mdColorHex === undefined) || (!options.mdColorRgb && !options.mdColorHsl))  ? true : options.mdColorHex;
				options.mdColorAlphaChannel = (!options.mdColorRgb && !options.mdColorHsl) ? false : options.mdColorAlphaChannel;



                dialog = $mdDialog.show({
					templateUrl: 'mdColorPickerDialog.tpl.html',
					hasBackdrop: options.hasBackdrop,
					clickOutsideToClose: options.clickOutsideToClose,

					controller: ['$scope', 'opts', function( $scope, opts ) {
							//console.log( "DIALOG CONTROLLER OPEN", Date.now() - dateClick );
							$scope.close = function close()
                            {
								$mdDialog.cancel();
							};
							$scope.ok = function ok()
							{
								$mdDialog.hide( $scope.value );
							};
							$scope.hide = $scope.ok;



							$scope.value = opts.value;
							$scope.default = opts.defaultValue;
							$scope.random = opts.random;

							$scope.mdColorAlphaChannel = opts.mdColorAlphaChannel;
							$scope.mdColorDefaultTab = opts.mdColorDefaultTab;

							$scope.$watch( 'value', function( newVal ) {
								console.log('dialog value: ', newVal, options.value );
								options.value = newVal;
								console.log('dialog value: ', newVal, options.value );
							});

					}],

					locals: {
						opts: options,
					},
				//	preserveScope: options.preserveScope,
  					skipHide: options.skipHide,
					//scope: options.scope,
					targetEvent: options.$event,
					focusOnOpen: options.focusOnOpen,
					autoWrap: false,
					onShowing: function() {
				//		console.log( "DIALOG OPEN START", Date.now() - dateClick );
					},
					onComplete: function() {
				//		console.log( "DIALOG OPEN COMPLETE", Date.now() - dateClick );
					}
                });

				dialog.then(function (value) {
					console.log( "Dialog Close", $mdColorPickerHistory );
                    $mdColorPickerHistory.add(new tinycolor(value));
                }, function () { });

                return dialog;
            },
			hide: function() {
				return dialog.hide();
			},
			cancel: function() {
				return dialog.cancel();
			}
		};
	}])
	.factory('$mdColorPickerPanel', ['$q', '$mdPanel', '$mdColorPickerHistory', function ($q, $mdPanel, $mdColorPickerHistory) {
		var panelRef;

        return {
            show: function (options)
            {
				var defer = $q.defer();

				console.log( "EVENT ", options.$event.target);

				var position = $mdPanel.newPanelPosition()
			    	.relativeTo( options.$event.target )
			    	.addPanelPosition( $mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.ALIGN_TOPS );

					//position._isOnScreen()

			//	$mdPanel.setGroupMaxOpen('mdColorPickerPanel', 1);

				var animation = $mdPanel.newPanelAnimation()
					.openFrom( options.$event.target )
					.withAnimation( {
						open: 'md-pane-open',
						close: ''
					} );



                if ( options === undefined ) {
                    options = {};
                }
				//console.log( 'DIALOG OPTIONS', options );
				// Defaults
				// Dialog Properties
                options.hasBackdrop = options.hasBackdrop === undefined ? true : options.hasBackdrop;
				options.clickOutsideToClose = options.clickOutsideToClose === undefined ? true : options.clickOutsideToClose;
				options.defaultValue = options.defaultValue === undefined ? '#FFFFFF' : options.defaultValue;
				options.focusOnOpen = options.focusOnOpen === undefined ? false : options.focusOnOpen;
				options.preserveScope = options.preserveScope === undefined ? true : options.preserveScope;
				options.skipHide = options.skipHide === undefined ? true : options.skipHide;

				var promiseResolved = true;
				var mdPanelRef_ = undefined;
				var panelScope_ = undefined;

				// mdColorPicker Properties
				options.mdColorAlphaChannel = true; //(!options.mdColorRgb && !options.mdColorHsl) ? false : options.mdColorAlphaChannel;
				if ( !panelRef ) {
					panelRef = $mdPanel.create({
						templateUrl: 'mdColorPickerPanel.tpl.html',
						position: position,
						animation: animation,
						attachTo: angular.element(document.body),
						openFrom: options.$event,
						panelClass: 'md-color-picker-panel md-whiteframe-10dp',
						groupName: 'mdColorPickerPanel',
						controller: ['mdPanelRef','$scope', 'opts', function( mdPanelRef, $scope, opts ) {
								//console.log( "DIALOG CONTROLLER OPEN", Date.now() - dateClick );
								$scope.close = function close() {
									mdPanelRef.close();
									// $scope.$destroy();
								};
								$scope.ok = function ok() {
									defer.resolve( $scope.value );
									promiseResolved = true;
									$scope.close();
								};

								console.log( 'Panel Scope', $scope );
								mdPanelRef_ = mdPanelRef;
								panelScope_ = $scope;

								$scope.value = opts.value;
								$scope.default = opts.defaultValue;
								$scope.random = opts.random;

								$scope.mdColorAlphaChannel = opts.mdColorAlphaChannel;
								$scope.mdColorDefaultTab = opts.mdColorDefaultTab;

								$scope.$watch( 'value', function( newVal ) {
									options.value = newVal;
								});

								$scope.$watch('')

						}],

						locals: {
							opts: options,
						},
						//hasBackdrop: options.hasBackdrop,
						clickOutsideToClose: true,//|| options.clickOutsideToClose,
						escapeToClose: true,//|| options.clickOutsideToClose,
						// preserveScope: options.preserveScope,
						// skipHide: options.skipHide,
						// scope: options.scope,
						// targetEvent: options.$event,
						// focusOnOpen: options.focusOnOpen,
						// autoWrap: false,
						//

						onDomAdded: function() {
							console.log( arguments );
							// console.log( panelRef, position );
							// console.log( position._isOnscreen( panelRef._panelEl ) );
						},
						onRemoving: function() {

						},
						onDomRemoved: function () {
							if ( promiseResolved ) {
								defer.reject();
								panelScope_.value = undefined;
							}
							console.log( 'Panel Removed from DOM' );
							panelScope_.$destroy();
							panelRef = undefined;
						}
	                });

					panelRef.open();

				}
				//


                return defer.promise;
            },
			hide: function() {
				return panelRef.hide();
			},
			cancel: function() {
				return panelRef.cancel();
			}
		};
	}]);
})( window, window.angular, window.tinycolor );
