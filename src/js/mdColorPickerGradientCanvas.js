
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

		console.log( e, pageX, this.offset.x );
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
			console.log( this.$scope.data.hsva.h );
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
			console.log("DRAWING SPECTRUM!");
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
			console.log( "DRAW HUE", this.$scope.data );
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
			console.log( 'SET SPECTRUM COLOR', this.$scope.data );
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

			console.log( "DRAW WHEEL", this.$scope.data );
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
			console.log( 'wheel', color );

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
			console.log( "DATA.COLOR CHANGE... setting", this.$scope.data.color.toHsv(), this.$element, e, args, arguments);
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
					console.log( $scope );
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
