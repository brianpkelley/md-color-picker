(function(window, angular, undefined ) {
	'use strict';
	
	function encodeHTMLEntities( str ) {
		return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#'+i.charCodeAt(0)+';';
		});
	}
	
	function snakeToCamel(s){
		return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
	}
	
	angular.module('plunker', ['ui.router', 'ngMaterial', 'ngCookies', 'mdColorPicker','mdColorPickerConfig'])
		.config(['$stateProvider', '$locationProvider', '$mdThemingProvider', '$mdColorPickerConfigProvider', function($stateProvider, $locationProvider, $mdThemingProvider, $mdColorPickerConfig){
	
			$mdColorPickerConfig.notations.add( {
				name: 'text',
				test: function() { return false; },
				toString: function( color ) {
					// An over simplified example on how to add a custom notation.
					var hue = color.toHsv().h;
					// console.log( color.toHsv() );
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
						return "DarkViolet";
					} else if ( hue >= 300 && hue < 340 ) {
						return "Fuchsia";
					}
				}
			});
		
			
			/*
				APP ROUTES
			*/
			$stateProvider
				.state({
					name: 'elementUsage',
					url: '/element',
					controller: 'viewController',
					controllerAs: '$ctrl',
					templateUrl: 'templates/elementUsage.tpl.html'
				})
				.state({
					name: 'attributeUsage',
					url: '/attribute',
					controller: 'viewController',
					controllerAs: '$ctrl',
					templateUrl: 'templates/attributeUsage.tpl.html'
				})
				.state({
					name: 'notations',
					url: '/notations',
					controller: 'viewController',
					controllerAs: '$ctrl',
					templateUrl: 'templates/notations.tpl.html'
				})
			;
			// $routeProvider
			// 	.when('/',{
			// 		templateUrl: 'templates/elementUsage.tpl.html',
			// 		controller: 'viewController'
			// 	})
			// 	.when('/notations',{
			// 		templateUrl: 'templates/notations.tpl.html',
			// 		controller: 'viewController'
			// 	})
			
			
			// $locationProvider.html5Mode(true);
			
			
			
			$mdThemingProvider.definePalette('mcgpalette0', {
				'50': '#e7e7e7',
				'100': '#c2c2c2',
				'200': '#999999',
				'300': '#707070',
				'400': '#525252',
				'500': '#333333',
				'600': '#2e2e2e',
				'700': '#272727',
				'800': '#202020',
				'900': '#141414',
				'A100': '#525252',
				'A200': '#ffd966',
				'A400': '#ffe599',
				'A700': '#fff2cc',
				'contrastDefaultColor': 'light',
				'contrastDarkColors': [
					'50',
					'100',
					'200',
					'A200',
					'A400',
					'A700'
				],
				'contrastLightColors': [
					'300',
					'400',
					'500',
					'600',
					'700',
					'800',
					'900',
					'A100'
				]
			});
			$mdThemingProvider.definePalette('mcgpalette3', {
				'50': 'f6fae5',
				'100': 'e7f4bf',
				'200': 'd8ec95',
				'300': 'c8e46a',
				'400': 'bcdf4a',
				'500': 'b0d92a',
				'600': 'a9d525',
				'700': 'a0cf1f',
				'800': '97ca19',
				'900': '87c00f',
				'A100': 'f9ffee',
				'A200': 'b0d92a',
				'A400': 'd5ff88',
				'A700': 'ccff6e',
				'contrastDefaultColor': 'light',
				'contrastDarkColors': [
					'50',
					'100',
					'200',
					'300',
					'400',
					'500',
					'600',
					'700',
					'800',
					'900',
					'A100',
					'A200',
					'A400',
					'A700'
				],
				'contrastLightColors': []
			});
			$mdThemingProvider.theme('default')
				.primaryPalette('mcgpalette0')
				.accentPalette('mcgpalette3');
	
		}])
		.controller('viewController', ['$rootScope', '$state', '$templateCache', '$mdColorPickerConfig', function( $rootScope, $state, $templateCache, $mdColorPickerConfig ) {
			var ctrl = this;
			ctrl.examples = {};
			console.log( $rootScope );
			/* This is incredibly lazy... don't judge */
			
			
			var templateHTML = $templateCache.get( $state.current.templateUrl );
			var exampleRegex = /\<\!\-\- Example=[\'"]([\w\-]*?)[\'"] \-\-\>([\s\S]*?)<\!\-\- \/Example \-\-\>/gim;
			var indentRegex = /^(\s*)/;
			// console.log( "APP", templateHTML );
			
			var example;
			// example = exampleRegex.exec( templateHTML );
			// console.log( example );
			// example = exampleRegex.exec( templateHTML );
			// console.log( example );
			while( ( example = exampleRegex.exec( templateHTML ) ) !== null ) {
				// console.log( example );
				var exampleHTML = example[2].replace(/^\n/gm, '');
				var indent = indentRegex.exec( exampleHTML );
				if ( indent[1] ) {
					var indentRemovalRegex = new RegExp( '^\\s{' + indent[1].length + '}', 'gm' );
					exampleHTML = exampleHTML.replace( indentRemovalRegex, '' );
				}
				ctrl.examples[snakeToCamel( example[1] )] = exampleHTML;
			}
			
			// console.log( ctrl.examples );
			setTimeout( PR.prettyPrint, 1 );
			
			switch( $state.current.url ) {
				case '/notations':
					$mdColorPickerConfig.notations.order = ['rgb', 'hsl', 'text', 'hex'];
					break;
			}
			
			$rootScope.$on('$routeChangeStart', function() {
				templateHTML.innerHTML = '';
				templateHTML.parentNode.classList.remove('prettyprinted');
				$rootScope.template = '';
				$mdColorPickerConfig.notations.order = ['rgb', 'hsl', 'hex']
			})
		}])
		.controller('MainCtrl', ['$location', '$rootScope', '$scope', '$mdColorPickerConfig', '$timeout', function( $location, $rootScope, $scope, $mdColorPickerConfig, $timeout ) {
			$scope.$location = $location;
			$rootScope.textConfig = {};
			$rootScope.textConfig.fonts = [
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
			
			$rootScope.textConfig.font = undefined;
			$rootScope.textConfig.foreground = "#a91e1e";
			$rootScope.textConfig.background = undefined;
			$rootScope.textConfig.header = undefined;
			$rootScope.textConfig.code = undefined;
			
			$rootScope.textConfig.backgroundOptions = {
				type: 'dialog',
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
			$rootScope.textConfig.showPreview = true;
			
			// $rootScope.$watch( 'textConfig.textBackground', function( newVal ) {
			// 	if ( !newVal ) { return; }
			// 	var baseColor = tinycolor( newVal ).toHsv();
			// 	baseColor.v = 1;
			// 	baseColor.s = 1;
			//
			// 	//	console.log( baseColor, oldColor );
			//
			// 	var palette = [];
			// 	for ( var x = 0; x < 10; x++ ) {
			// 		var row = [];
			//
			// 		var color = angular.copy( baseColor );
			// 		color.v -= x * .10;
			//
			// 		for ( var y = 0; y < 10; y++ ) {
			// 			var tmp = angular.copy( color );
			// 			tmp.s -= y * .1;
			//
			// 			row.push( new tinycolor( tmp ).toHslString() );
			// 		}
			// 		palette.push( row );
			// 	}
			//
			// 	paletteTabs = $mdColorPickerConfig.tabs.getFromCache('genericPalette');
			// 	console.info( "textConfig.textBackground", newVal, palette );
			//
			// 	angular.forEach( paletteTabs, function( tab ) {
			// 		tab.palette = palette;
			// 	});
			// } , true);
	
	
		}]);
	
	})( window, window.angular );
