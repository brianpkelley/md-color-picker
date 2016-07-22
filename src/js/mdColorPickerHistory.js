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
