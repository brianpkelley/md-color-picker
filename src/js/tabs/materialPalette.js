

	angular.module('mdColorPicker')
		.config(['$mdColorPalette', '$mdColorPickerConfigProvider', function( $mdColorPalette, $mdColorPickerConfig ) {

			$mdColorPickerConfig.tabs.add({
				name: 'materialPalette',
				icon: 'view_headline.svg',
				template: '<div layout="column" layout-fill flex class="md-color-picker-material-palette"></div>',
				link: function( $scope, $element ) {
					console.log("Draw material Palette", this.palette );
					var materialContainer = angular.element( $element[0].querySelector('.md-color-picker-material-palette') );
					var materialTitle = angular.element('<div class="md-color-picker-material-title"></div>');
					var materialRow = angular.element('<div class="md-color-picker-with-label"></div>');

					this.drawPalette = function() {
						console.log('Draw Material Palette', this, this.palette );
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
