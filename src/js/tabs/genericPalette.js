
	angular.module('mdColorPicker')
		.config(['$mdColorPickerConfigProvider', function( $mdColorPickerConfig ) {



			var genericPalette = {
				name: 'genericPalette',
				icon: 'view_module.svg',
				template: '<div layout="column" layout-align="space-between start center" flex class="md-color-picker-palette"></div>',//'tabs/colorSliders.tpl.html',
				link: function( $scope, $element ) {
					console.log( "LINK GENERICA PALETTE", this  );
					var paletteContainer = angular.element( $element[0].querySelector('.md-color-picker-palette') );
					var paletteRow = angular.element('<div class="flex-15 layout-row layout-align-space-between" layout-align="space-between" layout="row" style="width: 100%;"></div>');
					var paletteCell = angular.element('<div class="flex-10"></div>');
					var materialTitle = angular.element('<div class="md-color-picker-material-title"></div>');
					var materialRow = angular.element('<div class="md-color-picker-with-label"></div>');

					var vm = this;
					var drawTimeout;



					$scope.$watch( angular.bind( vm, function() { return vm.palette; }), angular.bind( vm, function( newVal, oldVal ) {
						console.log( "NEW GENERIC PALETTE", newVal );
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
						console.log( "GENERICA PALETTE DRAW", paletteContainer );

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
					console.log( "GENERICA PALETTE INIT");
					this.drawPalette();

					$scope.$on('$destroy', angular.bind( this, function() {
						console.log("Removing Palette on destroy");
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
