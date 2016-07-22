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
