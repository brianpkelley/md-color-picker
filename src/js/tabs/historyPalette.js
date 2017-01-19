
	angular.module('mdColorPicker')
		.config(['$mdColorPickerHistoryProvider', '$mdColorPickerConfigProvider', function( $mdColorPickerHistory, $mdColorPickerConfig ) {

			$mdColorPickerConfig.tabs.add({
				name: 'historyPalette',
				icon: 'history.svg',
				templateUrl: 'tabs/historyPalette.tpl.html',
				link: function( $scope, $element ) {
					console.log( 'HISTORY PALETTE: ', this.palette );
					var historyContainer = angular.element( $element[0].querySelector('.md-color-picker-history') );
					var paletteRow = angular.element('<div class="flex-15 layout-row" style="width: 100%;"></div>');
					var paletteCell = angular.element('<div class=""><div></div></div>');

					var drawTimeout;
					this.palette = $mdColorPickerHistory.get();

					$scope.$watch( angular.bind( this, function() { return $mdColorPickerHistory.get() } ), angular.bind( this, function( newVal, oldVal ) {
						console.log( 'NEW HISTORY', newVal );
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
						console.log( "DRAWING HISTORY");
						var row;
						// Remove all rows and unbind cells
						if ( this.drawn.length ) {
							var cells;

							while( row = this.drawn.pop() ) { // jshint ignore:line
								cells = row.children();
								console.log( "REMOVING" );
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
