	var dateClick;

	function getMergedOptions( options, defaults ) {
		//var returnOptions = {};

		angular.forEach( defaults, function( value, key ) {
			options[key] = options[key] === undefined ? value : options[key];
		});
		console.log( "MERGED OPTIONS", options );
		return options
	}

	var coreLinkFn = function( scope, element, attrs, controllers, transclude ) {
		var $ngModel = controllers[0];
		var mdColorPicker = controllers[1];

		mdColorPicker.setNgModelController( $ngModel );

		scope.transcluded_content = {};
		var transclusion_checks = ['placeholder','main', 'mdIcon'];
		angular.forEach( transclusion_checks, function( val ) {
			// console.log("FOR ", val, transclude && transclude.isSlotFilled( val ) );
			if ( transclude && transclude.isSlotFilled( val ) ) {
				transclude(scope, function(clone) {
					// console.log( 'IN TRANSCLUDE', clone );
					if ( clone.length ) {
						scope.transcluded_content[val] = clone[0];
					}

					if ( val === 'main' ) {
						element.empty().append( angular.element( clone ) )
					}
				}, undefined, val );
			} else {
				scope.transcluded_content[val] = false;
			}
		});

		element.on('click', mdColorPicker.showColorPicker );

	};




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
	.controller( 'mdColorPickerController', [ '$scope', '$element', '$attrs', '$mdColorPickerConfig', '$mdColorPickerHistory', '$mdColorPicker', function( $scope, $element, $attrs, $mdColorPickerConfig, $mdColorPickerHistory, $mdColorPicker ) {

		$scope.data = {
			color: undefined
		};

		var vm = this;
		var INITIAL_VALUE;

		/**
		* With <input type="color"> we can only support HEX notations
		*/
		var isInputElement = $element.prop('tagName') === 'INPUT';
		var isColorInput = isInputElement && $element.prop('type').toUpperCase() === 'COLOR';

		var viewParser;
		var viewFormatter;
		var $ngModelController;

		this.setNgModelController = function( $ngModel ) {
			$ngModelController = $ngModel;
			$ngModelController.$options = $ngModelController.$options || {};
			$ngModelController.$options.updateOn = 'blur';
			console.log( 'INITIAL $ngModelController.$modelValue', $ngModelController, $scope.value );
			$scope.data.color = $ngModelController.$modelValue;

			/**
			* Originally used $ngModel.parsers and $ngModel.formatters to handle this, but they apply
			* to the ngModel entirely and we need it for only select element types.
			*/
			if ( isInputElement && isColorInput ) {
				// Coming from the DOM
				viewParser = function( value ) {
					console.log( value );
					if ( !value ) {
						value = $scope.default || $mdColorPickerConfig.defaults.mdColorPicker.default;
					}
					console.log( value );
					var formatted = new TinyColor( value ).toHexString();
					console.log( value );
					return formatted;
				};

				// Going to the DOM
				viewFormatter = function( value ) {
					if ( !value ) {
						value = $scope.default || $mdColorPickerConfig.defaults.mdColorPicker.default
					}
					var formatted = new TinyColor( value ).toHexString();
					return formatted;
				};

				$scope.$watch( function() { return $ngModelController.$viewValue; }, function( value ) {
					console.log( 'watch value', value );
					$element[0].value = viewParser( $ngModelController.$viewValue );
				});

			}

		};

		this.updateValue = function( value ) {
			if ( value )  {
				$scope.data.color = value;
			} else {
				$scope.data.color = undefined;
			}
		};

		// Watch for our changes
		$scope.$watch( 'data.color', function( value ) {
			console.log( 'watch data.color', value)
			if ( isInputElement ) {
				$element.val( viewFormatter ? viewFormatter( value ) : value );
				$scope.value = viewFormatter ? viewFormatter( value ) : value;
			}

			$ngModelController.$setViewValue( value );
			$ngModelController.$commitViewValue();

		});

		// Watch for their changes
		$scope.$watch( function() { return $ngModelController.$modelValue; }, this.updateValue );



		this.showColorPicker = function showColorPicker($event) {
			$event.stopImmediatePropagation();
			$event.preventDefault();
			INITIAL_VALUE = $ngModelController.$modelValue;

			var dialogOptions = {
				clickOutsideToClose: $scope.clickOutsideToClose,
				hasBackdrop: $scope.hasBackdrop,
				skipHide: $scope.skipHide,
				preserveScope: $scope.preserveScope,
				$event: $event,
				targetEvent: $event,
				type: 'panel'
			};

			var mdColorPickerOptions = {
				value: INITIAL_VALUE,
				defaultValue: $scope.default,
				random: $scope.random,
				mdColorAlphaChannel: $scope.mdColorAlphaChannel,
				mdColorDefaultTab: $scope.mdColorDefaultTab,
			};


			var colorPicker = $mdColorPicker.show( mdColorPickerOptions, dialogOptions );


			var removeWatch = $scope.$watch( function() { return mdColorPickerOptions.value; }, function( newVal ) {
				vm.updateValue( newVal );
			});

			colorPicker.then(function( color ) {
				removeWatch();
				vm.updateValue( color );
				$mdColorPickerHistory.add( color );

			}, function() {
				removeWatch();
				vm.updateValue( INITIAL_VALUE );
			});


		};




	}])
	.directive('mdColorPickerPreview', [ function() {
		return {
			template: '<div class="md-color-picker-preview md-color-picker-checkered-bg"><div class="md-color-picker-result"></div></div>',
			require: ['^ngModel'],
			restrict: 'AE',
			//	scope: {},
			link: function( $scope, $element, $attrs, controllers ) {
				var $ngModel = controllers[0];
				$scope.$watch( function() { return $ngModel.$modelValue; }, function( newVal ) {
					$element[0].querySelector('.md-color-picker-result').style.backgroundColor = newVal || null;
				});
			}
		};
	}])

	.directive('mdColorPickerClear', [ function() {
		return {
			template: '<md-button class="md-icon-button md-color-picker-clear" aria-label="Clear Color"><md-icon md-svg-icon="clear.svg"></md-icon></md-button>',
			require: ['^mdColorPicker', '^ngModel'],
			scope: {},
			link: function( scope, element, attrs, controllers ) {
				var mdColorPicker = controllers[0];
				var ngModelController = controllers[1];

				element.on( 'click', function( e ) {
					e.preventDefault();
					e.stopImmediatePropagation();

					// ngModelController.$modelValue = undefined;
					scope.$apply( angular.bind( mdColorPicker, function() {
						mdColorPicker.updateValue();
					}));

				});
			}
		};
	}])
	.directive( 'mdColorPicker', ['$mdColorPickerConfig', '$mdColorPickerHistory', '$mdColorPicker', function( $mdColorPickerConfig, $mdColorPickerHistory, $mdColorPicker ) {
		return {
			require: ['^ngModel', 'mdColorPicker'],
			restrict: 'E',
			scope: {
				options: '=?mdColorPicker',
				value: '=ngModel',
			},
			transclude: {
				'main': '?mdColorPickerContent',
				'mdIcon': '?mdIcon',
				'label': '?mdColorPickerLabel',
				'placeholder': '?mdColorPickerPlaceholder'
			},
			templateUrl: 'mdColorPicker.tpl.html',
			controller: 'mdColorPickerController',
			link: coreLinkFn
		};
	}])
	.directive( 'mdColorPicker', ['$mdColorPickerConfig', '$mdColorPickerHistory', '$mdColorPicker', function( $mdColorPickerConfig, $mdColorPickerHistory, $mdColorPicker ) {
		return {
			require: ['^ngModel', 'mdColorPicker'],
			restrict: 'A',
			scope: {
				options: '=?mdColorPicker',
				value: '=ngModel',
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
			},
			controller: 'mdColorPickerController',
			link: coreLinkFn

		};
	}])







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
				show: function( mdColorPickerOptions, containerOptions ) {

					var containerType  = ( containerOptions && containerOptions.type ) || $mdColorPickerConfig.defaults.containerType;
					containerOptions = containerOptions || $mdColorPickerConfig.defaults[ containerType ];

					// mdColorPicker Properties
					mdColorPickerOptions = getMergedOptions( mdColorPickerOptions, $mdColorPickerConfig.defaults.mdColorPicker );

					// Set up overrides for colors
					mdColorPickerOptions.mdColorHex = ((mdColorPickerOptions.mdColorHex === undefined) || (!mdColorPickerOptions.mdColorRgb && !mdColorPickerOptions.mdColorHsl))  ? true : mdColorPickerOptions.mdColorHex;
					mdColorPickerOptions.mdColorAlphaChannel = true; (!mdColorPickerOptions.mdColorRgb && !mdColorPickerOptions.mdColorHsl) ? true : mdColorPickerOptions.mdColorAlphaChannel;

					if ( containerType === 'panel' ) {
						// Get options
						containerOptions = getMergedOptions( containerOptions, $mdColorPickerConfig.defaults.panel );
						// Launch the panel
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
						skipHide: dialogOptions.skipHide,
						targetEvent: dialogOptions.$event,
						focusOnOpen: dialogOptions.focusOnOpen,
						autoWrap: false,
						onShowing: function() {
						},
						onComplete: function() {
						}
					});

					dialog.then(function (value) {
						console.log( "Dialog Close", $mdColorPickerHistory );
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
							hasBackdrop: panelOptions.hasBackdrop,
							clickOutsideToClose: panelOptions.clickOutsideToClose,
							escapeToClose: panelOptions.escapeToClose,
							targetEvent: panelOptions.$event,
							focusOnOpen: panelOptions.focusOnOpen,
							disableParentScroll: false,
							origin: panelOptions.$event.target,
							onDomAdded: function() {
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
