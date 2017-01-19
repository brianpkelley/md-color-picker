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
 				notations_: {


 				},

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
 					console.log("SELECT", color);
 					var notation = this.get(this.order[0]);
 					var this_ = this;
 					angular.forEach( this.notations_, function( item, i ) {
 						console.log( item );
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
 				 * Holds the order of the notaions to be displayed under the preview.
				 * @member $mdColorPickerConfig#notations#order
				 *
 				 * @default [ 'hex', 'rgb', 'hsl' ]
 				 */
 				 order: [ 'hex', 'rgb', 'hsl' ]


 			};



 			// Default HEX notation object.
 			this.notations.add({
 				name: 'hex',
 				toString: function( color ) {
 					return color.toHexString();
 				},
 				testExp: /#[a-fA-F0-9]{3,6}/,
 				disabled: function( color ) {
 					return color.toRgb().a !== 1;
 				}
 			});

 			// Default RGB notation Object.
 			this.notations.add({
 				name: 'rgb',
 				toString: function( color ) {
 					return color.toRgbString();
 				},
 				test: function( color ) {
 					return color.toLowerCase().search( 'rgb' ) > -1;
 				}
 			});

 			// hsl - Default HSL notation Object.
 			this.notations.add({
 				name: 'hsl',
 				toString: function( color ) {
 					return color.toHslString();
 				},
 				test: function( color ) {
 					return color.toLowerCase().search('hsl') > -1;
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
					console.log( "ADD TAB", tab );
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
					console.log('GET TAB', this);
 					if ( tab ) {
						if ( config === true ) {
							return this.tabs_[tab];
						} else {
							var newTab = new Tab( this.tabs_[ tab ] );
							this.cache_[ tab ] = this.cache_[ tab ] || [];
							this.cache_[ tab ].push( newTab );
	 						return newTab;
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
 					$scope.$watch( 'data.color._a', function( newVal ) {
 						$scope.data.color.setAlpha( newVal );
 					});
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
					skipHide: true,
					targetEvent: undefined

				},
				panel: {
					hasBackdrop: false,
					escapeToClose: true,
					trapFocus: false,
					clickOutsideToClose: true,
					focusOnOpen: true,
					fullscree: false

				},
				mdColorPicker: {
					default: '#FFFFFF',
					tab: 'spectrum',
					alphaChannel: true,
					random: false
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
			console.log( "ADDING ", this.name, "TO CACHE", mdColorPickerConfigRef );
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
			console.log( "DESTRYOING", this );
			if ( this.$element ) {
				this.$element.remove();
				this.$element = undefined;
			}
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
