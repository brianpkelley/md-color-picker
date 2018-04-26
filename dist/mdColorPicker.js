/**
 * md-color-picker - Angular-Material inspired color picker.
 * @version v0.2.6
 * @link https://github.com/brianpkelley/md-color-picker
 * @license MIT
 */
;(function(window, angular, TinyColor, undefined) {
"use strict";

'use strict';

	var dateClick;

	function getMergedOptions( options, defaults ) {
		//
		// Using Object.assign overwrites the options and we loose "value" so it no longer updates while setting a color.
		// console.log( options, defaults );
		// //var returnOptions = {};
		// defaults = defaults || {};
		// options = options || {};
		// var x;
		//
		// for ( x in options ) {
		// 	if ( options.hasOwnProperty( x ) && options[x] === undefined ) {
		// 		delete options[x]
		// 	}
		// }
		//
		// for ( x in defaults ) {
		// 	if ( defaults.hasOwnProperty( x ) && defaults[x] === undefined ) {
		// 		delete defaults[x]
		// 	}
		// }
		// return Object.assign( {}, defaults, options );

		for ( var key in defaults ) {
			if ( defaults.hasOwnProperty( key ) ) {
				// console.log( key, ':', value, ' - ', options[key] );
				options[ key ] = options[ key ] === undefined ? defaults[ key ] : options[ key ];
			}
		};
		// console.log( "MERGED OPTIONS", options );
		return options
	}

	function checkTranscludes ( scope, element, transclude ) {

		scope.transcluded_content = {};
		var transclusion_checks = ['main', 'mdIcon'];
		angular.forEach( transclusion_checks, function( val ) {
			if ( transclude && transclude.isSlotFilled( val ) ) {
				transclude(scope, function(clone) {
					if ( clone.length ) {
						scope.transcluded_content[val] = clone[0];
					}
					if ( val === 'main' ) {
						element.empty().append( angular.element( clone ) )
					}
				}, undefined, val );
			} else {
				scope.transcluded_content[val] = undefined;
			}
		});
		

	};




	function mdColorPickerLinkFn( scope, element, attrs, controllers, transclude ) {
		var $ngModelController = controllers[0];
		var vm = controllers[1];
		
		// element.on('click', vm.showColorPicker );
		
		
		var viewFormatter;
		var viewParser;
		
		checkTranscludes( scope, element, transclude );
		
		// Set up $ngModelController functions
		//////////////////////////////////////////////////////
		
		// $ngModelController = $ngModelController;
		$ngModelController.$options = $ngModelController.$options || {};
		$ngModelController.$options.updateOn = 'blur';
		// console.log( 'INITIAL $ngModelController.$modelValue', $ngModelController, $scope.value );
		scope.data.color = $ngModelController.$modelValue && new TinyColor( $ngModelController.$modelValue );
		
		/**
		 * Originally used $ngModel.parsers and $ngModel.formatters to handle this, but they apply
		 * to the ngModel entirely and we need it for only select element types.
		 */
		
		
		
		vm.updateValue = function updateValue( value, oldValue ) {
			// console.warn( "UPDATE VALUE!!!!!", value, oldValue );
			// console.trace();
			// If value doesn't have a value BUT oldValue does, continue on changing the value. aka, reset to undefined (clear)
			if ( !value && oldValue ) { // jshint ignore:line
				scope.data.color = undefined;
				element[0].value = '';
				
				return;
			} else {
				scope.data.color = value;
				if ( vm.isColorInput ) {
					element[0].value = vm.viewParser( $ngModelController.$viewValue );
				}
			}
		};
		
		vm.updateColor = function updateColor ( value, oldValue ) {
			if ( !value && !value === !oldValue ) {
				return;
			}
			
			// Update Inputs
			if ( vm.isInputElement && !vm.isColorInput ) {
				element.val( vm.viewFormatter ? vm.viewFormatter( value ) : value );
				// scope.value = vm.viewFormatter ? vm.viewFormatter( value ) : value;
			}
			
			
			$ngModelController.$setViewValue( value );
			//$ngModelController.$commitViewValue();
			
			
		}
		// console.log( element, element.attr('md-color-picker'), element[0].tagName )
		if ( element.attr('md-color-picker') !== undefined || element[0].tagName === 'md-color-picker-preview' ) {
			// Set up opening events and prevent the default color picker.
			element.on('click', function( event ) {
				event.preventDefault();
				vm.showColorPicker( event );
			})
		}
		
		
		// Watch for our changes
		scope.$watch( 'data.color', vm.updateColor );
		// Watch for their changes
		scope.$watch( function() { return $ngModelController.$modelValue; }, vm.updateValue );
		
		
	}
	
	
	
	
	
	angular.module('mdColorPicker', ['mdColorPickerConfig','mdColorPickerHistory','mdColorPickerGradientCanvas'])
	.run([ '$templateCache', function( $templateCache ) {
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
	.controller( 'mdColorPickerController', [ '$scope', '$element', '$attrs', '$timeout', '$mdColorPickerConfig', '$mdColorPickerHistory', '$mdColorPicker', function( $scope, $element, $attrs, $timeout, $mdColorPickerConfig, $mdColorPickerHistory, $mdColorPicker ) {
		// console.log( "MD COLOR PICKER OPTIONS", $scope.options );
		$scope.data = {
			color: undefined
		};
		
		var vm = this;
		var INITIAL_VALUE;
		
		vm.showColorPicker = showColorPicker;
		vm.config = $mdColorPickerConfig;
		vm.options = angular.extend( {}, vm.config.defaults.mdColorPicker, vm.options || {} );
		vm.placeholder = vm.placeholder != '' ? vm.placeholder : undefined;
		
		// console.log ("OPTIONS", $scope, this );
		$scope.$watch('$ctrl.options', function( newValue, oldValue ) {
			if ( newValue ) {
				vm.options = angular.extend( {}, vm.config.defaults.mdColorPicker, newValue );
			}
		}, true);
		
		/**
		* With <input type="color"> we can only support HEX notations
		*/


		vm.viewParser = undefined;
		vm.viewFormatter = undefined;
		
		vm.isInputElement = $element.prop('tagName').toUpperCase() === 'INPUT';
		// vm.isMdColorPickerElement = $element.prop
		vm.isColorInput = vm.isInputElement && $element.prop('type').toUpperCase() === 'COLOR';
		
		if ( vm.isColorInput ) {
			// Going to the DOM
			vm.viewFormatter = function ( value ) {
				if ( !value ) {
					value = $scope.default || vm.config.defaults.mdColorPicker.default
				}
				var formatted = new TinyColor( value ).toHexString();
				return formatted;
			};
			
			// Coming from the DOM
			vm.viewParser = function( value ) {
				if ( !value ) {
					value = $scope.default || vm.config.defaults.mdColorPicker.default;
				}
				var formatted = new TinyColor( value ).toHexString();
				return formatted;
			};
		}
		if ( !vm.isInputElement ) {
			if ( $element[0].tagName !== 'MD-COLOR-PICKER' ) {
				$element.on( 'click', vm.showColorPicker );
			}
			
			if ( $element.attr( 'required' ) ) {
				vm.isRequired = true; //$element.find('input').attr( 'required', true );
			}
		}
		
		console.log( $element[0].tagName, $element.attr( 'required' ) );

		function showColorPicker($event) {
			console.time('1. Open Color Picker');
			console.time('TOTAL TIME TO OPEN: ');
			$event.stopImmediatePropagation();
			$event.preventDefault();
			// console.log("EVENT!", $event);
			INITIAL_VALUE = $scope.data.color; //$ngModelController.$modelValue;
			
			
			var dialogOptions = {
				clickOutsideToClose: $scope.clickOutsideToClose,
				hasBackdrop: vm.options.hasBackdrop,
				multiple: $scope.multiple,
				preserveScope: $scope.preserveScope,
				$event: $event,
				targetEvent: $event,
				type: vm.options.type || 'panel'
			};
 
			var mdColorPickerOptions = {
				value: INITIAL_VALUE,
				defaultValue: $scope.default,
				random: vm.options.random,
				// openOnInputFocus: options.openOnInputFocus,
				// mdColorAlphaChannel: $scope.mdColorAlphaChannel,
				// mdColorDefaultTab: $scope.mdColorDefaultTab,
			};


			

			var removeWatch = $scope.$watch( function() { return mdColorPickerOptions.value; }, function( newVal, oldVal ) {
				// console.warn( "VALUE CHANGE", newVal, oldVal );
				// console.trace();
				if ( newVal !== oldVal ) {
					vm.updateValue( newVal );
				}
			});
			
			var colorPicker = $mdColorPicker.show( mdColorPickerOptions, dialogOptions );
				
				
			colorPicker.then( function ( color ) {
				removeWatch();
				vm.updateValue( color );
				$mdColorPickerHistory.add( color );
				
			}, function () {
				removeWatch();
				vm.updateValue( INITIAL_VALUE );
			} );
			
			// For some reason, the $watch doesn't pick up the default/random color change, even when put in a timeout.
			// So we just manually call it here... pretty hacky I know.
			vm.updateValue( mdColorPickerOptions.value );
		
		};
	}])
	.directive('mdColorPickerPreview', [ function() {
		return {
			template: '<div class="md-color-picker-preview md-color-picker-checkered-bg md-whiteframe-5dp"><div class="md-color-picker-result" ng-style="{backgroundColor: value}"></div></div>',
			require: ['^ngModel'],
			restrict: 'E',
			link: function( scope, element, attrs, controllers ) {
				
				// attrs.$observe('ngModel', function(value) {
				// 	console.log("NG MODEL CHANGE", value );
				// 	scope.value = value;
				// });
				
				scope.$watch(attrs.ngModel, function(value) {
					// console.log("NG MODEL CHANGE", value, attrs.ngModel, scope[attrs.ngModel] );
					scope.value = value;
				});
			}
		};
	}])

	.directive('mdColorPickerClear', [ function() {
		return {
			template: '<md-button class="md-icon-button md-color-picker-clear" aria-label="Clear Color" ng-click="onClick($event)"><md-icon md-svg-icon="clear.svg"></md-icon></md-button>',
			require: ['^mdColorPicker', '^ngModel'],
			// scope: {},
			restrict: 'E',
			link: function( scope, element, attrs, controllers ) {
				var mdColorPicker = controllers[0];
				
				scope.onClick = function( $event ) {
					// console.log("CLICK!!!!!!!");
					mdColorPicker.updateValue();
				}
			}
		};
	}])
	.directive( 'mdColorPicker', ['$mdColorPickerConfig', '$mdColorPickerHistory', '$mdColorPicker', function( $mdColorPickerConfig, $mdColorPickerHistory, $mdColorPicker ) {
		return {
			require: ['^ngModel', 'mdColorPicker'],
			restrict: 'E',
			transclude: {
				'main': '?mdColorPickerContent',
				'mdIcon': '?mdIcon',
				'label': '?mdColorPickerLabel',
				// 'placeholder': '?mdColorPickerPlaceholder'
			},
			templateUrl: 'mdColorPicker.tpl.html',
			scope: {
				options: '=?mdColorPickerOptions',
				value: '=ngModel',
				placeholder: '@?'
			},
			bindToController: true,
			controllerAs: '$ctrl',
			controller: 'mdColorPickerController',
			link: mdColorPickerLinkFn
		};
	}])
	.directive( 'mdColorPicker', ['$mdColorPickerConfig', '$mdColorPickerHistory', '$mdColorPicker', function( $mdColorPickerConfig, $mdColorPickerHistory, $mdColorPicker ) {
		return {
			require: ['^ngModel', 'mdColorPicker'],
			restrict: 'A',
			scope: {
				options: '=?mdColorPicker',
				value: '=ngModel'
			},
			bindToController: true,
			controllerAs: '$ctrl',
			controller: 'mdColorPickerController',
			link: mdColorPickerLinkFn

		};
	}])
	// // Input options
	// notation: '@?',
	// random: '@?',
	// default: '@?',
	//
	// // Dialog Options
	// openOnInput: '=?',
	// hasBackdrop: '=?',
	// clickOutsideToClose: '=?',
	// skipHide: '=?',
	// preserveScope: '=?',
	//
	// // Advanced options
	// mdColorClearButton: '=?',
	// mdColorPreview: '=?',
	//
	// mdColorAlphaChannel: '=?',
	// mdColorDefaultTab: '=?'






	.provider( '$mdColorPicker', [function() {
		function $mdColorPickerException( message, type ) {
			this.type = type || '' ;

			this.name = '$mdColorPicker:Exception';

			this.message = message;

			this.toString = function() {
				return '[' + this.type + '] ' + ( this.type ? this.type + ' - ' : '' ) + this.message;
			};
		};
		
		$mdColorPickerException.prototype = new Error();
		$mdColorPickerException.prototype.constructor = $mdColorPickerException;

		this.$get = ['$q', '$mdDialog', '$mdPanel', '$mdColorPickerConfig', '$mdColorPickerHistory', function ($q, $mdDialog, $mdPanel, $mdColorPickerConfig, $mdColorPickerHistory) {


			var dialog;
			var panel;


			var service = {
				show: function( colorPickerOpts, containerOpts ) {
					
					
					
					// console.log( "OPENING 1", colorPickerOpts.value );
					var containerType  = ( containerOpts && containerOpts.type ) || $mdColorPickerConfig.defaults.containerType;
					var containerOptions = getMergedOptions( containerOpts, $mdColorPickerConfig.defaults[ containerType ] );
					
					// mdColorPicker Properties
					var mdColorPickerOptions = getMergedOptions( colorPickerOpts, $mdColorPickerConfig.defaults.mdColorPicker );
					// console.log( "THE OPTS", colorPickerOpts, mdColorPickerOptions );
					
					// Set up overrides for colors
					mdColorPickerOptions.mdColorHex = ((mdColorPickerOptions.mdColorHex === undefined) || (!mdColorPickerOptions.mdColorRgb && !mdColorPickerOptions.mdColorHsl))  ? true : mdColorPickerOptions.mdColorHex;
					mdColorPickerOptions.mdColorAlphaChannel = true; (!mdColorPickerOptions.mdColorRgb && !mdColorPickerOptions.mdColorHsl) ? true : mdColorPickerOptions.mdColorAlphaChannel;
					
					// console.log( "OPENING 2", mdColorPickerOptions.value );
					// Starting Color
					var value;
					var defaultValue;
					if ( !colorPickerOpts.value ) {
						// Set up the opening color
						// console.log( "ASSIGNING OPENING COLOR ", scope, scope.value,  scope.random, $mdColorPickerConfig.defaults.mdColorPicker.default, $mdColorPickerConfig.defaults.mdColorPicker.random,  scope.random || ( !$mdColorPickerConfig.defaults.mdColorPicker.default && $mdColorPickerConfig.defaults.mdColorPicker.random ));
						// if ( !scope.default ) {
							if ( mdColorPickerOptions.random ) {
								// console.log( "RANDOM COLOR");
								defaultValue = TinyColor.random().toHexString();
							} else if ( mdColorPickerOptions.default ) {
								// console.log( "CONFIG DEFAULT COLOR");
								defaultValue = mdColorPickerOptions.default;
							} else {
								// console.log( "WHITE");
								defaultValue = '#ffffff';
							}
						// }
						// console.log( "SETTING OPENING COLOR", mdColorPickerOptions.value, defaultValue );
						mdColorPickerOptions.value = defaultValue;
					}
					
					// console.log( "OPENING 3", mdColorPickerOptions.value );
					
					
					
					if ( containerType === 'panel' ) {
						// Get options
						containerOptions = getMergedOptions( containerOptions, $mdColorPickerConfig.defaults.panel );
						// Launch the panel
						// console.log( "OPENING 4", mdColorPickerOptions.value );
						return service.showPanel( mdColorPickerOptions, containerOptions );
					} else {
						// Get options
						containerOptions = getMergedOptions( containerOptions, $mdColorPickerConfig.defaults.dialog );
						// Launch the dialog
						return service.showDialog( mdColorPickerOptions, containerOptions );
					}

				},
				showDialog: function( options, dialogOptions ) {
					dialog = $mdDialog.show({
						templateUrl: 'mdColorPickerDialog.tpl.html',
						hasBackdrop: dialogOptions.hasBackdrop,
						clickOutsideToClose: dialogOptions.clickOutsideToClose,

						controller: ['$scope', 'opts', function( $scope, opts ) {
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
								options.value = newVal;
							});

						}],

						locals: {
							opts: options,
						},
						preserveScope: dialogOptions.preserveScope,
						multiple: dialogOptions.multiple,
						targetEvent: dialogOptions.$event,
						focusOnOpen: dialogOptions.focusOnOpen,
						autoWrap: false,
						onShowing: function() {
						},
						onComplete: function() {
						}
					});

					dialog.then(function (value) {
						// console.log( "Dialog Close", $mdColorPickerHistory );
						$mdColorPickerHistory.add(new TinyColor(value));
					}, function () { });

					return dialog;
				},
				showPanel: function( options, panelOptions ) {
					
					/**
					 * KNOWN ISSUE:
					 * There is an issue with $mdPanel.disableParentScroll not being enforced in versions <= 1.1.1.
					 * This has been fixed in Angular Material - Master at this time (1/17/2017), but hasn't been applied to any releases.
					 **/
					var defer = $q.defer();

					var position = $mdPanel.newPanelPosition()
						.relativeTo( panelOptions.$event.target )
						.addPanelPosition( $mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.ALIGN_TOPS );

					var animation = $mdPanel.newPanelAnimation()
						.openFrom( panelOptions.$event.target )
						.withAnimation( {
							open: 'md-pane-open',
							close: ''
						} );

					var promiseResolved = true;
					var mdPanelRef_;
					var panelScope_;

					// mdColorPicker Properties
					options.mdColorAlphaChannel = true; //(!options.mdColorRgb && !options.mdColorHsl) ? false : options.mdColorAlphaChannel;
					if ( !panel ) {
						panel = $mdPanel.open({
							templateUrl: 'mdColorPickerPanel.tpl.html',
							position: position,
							animation: animation,
							attachTo: angular.element(document.body),
							openFrom: options.$event,
							panelClass: 'md-color-picker-panel md-whiteframe-10dp',
							groupName: 'mdColorPickerPanel',
							controller: ['mdPanelRef','$scope', 'opts', function( mdPanelRef, $scope, opts ) {
								
								// console.log( "DIALOG CONTROLLER OPEN", Date.now() - dateClick, Object.assign( {}, opts ) );
								
								// console.log( "OPENING 6", opts.value );
								
								$scope.close = function close() {
									mdPanelRef.close();
									// $scope.$destroy();
								};
								$scope.ok = function ok() {
									defer.resolve( $scope.value );
									promiseResolved = true;
									$scope.close();
								};

								mdPanelRef_ = mdPanelRef;
								panelScope_ = $scope;
								
								$scope.opts = opts;
								
								$scope.value = opts.value;
								
								$scope.mdColorAlphaChannel = opts.mdColorAlphaChannel;
								$scope.mdColorDefaultTab = opts.mdColorDefaultTab;
								
								// console.log( "OPENING 7", $scope.value );
								
								$scope.$watch( 'value', function( newVal ) {
									options.value = newVal;
								});

							}],

							locals: {
								opts: options,
							},
							hasBackdrop: panelOptions.hasBackdrop,
							clickOutsideToClose: panelOptions.clickOutsideToClose,
							escapeToClose: panelOptions.escapeToClose,
							targetEvent: panelOptions.$event,
							focusOnOpen: false,//panelOptions.focusOnOpen,
							disableParentScroll: false,
							origin: panelOptions.$event.target,
							onDomAdded: function() {
								console.timeEnd('2. Add Color Picker');
								console.time('3. Show Color Picker');
								
							},
							onOpenComplete: function() {
								console.timeEnd('3. Show Color Picker');
								console.timeEnd('TOTAL TIME TO OPEN: ');
							},
							onRemoving: function() {
							},
							onDomRemoved: function () {
								if ( promiseResolved ) {
									defer.reject();
									panelScope_.value = undefined;
								}
								panelScope_.$destroy();
								panel = undefined;
							}
						});

						//panel.open();

					}


					return defer.promise;
				}
			}


			return service;
		}];

	}])
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

/**
		 * @classdesc $mdColorPickerConfig Provider
		 * @class $mdColorPickerConfig
		 */
		var mdColorPickerConfigRef;
		var mdColorPickerConfig = function() {
			mdColorPickerConfigRef= this;
			this.Tab = Tab;
			this.Notation = Notation;

 			/**
 			 * Holds the available color notations methods.
 			 * @member {Object} $mdColorPickerConfig#notations
 			 *
 			 */
 			this.notations = {
 				notations_: {},

 				/**
 				 * Rertieve a notation Object.
 				 * @function $mdColorPickerConfig#notations#get
				 *
 				 * @param  {String|Integer} notation Notation identifier.
 				 * @return {Object}          Corresponding notation Object.
 				 */
 				get: function( notation ) {
 					var returnNotation;
 					if ( notation === undefined ) {

 						var returnObj = {};
 						for ( var x = 0; x < this.order.length; x++ ) {
 							returnObj[ this.order[x] ] = this.get( this.order[x] );
 							returnObj[ this.order[x] ].index = x;
 						}
 						return returnObj;

 					} else if ( !isNaN( notation ) ) {
 						returnNotation =  this.notations_[ this.order[ notation ] ];
 						returnNotation.index = notation;
 					} else {
 						returnNotation = this.notations_[ notation ];
 						returnNotation.index = this.order.indexOf( notation );
 					}

 					return returnNotation;
 				},

 				/**
 				 * Selects the notation based on the color string.
				 * @function $mdColorPickerConfig#notations#select
 				 *
 				 * @param  {String} color description.
 				 * @return {String}     String indentifier of the current notation.
 				 */
 				select: function( color ) {
 					// console.log("SELECT", color);
 					var notation = this.get(this.order[0]);
 					var this_ = this;
 					angular.forEach( this.notations_, function( item, i ) {
 						// console.log( item );
 						if ( item.test( color ) ) {
 							notation = item;
 						}
 					}, this);

 					return notation;
 				},

 				/**
 				 * Adds a color notation to the available notations.
				 * @function $mdColorPickerConfig#notations#add
 				 *
 				 * @param  {string} name     Identifier for the notation (hex, rgb, hsl, etc.).
 				 * @param  {Function} notation Function to parse the tinycolor.js color object and return a string.
 				 */
 				add: function( notation, pushToOrder ) {
 					this.notations_[ notation.name ] = new Notation( notation );
 					this.notations_[ notation.name ].index = this.order.indexOf( notation.name );

					if ( pushToOrder ) {
						this.order.push( notation.name );
					}
 				},

 				/**
 				 * Holds the order of the notations to be displayed under the preview.
				 * @member {string} $mdColorPickerConfig#notations#order
				 *
 				 * @default [ 'hex', 'rgb', 'hsl' ]
 				 */
 				 order: [ 'hex', 'rgb', 'hsl' ]


 			};

 			// Default HEX notation object.
 			this.notations.add({
 				name: 'hex',
 				toString: function( color ) {
 					// console.log("TO STRING", color );
 					return color && color.toHexString && color.toHexString();
 				},
 				testExp: /#[a-fA-F0-9]{3,6}/,
 				disabled: function( color ) {
 					return color && color.toRgb().a !== 1;
 				}
 			});

 			// Default RGB notation Object.
 			this.notations.add({
 				name: 'rgb',
 				toString: function( color ) {
 					return color && color.toRgbString && color.toRgbString();
 				},
 				test: function( color ) {
 					return color && color.toLowerCase().search( 'rgb' ) > -1;
 				}
 			});

 			// hsl - Default HSL notation Object.
 			this.notations.add({
 				name: 'hsl',
 				toString: function( color ) {
 					return color && color.toHslString && color.toHslString();
 				},
 				test: function( color ) {
 					return color && color.toLowerCase().search('hsl') > -1;
 				}
 			});








 			/**
 			 * Holds the available tabs to be used.
 			 * Does not hold the order or display properties of the.
 			 * tabs in the window.
 			 * @member {Object} $mdColorPickerConfig#tabs
 			 */
 			this.tabs = {
				cache_: {},
 				tabs_: {},
 				/**
 				 * Adds a tab object to the avaiable tabs for the window.
				 * @function $mdColorPickerConfig#tabs#add
 				 *
 				 * @param  {Object} tab {@link Tab} Options object or an instance of a {@link Tab}.
				 * @param  {Number|String|Boolean} [addToOrder=true] Should the new tab be added to the order.  Can be an index, array function name (`push`,`unshift`, etc), or `true` to push it on the end of the order.  If index is greater than the length of the array, actual starting index will be set to the length of the array, if negative, will begin that many elements from the end.
 				 *
 				 * @example <caption> Adding the Spectrum Tab.</caption>
 				 * $mdColorPickerConfigProvider.tabs.add({
				 * 	name: 'spectrum',
 	 			 * 	icon: 'gradient.svg',
 	 			 * 	template: [
 	 			 *				'<div md-color-picker-spectrum></div>',
 	 			 *				'<div md-color-picker-hue ng-class="{\'md-color-picker-wide\': !mdColorAlphaChannel}"></div>',
 	 			 *				'<div md-color-picker-alpha class="md-color-picker-checkered-bg" ng-show="mdColorAlphaChannel"></div>'
 	 			 *			].join( '\n' )
 	 			 * });
				 *
				 * // Same as above
				 * var spectrumTab = new $mdColorPickerConfig.Tab({
				 * 	name: 'spectrum',
 	 			 * 	icon: 'gradient.svg',
 	 			 * 	template: [
 	 			 *				'<div md-color-picker-spectrum></div>',
 	 			 *				'<div md-color-picker-hue ng-class="{\'md-color-picker-wide\': !mdColorAlphaChannel}"></div>',
 	 			 *				'<div md-color-picker-alpha class="md-color-picker-checkered-bg" ng-show="mdColorAlphaChannel"></div>'
 	 			 *			].join( '\n' )
 	 			 * });
				 *
				 * $mdColorPickerConfig.tabs.add( spectrumTab );
 				 */
 				add: function( tab, addToOrder ) {
					// console.log( "ADD TAB", tab );
					this.tabs_[ tab.name ] = tab;

					addToOrder = addToOrder === undefined ? true : addToOrder;
					if ( addToOrder !== false && this.order.indexOf( tab.name ) === -1 ) {
						if ( typeof this.order[addToOrder] === 'function' ) {
							this.order[addToOrder]( tab.name );
						} else if ( typeof addToOrder == 'number' ) {
							this.order.splice( addToOrder, 0, tab.name );
						} else {
							this.order.push( tab.name );
						}
					}
 				},

 				/**
 				 * Returns the specified tab.
				 * @function $mdColorPickerConfig#tabs#get
 				 *
 				 * @param  {String} tab The identifier of the tab.
 				 * @return {Tab}     The tab object requested.
 				 */
 				get: function( tab, config ) {
					// console.log('GET TAB', this);
 					if ( tab ) {
						if ( config === true ) {
							return this.tabs_[tab];
						} else {
							if ( this.cache_[tab] && this.cache_[tab].length ) {
								return this.cache_[tab][0];
							} else {
								var newTab = new Tab( this.tabs_[ tab ] );
								// this.cache_[ tab ] = this.cache_[ tab ] || [];
								// this.cache_[ tab ].push( newTab );
								return newTab;
							}
						}
 					} else {
 						var returnObj = {};
 						for ( var x = 0; x < this.order.length; x++ ) {
 							returnObj[ this.order[x] ] = this.get( this.order[x] );
 						}
 						return returnObj;
 					}
 				},

				getFromCache: function( tabName, index ) {
					return isNaN( index ) ? this.cache_[ tabName ] : this.cache_[ tabName ][index];
				},

 				/**
 				 * Holds the order of the tabs, if a tab is not in this list, it will not be shown.
				 * @member $mdColorPickerConfig#tabs#order
				 * @default [ 'spectrum',]
 				 */
 				order: [ 'spectrum', 'wheel', 'colorSliders' ] // [ 'spectrum', 'wheel', 'rgbSliders', 'palette', 'material', 'history' ];
 			};



 			this.tabs.add({
 				name: 'spectrum',
 				icon: 'gradient.svg',
 				template: [
 							'<div md-color-picker-spectrum></div>',
 							'<div md-color-picker-hue ng-class="{\'md-color-picker-wide\': false && !mdColorAlphaChannel}"></div>',
 							'<div md-color-picker-alpha class="md-color-picker-checkered-bg" ng-show="true || mdColorAlphaChannel"></div>'
 						].join( '\n' )
 			});

 			this.tabs.add({
 				name: 'colorSliders',
 				icon: 'tune.svg',
 				templateUrl: 'tabs/colorSliders.tpl.html',
 				link: function( $scope, $element ) {
 					// $scope.alphaValue = $scope.data.color.getAlhpa();
 					
 					// this.watches.push( $scope.$watch( 'alphaValue', function( newVal ) {
 					// 	console.log( "alphaValue")
 					// 	$scope.data.color._a = newVal;
 					// }));
 					// this.watches.push( $scope.$watch( 'data.color.getAlpha()', function( newVal ) {
 					// 	$scope.alphaValue = newVal;
					// }))
 				}
 			});

			this.tabs.add({
				name: 'wheel',
				icon: 'wheel.svg',
				template: [
							'<div md-color-picker-wheel></div>',
							'<div md-color-picker-value ng-class="{\'md-color-picker-wide\': false && !mdColorAlphaChannel}"></div>',
							'<div md-color-picker-alpha class="md-color-picker-checkered-bg" ng-if="true || mdColorAlphaChannel"></div>'
						].join('\n')
			}, 'push');
	

			this.defaults = {
				containerType: 'panel',
				history: {
					useLocalStorage: false,
					useCookies: true,
				},
				dialog: {
					hasBackdrop: true,
					clickOutsideToClose: true,
					escapeToClose: true,
					focusOnOpen: false,
					preserveScope: false,
					multiple: true,
					targetEvent: undefined

				},
				panel: {
					hasBackdrop: false,
					escapeToClose: true,
					trapFocus: false,
					clickOutsideToClose: true,
					focusOnOpen: true,
					fullscreen: false

				},
				mdColorPicker: {
					default: '#FFFFFF',
					defaultTab: 'wheel',
					alphaChannel: true,
					random: false,
					openOnInputClick: true,
					openOnPreviewClick: true,
					selectLabel: 'Select',
					cancelLabel: 'Cancel'
				}
			};


 			/*
 			 * return the config Object.
 			 */
 			this.$get = ['$q', '$templateRequest', function( $q, $templateRequest ) {

 				// Overwriting the stub here for $q and $templateRequest
 				Tab.prototype.getTemplate = function() {
 					var defer = $q.defer();
 					var self = this;
 					if ( this.template !== undefined ) {
 						defer.resolve( { tab: self, tpl: self.template } );
 					} else if ( this.templateUrl ) {
 						$templateRequest( this.templateUrl ).then( function( tpl ) {
 							defer.resolve( { tab: self, tpl: tpl } );
 						});
 					}

 					return defer.promise;

 				};

 				return this;
 			}];

 		};



		/**
		 * @classdesc Notation object.
		 * @class $mdColorPickerConfig#Notation
		 *
		 * @param {Object} notation
		 * @param {String} notation.name Name of the notation used as an identifier.
		 * @param {RegExp} [notation.testExp] Regular Expression used to test a string against the notation format.
		 *
		 */
		function Notation( notation ) {
			/** @member {String} $mdColorPickerConfig#Notation#name The name of the notation. */
			this.name = notation.name;

			/**
			 * @member {Integer} $mdColorPickerConfig#Notation#index The index of the notation in the {@link $mdColorPickerConfig#notations#order} array.
			 * @default -1
			 */
			this.index = -1;

			/**
			 * @member {RegExp} $mdColorPickerConfig#Notation#testExp Test RegExp used by {@link $mdColorPickerConfig#Notation#test}
			 */
			this.testExp = notation.testExp;

			angular.merge( this, notation );
		}

		/**
		 * Converts tinycolor.js Object to the notations string equivalent.
		 * @type function
		 * @memberof Notation
		 * @abstract
		 *
		 * @param  {tinycolor} color Tinycolor.js color Object.
		 * @return {String}       String notation of the color.
		 *
		 */
		Notation.prototype.toString = function( color ) {

		};

		/**
 		 * Converts tinycolor.js Object to the notations object equivalent.
 		 * @memberof Notation
 		 *
 		 * @param  {tinycolor} color Tinycolor.js color Object.
 		 * @return {Object}       Object notation of the color.
		 *
		 * @example
		 * var rgbObject = $mdColorPickerConfig.notations.get('rgb').toObject();
		 *
		 * // rbgObject == { r: 200, g: 255, b: 0, a: 1 }
 		 */
 		Notation.prototype.toObject = function( color ) {

 		};

		/**
		* Converts tinycolor.js Object to the notations object equivalent.
		* @memberof Notation
		*
		* @param  {tinycolor} color Tinycolor.js color Object.
		* @return {Object}       Object notation of the color.
		*
		* @example
		* var rgbObject = $mdColorPickerConfig.notations.get('rgb').toObject();
		*
		* // rbgObject == { r: 200, g: 255, b: 0, a: 1 }
		*/
		Notation.prototype.toTinyColorObject = function( color ) {
		   return new TinyColor( color );
	   };

		/**
		 * Check if a color string is in the notations format.
		 * @memberof Notation
		 *
		 * @param  {String} color Color String.
		 * @return {Boolean}     True if string in in the notations format, False if it is not.
		 */
		Notation.prototype.test = function( colorStr ) {
			return this.testExp.test( colorStr );
		};

		/**
		 * Check if the notation should be disabled.
		 * @memberof Notation
		 *
		 * @param  {tinycolor} color description
		 * @return {Boolean}       True if disabled, False if enabled.
		 */
		Notation.prototype.disabled = function() {
			return false;
		};









		/**
		 * @class $mdColorPickerConfig#Tab
		 * @classdesc Base for all mdColorPicker Tabs.
		 *
		 * @param  {String} name    Name of the tab.
		 * @param  {Object} tab
		 * @param  {String} options.name The name of the tab.
		 * @param  {String} options.icon The svg icon name.
		 * @param  {String} [options.template] The template string for the tab.
		 * @param  {String} [options.templateUrl] The template URL for the tab.
		 * @param  {Function} [options.link] {@link $mdColorPickerConfig#Tab#link} function called after the tab is created and added to the md-tabs element.
		 *
		 * @throws {TabException} Tab Exception for template or name errors.
		 */
		function Tab( options ) {

			function TabException( message, type ) {
				this.type = type;

				this.name = 'mdColorPicker:TabException';
				this.message = '[' + this.name + '] ' + this.type + ' - ' + message;//message;

				this.toString = function() {
					return '[' + this.name + '] ' + this.type + ' - ' + this.message;
				};
			}
			TabException.prototype = new Error();
			TabException.prototype.constructor = TabException;

			options = options || {};



			if ( !options.templateUrl && ( options.template === undefined ) ) {
				throw new TabException( '[' + options.name + '] A template or template URL must be specified.', 'Template Error' );
			}
			if ( !options.name ) {
				throw new TabException( 'A non empty tab name must be specified.', 'Name Error' );
			}

			/** @member {String} $mdColorPickerConfig#Tab#name The name of the tab. */
			this.name = options.name;

			/** @member {String} $mdColorPickerConfig#Tab#icon The svg icon name. */
			this.icon = options.icon || '';

			/** @member {String} $mdColorPickerConfig#Tab#template The template string for the tab. */
			//this.template;
			if ( options.template !== undefined && options.templateUrl === undefined ) {
				this.template = options.template;
			}

			/** @member {String} $mdColorPickerConfig#Tab#templateUrl The template URL for the tab. */
			this.templateUrl = options.templateUrl;

			var linkFn;
			if ( typeof options.link == 'function' ) {
				linkFn = options.link; //angular.bind( this, options.link );
				//delete options.link;
			} else {
				linkFn = angular.noop;
			}
			
			this.watches = [];


			this.link = function ( $scope, $element) {
				this.$scope = $scope;
				this.$element = $element;
				angular.bind( this, linkFn )( $scope, $element );
			}

			// setTimeout( angular.bind( this, function() {
			// 	this.getTemplate = Tab.prototype.getTemplate;
			// }),1);

			/** @member {$element} $mdColorPickerConfig#Tab#$elemnt The angular.element wrapped element of the tab once rendered. */

			angular.merge( this, options );
			// console.log( "ADDING ", this.name, "TO CACHE", mdColorPickerConfigRef );
			// Add this tab to the tabs.cache_ objet;
			mdColorPickerConfigRef.tabs.cache_[ options.name ] = mdColorPickerConfigRef.tabs.cache_[ options.name ] || [];
			// keep track of index for removal later
			this.cacheIndex = mdColorPickerConfigRef.tabs.cache_[ options.name ].length;
			mdColorPickerConfigRef.tabs.cache_[ options.name ].push( this );
		}
		/**
		 * Tab.$destroy - Destroy function called when the tab is destroyed.
 		 * @memberof Tab
 		 */
		Tab.prototype.$destroy = function( ) {
			// console.log( "DESTRYOING", this );
			if ( this.$element ) {
				this.$element.remove();
				this.$element = undefined;
			}
			
			angular.forEach( this.watches, function( watch ) {
				watch();
			} );
			
			mdColorPickerConfigRef.tabs.cache_[this.name].splice(this.cacheIndex, 1);
		};

		/**
		 * Tab.link - Link function called after the tab is created and added to the md-tabs element.
		 * @memberof Tab
		 *
		 * @param  {type} $scope   Current $scope of the mdColorPicker
		 * @param  {type} $element The content element of the `<md-tab>`
		 */
		Tab.prototype.link = function( $scope, $element ) { };

		/**
		 * Tab.setPaletteColor - Upadates $scope.data.color and calls $scope.$apply to refresh everything.
		 * @memberof Tab
		 *
		 * @param  {Event} event  Mouse event to find the target element.
		 * @param  {Scope} $scope Current mdColorPicker scope to update the color value.
		 */
		Tab.prototype.setPaletteColor = function( event, $scope ) {
			event.stopImmediatePropagation();
			event.preventDefault();
			//$scope.previewBlur();

			$scope.$apply(function() {
				$scope.data.color = new tinycolor( event.target.style.backgroundColor );
				$scope.data.hsva = $scope.data.color.toHsv();
				$scope.data.hsva.a = $scope.data.color.getAlpha();
			});
		};

		/**
		 * Returns the associated template for the tab.
		 * @memberof Tab
		 *
		 * @return {String}  The template string.
		 */
		Tab.prototype.getTemplate = function() {}; // Stub replaced in the $get function.


		angular.module( 'mdColorPickerConfig', [] )
			.provider( '$mdColorPickerConfig', [mdColorPickerConfig]);
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

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
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

(function( window, angular, undefined ) {

	angular.module( 'mdColorPickerHistory', [] )
		.provider('$mdColorPickerHistory', function() {
			var history = [];
			var strHistory = [];

			var $cookies = false;


			var length = 40;

		 	this.length = function() {
				if ( arguments[0] ) {
					length = arguments[0];
				} else {
					return history.length;
				}
			};
			this.add = function( color ) {
				if ( typeof(color) === 'string' ) {
					color = new tinycolor( color );
				}
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
			};
			this.get = function() {
				return history;
			};
			this.reset = function() {
				history = [];
				strHistory = [];
				if ( $cookies ) {
					$cookies.putObject('mdColorPickerHistory', strHistory );
				}
			};

			this.$get = ['$injector', function( $injector ) {
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

				return this;
			}];
		});

})( window, window.angular );
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

// Taken from
// http://jsdo.it/akm2/yr9B


(function( window, undefined ) {
	function ConicalGradient() {
	    this._offsets = [];
	    this._colors = [];
	}

	ConicalGradient.prototype = {
	    /**
	     * addColorStop
	     *
	     * @param {Number} offset
	     * @param {Array} color RGBA 値を配列で指定, アルファ値は省略可 (ex) [255, 127, 0, 0.75]
	     */
	    addColorStop: function(offset, color) {
	        this._offsets.push(offset);
	        this._colors.push(color);
	        return this;
	    },

	    /**
	     * _offsetsReverse (array.forEach callback)
	     */
	    _offsetsReverse: function(offset, index, array) {
	        array[index] = 1 - offset;
	    },

	    /**
	     * fill
	     *
	     * グラデーションを描画する
	     * 第2引数以降は context.arc() とほぼ同じ
	     *
	     * @param {Number} context 対象となる context
	     * @param {Number} x
	     * @param {Number} y
	     * @param {Number} radius
	     * @param {Number} startAngle
	     * @param {Number} endAngle
	     * @param {Boolean} anticlockwise
	     */
	    fill: function(context, x, y, radius, startAngle, endAngle, anticlockwise) {
	        var offsets = this._offsets;
	        var colors = this._colors;

	        var PI = Math.PI;
	        var TWO_PI = PI * 2;

	        if (startAngle < 0) startAngle = startAngle % TWO_PI + TWO_PI;
	        startAngle %= TWO_PI;
	        if (endAngle < 0) endAngle = endAngle % TWO_PI + TWO_PI;
	        endAngle  %= TWO_PI;

	        if (anticlockwise) {
	            // 反時計回り
	            var swap   = startAngle;
	            startAngle = endAngle;
	            endAngle   = swap;

	            colors.reverse();
	            offsets.reverse();
	            offsets.forEach(this._offsetsReverse);
	        }

	        if (
	            startAngle > endAngle ||
	            Math.abs(endAngle - startAngle) < 0.0001 // 誤差の範囲内なら同値とする
	        ) endAngle += TWO_PI;

	        var colorsLength = colors.length; // 色数

	        var currentColorIndex = 0; // 現在の色のインデックス
	        var currentColor = colors[currentColorIndex]; // 現在の色
	        var nextColor    = colors[currentColorIndex]; // 次の色

	        var prevOffset = 0; // 前のオフセット値
	        var currentOffset = offsets[currentColorIndex]; // 現在のオフセット値
	        var offsetDist = currentOffset - prevOffset; // オフセットの差

	        var totalAngleDeg = (endAngle - startAngle) * 180 / PI; // 塗る範囲の角度量
	        var stepAngleRad = (endAngle - startAngle) / totalAngleDeg; // 一回の塗りの角度量

	        var arcStartAngle = startAngle; // ループ内での塗りの開始角度
	        var arcEndAngle; // ループ内での塗りの終了角度

	        var r1 = currentColor[0], g1 = currentColor[1], b1 = currentColor[2], a1 = currentColor[3];
	        var r2 = nextColor[0],    g2 = nextColor[1],    b2 = nextColor[2],    a2 = nextColor[3];
	        if (!a1 && a1 !== 0) a1 = 1;
	        if (!a2 && a2 !== 0) a2 = 1;
	        var rd = r2 - r1, gd = g2 - g1, bd = b2 - b1, ad = a2 - a1;
	        var t, r, g, b, a;

	        context.save();
	        for (var i = 0, n = 1 / totalAngleDeg; i < 1; i += n) {
	            if (i >= currentOffset) {
	                // 次の色へ
	                currentColorIndex++;

	                currentColor = nextColor;
	                r1 = currentColor[0]; g1 = currentColor[1]; b1 = currentColor[2]; a1 = currentColor[3];
	                if (!a1 && a1 !== 0) a1 = 1;

	                nextColor = colors[currentColorIndex];
	                r2 = nextColor[0]; g2 = nextColor[1]; b2 = nextColor[2]; a2 = nextColor[3];
	                if (!a2 && a2 !== 0) a2 = 1;

	                rd = r2 - r1; gd = g2 - g1; bd = b2 - b1; ad = a2 - a1;

	                prevOffset = currentOffset;
	                currentOffset = offsets[currentColorIndex];
	                offsetDist = currentOffset - prevOffset;
	            }

	            t = (i - prevOffset) / offsetDist;
	            r = (rd * t + r1) & 255;
	            g = (gd * t + g1) & 255;
	            b = (bd * t + b1) & 255;
	            a = ad * t + a1;

	            arcEndAngle = arcStartAngle + stepAngleRad;

	            // 扇状に塗っていく
	            context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	            context.beginPath();
	            context.moveTo(x, y);
	            context.arc(x, y, radius, arcStartAngle - 0.02, arcEndAngle, false); // モアレが出ないよう startAngle を少し手前から始める
	            context.closePath();
	            context.fill();

	            arcStartAngle += stepAngleRad;
	        }
	        context.restore();

	        return this;
	    }
	};

	window.ConicalGradient = ConicalGradient;
})( window );
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

// Video.js CoreObject for a quick and dirty inheritance method.
	/////////////////////////////////

	var obj = {};
	obj.create = Object.create || function(obj){
		//Create a new function called 'F' which is just an empty object.
		function F() {}

		//the prototype of the 'F' function should point to the
		//parameter of the anonymous function.
		F.prototype = obj;

		//create a new constructor function based off of the 'F' function.
		return new F();
	};

	var CoreObject = function(){};
	/**
	* Create a new object that inherits from this Object
	*
	*     var Animal = CoreObject.extend();
	*     var Horse = Animal.extend();
	*
	* @param {Object} props Functions and properties to be applied to the new object's prototype
	* @return {CoreObject} An object that inherits from CoreObject
	* @this {*}
	*/
	CoreObject.extend = function(props){
		var init, subObj;

		props = props || {};
		init = props['init'] || props.init || this.prototype['init'] || this.prototype.init || function(){};
		subObj = function(){
			init.apply(this, arguments);
		};

		subObj.prototype = obj.create(this.prototype);
		subObj.prototype.constructor = subObj;

		// Make the class extendable
		subObj.extend = CoreObject.extend;
		// Make a function for creating instances
		subObj.create = CoreObject.create;

		// Extend subObj's prototype with functions and other properties from props
		for (var name in props) {
			if (props.hasOwnProperty(name)) {
				subObj.prototype[name] = props[name];
			}
		}

		return subObj;
	};

	/**
	* Create a new instace of this Object class
	*
	*     var myAnimal = Animal.create();
	*
	* @return {CoreObject} An instance of a CoreObject subclass
	* @this {*}
	*/
	CoreObject.create = function(){
		// Create a new object that inherits from this object's prototype
		var inst = obj.create(this.prototype);

		// Apply this constructor function to the new object
		this.apply(inst, arguments);

		// Return the new object
		return inst;
	};



	var x = 0;
	var GradientCanvas = CoreObject.extend( {
		init: function( $element, $scope, restrictX ) {

			// this.type = type;
			// this.restrictX = restrictX;
			this.offset = {
				x: null,
				y: null
			};
			// Colors values are 0-255, thus we need the height to be 255.
			this.height = 256;

			this.type = this.type || "gCanvas";

			this.id = 'gCanvas('+ this.type + ')_' + ( ++x ) + '_' + Date.now();

			// The element
			this.$element = $element;
			this.$element.prop('id', this.id );

			// The current scope.  Mainly used for firing events
			this.$scope = $scope;

			// The canvas, the context, and the marker.
			this.canvas = this.$element.children()[0];
			this.context = this.canvas.getContext('2d');

			this.marker = this.$element.children()[1];

			// The current color.
			//this.color = $scope.data.color || tinycolor('#f00');

			// Set the dimensions
			this.$element.css({'height': this.height + 'px'});
			this.canvas.height = this.height;
			this.canvas.width = this.height;

			//console.log("G CANVAS INIT", this, this.$scope );

			this.boundEvents = {
				onMouseDown: angular.bind( this, this.onMouseDown ),
				mouseMove: angular.bind( this, this.onMouseMove ),
				onColorSet: angular.bind( this, this.onColorSet ),
				draw: angular.bind( this, this.draw )
			};

			// Events
			this.$element.on( 'touchstart mousedown', this.boundEvents.onMouseDown );
		//	this.$scope.$on( 'mdColorPicker:colorSet', this.boundEvents.onColorSet );

			this.$scope.data.hsva = this.$scope.data.hsva || this.$scope.data.color.toHsv();
			if ( this.$scope.data.hsva.a === undefined ) {
				this.$scope.data.hsva.a = this.$scope.data.color.getAlpha();
			}
			var initialValueWatch = this.$scope.$watch('data.color', angular.bind( this, function(color) {
				if ( color === undefined ) {
					return;
				}
				this.$scope.data.hsva.h = color.toHsv().h;
				initialValueWatch();
			 } ), true );
			 this.$scope.$watch('data.color', this.boundEvents.onColorSet, true );
		}
	});
	GradientCanvas.prototype.$window = angular.element( window );

	GradientCanvas.prototype.applyHueLock = false;

	/**
	 * GradientCanvas.prototype.draw - Overwrite this in sub class.  Will fill with a "troublesome pink"
	 *
	 * @return {type}  description
	 */
	GradientCanvas.prototype.draw = function() {
		this.context.fillStyle = '#ff00ff';
		this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
	};


	/**
	 * GradientCanvas.prototype.getColorByMouse - Returns the color under the mouse.
	 *
	 * @param  {Event} e Mouse or Touch Event
	 * @return {Color}
	 */
	GradientCanvas.prototype.getMouseCoordinates = function( e ) {

		var te =  e.touches && e.touches[0];

		var pageX = te && te.clientX || e.clientX;
		var pageY = te && te.clientY || e.clientY;

		// console.log( e, pageX, this.offset.x );
		var x = Math.round( pageX - this.offset.x );
		var y = Math.round( pageY - this.offset.y );

		return this.adjustXY( x, y );
	};

	GradientCanvas.prototype.getColorByPoint = function( x, y ) {
		// Stub
	};

	GradientCanvas.prototype.onMouseDown = function( e ) {

		// Prevent highlighting
		e.preventDefault();
		e.stopImmediatePropagation();

		this.$scope.previewUnfocus();

		this.$element.css({ 'cursor': 'none' });

		this.offset.x = this.canvas.getBoundingClientRect().left;
		this.offset.y = this.canvas.getBoundingClientRect().top;

		this.$window.on('touchmove mousemove', this.boundEvents.mouseMove );
		this.$window.one('touchend mouseup', angular.bind(this, function (e) {
			this.$window.off('touchmove mousemove', this.boundEvents.mouseMove);
			this.$element.css({ 'cursor': 'crosshair' });
		}));

		// Set the color on click ( mouse down )
		this.onMouseMove( e );
	};

	GradientCanvas.prototype.onMouseMove = function( e ) {
		var coords = this.getMouseCoordinates( e );
		var color = this.getColorByPoint( coords.x, coords.y );

		this.$scope.$apply( angular.bind( this, function() {
			this.$scope.data.color = tinycolor( color );
			this.$scope.data.color.setAlpha( color.a );
			this.$scope.data.hsva = color;
			// console.log( this.$scope.data.hsva.h );
		}));

		this.setMarkerCenter( coords.x, coords.y );
	};

	GradientCanvas.prototype.setMarkerCenter = function( x, y ) {

		var xOffset = -1 * this.marker.offsetWidth / 2;
		var yOffset = -1 * this.marker.offsetHeight / 2;
		var xAdjusted, xFinal, yAdjusted, yFinal;

		if ( y === undefined ) {
			y = x;
			x = 0;
		}

		var coords = this.adjustXY( x, y );
		x = coords.x;
		y = coords.y;

		xAdjusted = x + xOffset;
		yAdjusted = y + yOffset;

		if ( y === undefined || this.ignoreX ) {
			xFinal = 0;
			yFinal = Math.round( Math.max( Math.min( this.height-1 + yOffset, yAdjusted), yOffset ) );
			// Debug output
			// console.log( "Raw: ", x+','+y, "Adjusted: ", xAdjusted + ',' + yAdjusted, "Final: ", xFinal + ',' + yFinal );
		} else {
			xFinal = Math.floor( Math.max( Math.min( this.height + xOffset, xAdjusted ), xOffset ) );
			yFinal = Math.floor( Math.max( Math.min( this.height + yOffset, yAdjusted ), yOffset ) );
		}

		angular.element(this.marker).css({'left': xFinal + 'px' });
		angular.element(this.marker).css({'top': yFinal + 'px'});
	};

	GradientCanvas.prototype.getMarkerCenter = function() {
		var returnObj = {
			x: this.marker.offsetLeft + ( Math.floor( this.marker.offsetWidth / 2 ) ),
			y: this.marker.offsetTop + ( Math.floor( this.marker.offsetHeight / 2 ) )
		};
		return returnObj;
	};

	GradientCanvas.prototype.getImageData = function( x, y ) {
		// Stub
	};

	GradientCanvas.prototype.adjustXY = function( x, y ) {
		x = Math.max( 0, Math.min( x, this.canvas.width ) );
		y = Math.max( 0, Math.min( y, this.canvas.height ) );

		return { x: x, y: y };
	};






	var HueGradientCanvas =  GradientCanvas.extend({
		init: function ($element, color) {
			this.type = 'hue';
			this.ignoreX = true;

			GradientCanvas.apply( this, arguments );

			this.draw();
		},
		draw: function() {
			// Create gradient
			var hueGrd = this.context.createLinearGradient(90, 0.000, 90, this.height);

			// Add colors
			hueGrd.addColorStop(0,      'rgba(255, 0, 0, 1.000)');
			hueGrd.addColorStop(1/6,    'rgba(255, 255, 0, 1.000)');
			hueGrd.addColorStop(2/6,    'rgba(0, 255, 0, 1.000)');
			hueGrd.addColorStop(3/6,    'rgba(0, 255, 255, 1.000)');
			hueGrd.addColorStop(4/6,    'rgba(0, 0, 255, 1.000)');
			hueGrd.addColorStop(5/6,    'rgba(255, 0, 255, 1.000)');
			hueGrd.addColorStop(1,      'rgba(255, 0, 0, 1.000)');

			// Fill with gradient
			this.context.fillStyle = hueGrd;
			this.context.fillRect( 0, 0, this.canvas.width, this.height );
		},
		getColorByPoint: function( x, y ) {
			var currentHSV = this.$scope.data.color.toHsv();
			var h = 360 * ( y / this.height );
			var s = currentHSV.s;
			var v = currentHSV.v;
			var a = this.$scope.data.color.getAlpha();

			return {
				h: h,
				s: s,
				v: v,
				a: a
			};
		},
		onColorSet: function( e, args ) {
			var hue = this.$scope.data.hsva.h || this.$scope.data.color.toHsv().h;
			this.setMarkerCenter( this.canvas.height * ( hue / 360 ) );
		}

	});



	var AlphaGradientCanvas = GradientCanvas.extend({
		init: function( $element, $scope ) {
			this.type = 'alpha';
			this.ignoreX = true;

			GradientCanvas.apply( this, arguments );

			this.$scope.$watch( 'data.color', this.boundEvents.draw, true );
		},

		draw: function ()  {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			// Create gradient
			var hueGrd = this.context.createLinearGradient(90, 0.000, 90, this.height);
			var colorRGB = this.$scope.data.color.toRgb();

			// Add colors
			hueGrd.addColorStop(0,	'rgba(' + colorRGB.r + ',' + colorRGB.g + ',' + colorRGB.b + ', 1.000)');
			hueGrd.addColorStop(1,	'rgba(' + colorRGB.r + ',' + colorRGB.g + ',' + colorRGB.b + ', 0.000)');

			// Fill with gradient
			this.context.fillStyle = hueGrd;
			this.context.fillRect( 0, 0, this.canvas.width, this.height );
		},
		getColorByPoint: function( x, y ) {
			var currentHSV = this.$scope.data.color.toHsv();
			var h = currentHSV.h;
			var s = currentHSV.s;
			var v = currentHSV.v;
			var a = ( this.height - y ) / this.height;

			return {
				h: h,
				s: s,
				v: v,
				a: a
			};
		},
		onColorSet: function( e, args ) {
			//console.log('alpha onColorSet', this.$scope.data.color);
			//this.draw();

			var alpha = this.$scope.data.color.getAlpha();
			this.$scope.data.hsva.a = alpha;
			var pos = this.canvas.height - ( this.canvas.height * alpha );

			this.setMarkerCenter( pos );
		}
	});


	var SpectrumGradientCanvas = GradientCanvas.extend({
		init: function( $element, $scope ) {
			this.type = 'spectrum';

			GradientCanvas.apply( this, arguments );

		},
		draw: function() {
			// console.log("DRAWING SPECTRUM!");
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);


			// White gradient
			var whiteGrd = this.context.createLinearGradient(0, 0, this.canvas.width, 0);


			whiteGrd.addColorStop(0.01, 'rgba(255, 255, 255, 1.000)');
			whiteGrd.addColorStop(0.99, 'rgba(255, 255, 255, 0.000)');

			// Black Gradient
			var blackGrd = this.context.createLinearGradient(0, 0, 0, this.canvas.height);


			blackGrd.addColorStop(0.01, 'rgba(0, 0, 0, 0.000)');
			blackGrd.addColorStop(0.99, 'rgba(0, 0, 0, 1.000)');

			// Fill with solid
			// console.log( "DRAW HUE", this.$scope.data );
			this.context.fillStyle = 'hsl( ' + this.$scope.data.hsva.h + ', 100%, 50%)';
			this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );

			// Fill with white
			this.context.fillStyle = whiteGrd;
			this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );

			// Fill with black
			// Odd bug prevented selecting min, max ranges from all gradients
			this.context.fillStyle = blackGrd;
			this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
		},
		getColorByPoint: function( x, y ) {
			var currentHSV = this.$scope.data.color.toHsv();
			var h = this.$scope.data.hsva.h;
			var s =  x / this.height;
			var v = ( this.height - y ) / this.height;
			var a = this.$scope.data.hsva.a;

			return {
				h: h,
				s: s,
				v: v,
				a: a
			};
		},
		onColorSet: function( e, args ) {
			// console.log( 'SET SPECTRUM COLOR', this.$scope.data );
			var hsv = this.$scope.data.color.toHsv();
			this.currentHue = this.$scope.data.hsva.h || hsv.h;
			this.draw();

			var posX = this.canvas.width * hsv.s;
			var posY = this.canvas.height - ( this.canvas.height * hsv.v );

			this.setMarkerCenter( posX, posY );
		},
		setColor: function( color ) {
			this.draw();
		}
	});





	var WheelGradientCanvas = SpectrumGradientCanvas.extend({
		init: function( $element, $scope ) {
			this.gray = 255;
			this.type = 'wheel';

			GradientCanvas.apply( this, arguments );

			// Initial (and only) drawing
			this.draw();
		},
		draw: function() {
			this.context.clearRect(0, 0, this.width, this.height);

			var r = this.height / 2;

			var PI = Math.PI;
			var TWO_PI = PI * 2;

			new ConicalGradient()
				.addColorStop(0    , [255, 0, 0])		// Red
				.addColorStop(1 / 6, [255, 255, 0])		// Yellow
				.addColorStop(2 / 6, [0, 255, 0])		// Green
				.addColorStop(3 / 6, [0, 255, 255])		// Cyan
				.addColorStop(4 / 6, [0, 0, 255])		// Blue
				.addColorStop(5 / 6, [255, 0, 255])		// Violet
				.addColorStop(1    , [255, 0, 0])		// Red
				.fill( this.context, r, r, r, ( PI / 180 ), ( PI / 180 ), false);

			// console.log( "DRAW WHEEL", this.$scope.data );
			var grayValueString = '255,255,255'; //'' + grayValue + ',' + grayValue + ',' + grayValue;
			var centerGradient = this.context.createRadialGradient( r, r, r, r, r, 0 );
			centerGradient.addColorStop( 0, 'rgba( 255,255,255, 0 )' );
			centerGradient.addColorStop( 1, 'rgba( 255,255,255, 1 )' );

			this.context.fillStyle = centerGradient;
			this.context.fillRect( 0, 0, this.height, this.height );

		},

		getColorByPoint: function( x, y ) {
			var adjusted = this.adjustXY(x, y);

			var PI = Math.PI;

			var xCart = adjusted.x - ( this.height / 2 );
			var yCart = adjusted.y - ( this.height / 2 );

			var s = Math.min( 1, Math.sqrt( xCart * xCart + yCart * yCart ) / ( this.height / 2 ) ) ;

			var h = Math.atan2( yCart, xCart ) * ( 180 / PI );

			// atan2 works in -180..180 so we need to recitify the negatives
			h = (h > 0 ? h : 360 + h);

			var v = this.$scope.data.hsva.v;
			var a = this.$scope.data.hsva.a;

			return {
				h: h,
				s: s,
				v: v,
				a: a
			};

		},

		/**
		 * adjustXY - Limit the mouse coordinates to with in the wheel.
		 *
		 * @param  {Int} x description
		 * @param  {Int} y description
		 * @return {Object}
		 */
		adjustXY: function( x, y ) {
			var radius = this.height / 2;
			var scale = radius;

			// Plot the values on a cartesian plane
			var xCart = x - radius;// * radius;
			var yCart = y - radius;// * radius;

			// Get the absolute values for comparison
			var xCartAbs = Math.abs( xCart );
			var yCartAbs = Math.abs( yCart );

			// Get the radius of the cartesian plot
			var radiusCart = Math.min( this.height / 2, Math.sqrt( xCart * xCart + yCart * yCart ));

			var xAdjusted = x;
			var yAdjusted = y;

			// Calculate the angle of the cartesian plot
			if ( radiusCart >= radius ) {
				var theta = Math.atan2( yCart, xCart );

				// Get the new x,y plot inside the circle using the adjust radius from above
				var xCoord = radius * Math.cos( theta );
				var yCoord = radius * Math.sin( theta );

				// Center in SVG
				xAdjusted = xCoord + radius;
				yAdjusted = yCoord + radius;
			}

			return { x: xAdjusted, y: yAdjusted };
		},
		onColorSet: function( e, args ) {
			var hsv = this.$scope.data.hsva;
			var hsl = this.$scope.data.color.toHsl();

			var hue = hsv.h;
			var sat = hsv.s;
			var val = hsv.v;

			var PI = Math.PI;
			var TWO_PI = PI * 2;

			var radius = ( this.height / 2 ) * hsv.s;

			// Calculate the angle of the cartesian plot
			var theta = hue * ( PI / 180 );

			// Get the new x,y plot inside the circle using the adjust radius from above
			var xCoord = radius * Math.cos( theta );
			var yCoord = radius * Math.sin( theta );

			xCoord = xCoord + this.height / 2;
			yCoord = yCoord + this.height / 2;

			//this.draw();
			this.setMarkerCenter( xCoord, yCoord );

		//	this.$scope.$emit('mdColorPicker:wheelChange', { color: this.color });
		},
		setColor: function( color ) {
			// console.log( 'wheel', color );

			//this.$scope.$broadcast('mdColorPicker:colorChange', { color: color });
		}
	});



	var ValueGradientCanvas = GradientCanvas.extend({
		init: function ($element, $scope) {

			this.type = 'value';
			this.ignoreX = true;

			GradientCanvas.apply( this, arguments );

			this.$scope.$watch( 'data.color', this.boundEvents.draw, true );
		},
		draw: function() {
			this.context.clearRect(0, 0, this.width, this.height);

			// Create gradient
			var grayGrd = this.context.createLinearGradient(90, 0.000, 90, this.height);
			var hsv = this.$scope.data.hsva;
			var color = tinycolor({ h: hsv.h, s: hsv.s, v: 100});

			// Add colors
			grayGrd.addColorStop(0,	color.toRgbString());
			grayGrd.addColorStop(1, 	'rgba(0,0,0,1)');

			// Fill with gradient
			this.context.fillStyle = grayGrd;
			this.context.fillRect( 0, 0, this.canvas.width, this.height );

		},
		getColorByPoint: function( x, y ) {
			var h = this.$scope.data.hsva.h;
			var s = this.$scope.data.hsva.s;
			var v = ( this.height - y ) / this.height;
			var a = this.$scope.data.hsva.a;

			return {
				h: h,
				s: s,
				v: v,
				a: a
			};
		},
		onColorSet: function( e, args ) {
			// console.log( "DATA.COLOR CHANGE... setting", this.$scope.data.color.toHsv(), this.$element, e, args, arguments);
			this.draw();

			var hsv = this.$scope.data.color.toHsv();
			this.$scope.data.hsva.v = hsv.v;
			
			var y = this.canvas.height - ( this.canvas.height * hsv.v );
			this.setMarkerCenter( y );
		}
	});






	function GradientCanvasFactory(  ) {


		return function(canvasConstructor) {
			return {
				template: '<canvas width="100%" height="100%"></canvas><div class="md-color-picker-marker"></div>',
				link: function( $scope, $element, $attrs ) {
					// Create new instance of the gradient so the same gradient canvases can be used on separate tabs.
					var gCanvas = new canvasConstructor( $element, $scope );
				}
			};
		};

	}

	angular.module('mdColorPickerGradientCanvas',[])
 		.factory('mdColorGradientCanvas', GradientCanvasFactory )
 		.directive( 'mdColorPickerHue', ['mdColorGradientCanvas', function( mdColorGradientCanvas ) { return new mdColorGradientCanvas( HueGradientCanvas ); }])
 		.directive( 'mdColorPickerAlpha', ['mdColorGradientCanvas', function( mdColorGradientCanvas ) { return new mdColorGradientCanvas( AlphaGradientCanvas ); }])
 		.directive( 'mdColorPickerSpectrum', ['mdColorGradientCanvas', function( mdColorGradientCanvas ) { return new mdColorGradientCanvas( SpectrumGradientCanvas); }])
 		.directive( 'mdColorPickerWheel', ['mdColorGradientCanvas', function( mdColorGradientCanvas ) { return new mdColorGradientCanvas( WheelGradientCanvas); }])
		.directive( 'mdColorPickerValue', ['mdColorGradientCanvas', function( mdColorGradientCanvas ) { return new mdColorGradientCanvas( ValueGradientCanvas); }])




	;
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

angular.module('mdColorPicker')
		.config(['$mdColorPickerConfigProvider', function( $mdColorPickerConfig ) {



			var genericPalette = {
				name: 'genericPalette',
				icon: 'view_module.svg',
				template: '<div layout="column" layout-align="space-between start center" flex class="md-color-picker-palette"></div>',//'tabs/colorSliders.tpl.html',
				link: function( $scope, $element ) {
					// console.log( "LINK GENERICA PALETTE", this  );
					var paletteContainer = angular.element( $element[0].querySelector('.md-color-picker-palette') );
					var paletteRow = angular.element('<div class="flex-15 layout-row layout-align-space-between" layout-align="space-between" layout="row" style="width: 100%;"></div>');
					var paletteCell = angular.element('<div class="flex-10"></div>');
					var materialTitle = angular.element('<div class="md-color-picker-material-title"></div>');
					var materialRow = angular.element('<div class="md-color-picker-with-label"></div>');

					var vm = this;
					var drawTimeout;



					$scope.$watch( angular.bind( vm, function() { return vm.palette; }), angular.bind( vm, function( newVal, oldVal ) {
						// console.log( "NEW GENERIC PALETTE", newVal );
						if ( newVal && ( !oldVal || !angular.equals( newVal, oldVal ) )  ) {
							// Debounce the value so we don't do thise 100 times a second.
							clearTimeout( drawTimeout );
							drawTimeout = setTimeout( angular.bind( this, function() {
								this.palette = newVal;
								this.drawPalette();
							}), 500 );
						}
					}), true );


					this.drawn = [];

					this.removePalette = function() {
						// Remove all rows and unbind cells
						if ( this.drawn.length ) {
							var cells;
							var row;
							while( row = this.drawn.pop() ) {
								cells = row.children();

								for( var y = 0; y < cells.length; y ++ ) {
									var cell = angular.element( cells[y] );
									cell.unbind( 'click' );
									cell.remove();
								}
								row.remove();
							}
						}
					};

					this.drawPalette = function() {
						this.removePalette();
						// console.log( "GENERICA PALETTE DRAW", paletteContainer );

						// Add new rows and bind cells
						angular.forEach(this.palette, function( value, key ) {
							var row = paletteRow.clone();
							this.drawn.push( row );
							angular.forEach( value, function( color ) {
								var cell = paletteCell.clone();
								cell.css({
									height: '25.5px',
									backgroundColor: color
								});
								cell.bind('click', angular.bind( this, function( e ) {
									this.setPaletteColor( e, $scope );
								}));

								row.append( cell );
							}, this);

							paletteContainer.append( row );
						}, this);
					};
					// console.log( "GENERICA PALETTE INIT");
					this.drawPalette();

					$scope.$on('$destroy', angular.bind( this, function() {
						// console.log("Removing Palette on destroy");
						this.removePalette();
					}));
				},
				palette: [
					["rgb(255, 204, 204)","rgb(255, 230, 204)","rgb(255, 255, 204)","rgb(204, 255, 204)","rgb(204, 255, 230)","rgb(204, 255, 255)","rgb(204, 230, 255)","rgb(204, 204, 255)","rgb(230, 204, 255)","rgb(255, 204, 255)"],
					["rgb(255, 153, 153)","rgb(255, 204, 153)","rgb(255, 255, 153)","rgb(153, 255, 153)","rgb(153, 255, 204)","rgb(153, 255, 255)","rgb(153, 204, 255)","rgb(153, 153, 255)","rgb(204, 153, 255)","rgb(255, 153, 255)"],
					["rgb(255, 102, 102)","rgb(255, 179, 102)","rgb(255, 255, 102)","rgb(102, 255, 102)","rgb(102, 255, 179)","rgb(102, 255, 255)","rgb(102, 179, 255)","rgb(102, 102, 255)","rgb(179, 102, 255)","rgb(255, 102, 255)"],
					["rgb(255, 51, 51)","rgb(255, 153, 51)","rgb(255, 255, 51)","rgb(51, 255, 51)","rgb(51, 255, 153)","rgb(51, 255, 255)","rgb(51, 153, 255)","rgb(51, 51, 255)","rgb(153, 51, 255)","rgb(255, 51, 255)"],
					["rgb(255, 0, 0)","rgb(255, 128, 0)","rgb(255, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 128)","rgb(0, 255, 255)","rgb(0, 128, 255)","rgb(0, 0, 255)","rgb(128, 0, 255)","rgb(255, 0, 255)"],
					["rgb(235, 0, 0)","rgb(235, 118, 0)","rgb(235, 235, 0)","rgb(0, 235, 0)","rgb(0, 235, 118)","rgb(0, 235, 235)","rgb(0, 118, 235)","rgb(0, 0, 235)","rgb(118, 0, 235)","rgb(235, 0, 235)"],
					["rgb(214, 0, 0)","rgb(214, 108, 0)","rgb(214, 214, 0)","rgb(0, 214, 0)","rgb(0, 214, 108)","rgb(0, 214, 214)","rgb(0, 108, 214)","rgb(0, 0, 214)","rgb(108, 0, 214)","rgb(214, 0, 214)"],
					["rgb(163, 0, 0)","rgb(163, 82, 0)","rgb(163, 163, 0)","rgb(0, 163, 0)","rgb(0, 163, 82)","rgb(0, 163, 163)","rgb(0, 82, 163)","rgb(0, 0, 163)","rgb(82, 0, 163)","rgb(163, 0, 163)"],
					["rgb(92, 0, 0)","rgb(92, 46, 0)","rgb(92, 92, 0)","rgb(0, 92, 0)","rgb(0, 92, 46)","rgb(0, 92, 92)","rgb(0, 46, 92)","rgb(0, 0, 92)","rgb(46, 0, 92)","rgb(92, 0, 92)"],
					["rgb(255, 255, 255)","rgb(205, 205, 205)","rgb(178, 178, 178)","rgb(153, 153, 153)","rgb(127, 127, 127)","rgb(102, 102, 102)","rgb(76, 76, 76)","rgb(51, 51, 51)","rgb(25, 25, 25)","rgb(0, 0, 0)"]
				]
			};

			$mdColorPickerConfig.tabs.add( genericPalette, 14 );
			//$mdColorPickerConfig.tabs.order.push( 'genericPalette' );

		}]);
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

angular.module('mdColorPicker')
		.config(['$mdColorPalette', '$mdColorPickerConfigProvider', function( $mdColorPalette, $mdColorPickerConfig ) {

			$mdColorPickerConfig.tabs.add({
				name: 'materialPalette',
				icon: 'view_headline.svg',
				template: '<div layout="column" layout-fill flex class="md-color-picker-material-palette"></div>',
				link: function( $scope, $element ) {
					// console.log("Draw material Palette", this.palette );
					var materialContainer = angular.element( $element[0].querySelector('.md-color-picker-material-palette') );
					var materialTitle = angular.element('<div class="md-color-picker-material-title"></div>');
					var materialRow = angular.element('<div class="md-color-picker-with-label"></div>');

					this.drawPalette = function() {
						// console.log('Draw Material Palette', this, this.palette );
						angular.forEach(this.palette, function( value, key ) {

							var title = materialTitle.clone();
							title.html('<span>'+key.replace('-',' ')+'</span>');
							title.css({
								height: '75px',
								backgroundColor: value[500]
							});
							if ( $scope.isDark(value['500']) ) {
								title.addClass('dark');
							}

							materialContainer.append( title );

							angular.forEach( value, function( color, label ) {
								if ( /[A\d]/g.test( label ) ) {
									var row = materialRow.clone();
									row.css({
										height: '33px',
										backgroundColor: color
									});
									if ( $scope.isDark(color) ) {
										row.addClass('dark');
									}

									row.html('<span>'+label+'</span>');
									row.on('click', angular.bind( this, function( e ) {
										this.setPaletteColor( e, $scope );
									}));
									materialContainer.append( row );
								}
							}, this);


						}, this);
					};

					this.drawPalette();
				},
				palette: angular.copy( $mdColorPalette )

			}, false);


		}])
		// .run( ['$timeout','$mdColorPickerConfig', function( $timeout, $mdColorPickerConfig ) {
		// 	$timeout( function() {
		// 		$mdColorPickerConfig.tabs.order.push( 'materialPalette' );
		// 	}, 5000, true);
		//
		// 	$timeout( function() {
		// 		var idx = $mdColorPickerConfig.tabs.order.indexOf( 'materialPalette' );
		// 		$mdColorPickerConfig.tabs.order.splice( idx, 1 );
		// 	}, 10000, true);
		// }])
		;
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

angular.module('mdColorPicker')
		.config(['$mdColorPickerHistoryProvider', '$mdColorPickerConfigProvider', function( $mdColorPickerHistory, $mdColorPickerConfig ) {

			$mdColorPickerConfig.tabs.add({
				name: 'historyPalette',
				icon: 'history.svg',
				templateUrl: 'tabs/historyPalette.tpl.html',
				link: function( $scope, $element ) {
					// console.log( 'HISTORY PALETTE: ', this.palette );
					var historyContainer = angular.element( $element[0].querySelector('.md-color-picker-history') );
					var paletteRow = angular.element('<div class="flex-15 layout-row" style="width: 100%;"></div>');
					var paletteCell = angular.element('<div class=""><div></div></div>');

					var drawTimeout;
					this.palette = $mdColorPickerHistory.get();

					$scope.$watch( angular.bind( this, function() { return $mdColorPickerHistory.get() } ), angular.bind( this, function( newVal, oldVal ) {
						// console.log( 'NEW HISTORY', newVal );
						if ( newVal && ( !oldVal == [] || !angular.equals( newVal, oldVal ) )  ) {

							// Debounce the value so we don't do thise 100 times a second.
							clearTimeout( drawTimeout );
							drawTimeout = setTimeout( angular.bind( this, function() {
								this.palette = newVal;
								this.drawPalette();
							}), 500 );
						}
					}), true );



					this.drawn = [];
					this.drawPalette = function() {
						// console.log( "DRAWING HISTORY");
						var row;
						// Remove all rows and unbind cells
						if ( this.drawn.length ) {
							var cells;

							while( row = this.drawn.pop() ) { // jshint ignore:line
								cells = row.children();
								// console.log( "REMOVING" );
								for( var y = 0; y < cells.length; y ++ ) {
									var cell = angular.element( cells[y] );
									cell.off( 'click' );
									cell.remove();
								}
								row.remove();
							}
						}

						//var row;// = paletteRow.clone();
						angular.forEach( this.palette, function( color, i ) {

							if ( i % 10 === 0 ) {
								row = paletteRow.clone();
								historyContainer.append( row );
								this.drawn.push( row );
							}

							var cell = paletteCell.clone();
							cell.find('div').css({
								//height: '25.5px',
								backgroundColor: color.toRgbString()
							});
							cell.on('click', angular.bind( this, function( e ) {
								this.setPaletteColor( e, $scope );
							}));

							row.append( cell );
						}, this);

						/*
						<div flex="10" ng-repeat="historyColor in data.history.get() track by $index">
							<div  ng-style="{'background': historyColor.toRgbString()}" ng-click="setPaletteColor($event)"></div>
						</div>
						*/




					};

					this.drawPalette();
				},
				palette: $mdColorPickerHistory.get()

			}, 2 );
			//$mdColorPickerConfig.tabs.order.push( 'historyPalette' );

		}]);
}(window, window.angular, window.tinycolor));

;(function(window, angular, TinyColor, undefined) {
"use strict";

angular.module('mdColorPicker').run(['$templateCache', function($templateCache) {$templateCache.put('mdColorPicker.tpl.html','<div class="md-color-picker-input-container" layout="row">\n\t<md-color-picker-preview ng-click="$ctrl.options.openOnPreviewClick && $ctrl.showColorPicker($event)" ng-model="data.color"></md-color-picker-preview>\n\t<md-input-container class="md-icon-left md-icon-right" flex >\n\t\t<label><md-icon ng-if="transcluded_content[\'mdIcon\']">{{ transcluded_content[\'mdIcon\'].innerHTML }}</md-icon><span ng-transclude="label">{{ $ctrl.placeholder }}</span></label>\n\t\t<input type="text" ng-model="data.color" class=\'md-color-picker-input\' ng-required="$ctrl.isRequired" ng-mousedown="$ctrl.options.openOnInputClick && $ctrl.showColorPicker($event)"/>\n\t</md-input-container>\n\t<md-color-picker-clear></md-color-picker-clear>\n</div>\n<pre>{{ $ctrl.options | json }}</pre>\n');
$templateCache.put('mdColorPickerContainer.tpl.html','<div class="md-color-picker-container in" layout="column">\n\t<div class="md-color-picker-arrow" ng-style="{\'border-bottom-color\': data.color.toRgbString() }"></div>\n\n\t<div class="md-color-picker-preview md-color-picker-checkered-bg" ng-class="{\'dark\': !data.color.isDark() || data.color.getAlpha() < .45}" flex="1" layout="column">\n\n\t\t<div class="md-color-picker-result" ng-style="{\'background\': value}" flex="100" layout="column" layout-fill layout-align="center center" ng-click="focusPreviewInput( $event )">\n\t\t\t<!--<span flex  layout="column" layout-align="center center">{{value}}</span>-->\n\t\t\t<div flex  layout="row" layout-align="center center">\n\t\t\t\t<input class="md-color-picker-preview-input" type="text" ng-model="value" ng-model-options="{updateOn: \'blur\'}" ng-blur="previewBlur()"  />\n\t\t\t</div>\n\t\t\t<div class="md-color-picker-tabs" style="width: 100%">\n\t\t\t\t<md-tabs md-selected="config.selectedNotation" md-stretch-tabs="always" md-no-bar md-no-ink md-no-pagination="true" >\n\t\t\t\t\t<md-tab ng-repeat="notation in config.notations.get()"  ng-disabled="notation.disabled(data.color)" label="{{notation.name}}"></md-tab>\n\t\t\t\t</md-tabs>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div class="md-color-picker-tabs md-color-picker-colors">\n\t\t<md-tabs md-stretch-tabs="always" md-align-tabs="bottom" md-selected="config.currentTab" md-no-pagination>\n\t\t\t<md-tab ng-repeat="tabName in config.tabOrder">\n\t\t\t\t<md-tab-label>\n\t\t\t\t\t<md-icon md-svg-icon="{{ config.tabs[ tabName ].icon }}"></md-icon>\n\t\t\t\t</md-tab-label>\n\t\t\t\t<md-tab-body>\n\t\t\t\t\t<div layout="row" layout-align="space-between" style="height: 255px">\n\t\t\t\t\t\t<!-- Tab Template will be added here -->\n\t\t\t\t\t</div>\n\t\t\t\t</md-tab-body>\n\t\t\t</md-tab>\n\n\t\t</md-tabs>\n\t</div>\n\n</div>\n');
$templateCache.put('mdColorPickerDialog.tpl.html','<md-dialog class="md-color-picker-dialog">\n\t<div md-color-picker-container\n\t\tng-model="value"\n\t\tdefault="{{defaultValue}}"\n\t\trandom="::random"\n\t\tok="ok"\n\t\tmd-color-alpha-channel="mdColorAlphaChannel"\n\t\tmd-color-spectrum="mdColorSpectrum"\n\t\tmd-color-sliders="mdColorSliders"\n\t\tmd-color-generic-palette="mdColorGenericPalette"\n\t\tmd-color-material-palette="mdColorMaterialPalette"\n\t\tmd-color-history="mdColorHistory"\n\t\tmd-color-hex="mdColorHex"\n\t\tmd-color-rgb="mdColorRgb"\n\t\tmd-color-hsl="mdColorHsl"\n\t\tmd-color-default-tab="mdColorDefaultTab"\n\t></div>\n\t<md-actions layout="row">\n\t\t<div style="width: 50%; text-align: center;"><md-button class="md-mini" ng-click="close()" flex>Cancel</md-button></div>\n\t\t<div style="width: 50%; text-align: center;"><md-button class="md-mini" ng-click="ok()" flex>Select</md-button></div>\n\t</md-actions>\n</md-dialog>\n');
$templateCache.put('mdColorPickerPanel.tpl.html','\n\t<div md-color-picker-container\n\t\tng-model="value"\n\t></div>\n\t<div layout="row">\n\t\t<div style="width: 50%; text-align: center;"><md-button class="md-mini" ng-click="close()" flex>{{ opts.cancelLabel }}</md-button></div>\n\t\t<div style="width: 50%; text-align: center;"><md-button class="md-mini" ng-click="ok()" style="width:100%;">{{ opts.selectLabel }}</md-button></div>\n\t</div>\n');
$templateCache.put('tabs/colorSliders.tpl.html','<div layout="column" flex="100" layout-fill layout-align="space-between start center" class="md-color-picker-sliders">\n\t<div layout="row" layout-align="start center" layout-wrap flex layout-fill>\n\t\t<div flex="10" layout layout-align="center center">\n\t\t\t<span class="md-body-1">R</span>\n\t\t</div>\n\t\t<md-slider flex="65" min="0" max="255" step="1" ng-model="data.color._r" aria-label="red" class="red-slider"></md-slider>\n\t\t<span flex></span>\n\t\t<div flex="20" layout layout-align="center center">\n\t\t\t<input style="width: 100%;" min="0" max="255" step="1" type="number" ng-model="data.color._r" aria-label="red" aria-controls="red-slider">\n\t\t</div>\n\t</div>\n\t<div layout="row" layout-align="start center" layout-wrap flex layout-fill>\n\t\t<div flex="10" layout layout-align="center center">\n\t\t\t<span class="md-body-1">G</span>\n\t\t</div>\n\t\t<md-slider flex="65" min="0" max="255" step="1" ng-model="data.color._g" aria-label="green" class="green-slider"></md-slider>\n\t\t<span flex></span>\n\t\t<div flex="20" layout layout-align="center center">\n\t\t\t<input style="width: 100%;" min="0" max="255" step="1" type="number" ng-model="data.color._g" aria-label="green" aria-controls="green-slider">\n\t\t</div>\n\t</div>\n\t<div layout="row" layout-align="start center" layout-wrap flex layout-fill>\n\t\t<div flex="10" layout layout-align="center center">\n\t\t\t<span class="md-body-1">B</span>\n\t\t</div>\n\t\t<md-slider flex="65" min="0" max="255" step="1" ng-model="data.color._b" aria-label="blue" class="blue-slider"></md-slider>\n\t\t<span flex></span>\n\t\t<div flex="20" layout layout-align="center center" >\n\t\t\t<input style="width: 100%;" min="0" max="255" step="1" type="number" ng-model="data.color._b" aria-label="blue" aria-controls="blue-slider">\n\t\t</div>\n\t</div>\n\t<div layout="row" layout-align="start center" layout-wrap flex layout-fill ng-if="!config.options.useAlpha">\n\t\t<div flex="10" layout layout-align="center center">\n\t\t\t<span class="md-body-1">A</span>\n\t\t</div>\n\t\t<md-slider flex="65" min="0" max="1" step=".01" ng-model="data.color._a" aria-label="alpha" class="md-primary"></md-slider>\n\t\t<span flex></span>\n\t\t<div flex="20" layout layout-align="center center" >\n\t\t\t<input style="width: 100%;" min="0" max="1" step=".01" type="number" ng-model="data.color._a" aria-label="alpha" aria-controls="alpha-slider">\n\t\t</div>\n\t</div>\n</div>\n');
$templateCache.put('tabs/historyPalette.tpl.html','<div layout="column" flex layout-align=" start" layout-wrap layout-fill class="md-color-picker-history">\n\n\n\t<md-button flex-end ng-click="data.history.reset()" class="md-mini md-icon-button md-raised md-accent" aria-label="Clear History">\n\t\t<md-icon md-svg-icon="clear_all.svg"></md-icon>\n\t</md-button>\n</div>\n');}]);
}(window, window.angular, window.tinycolor));
