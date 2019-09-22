//这个文件仅仅提供写字的对象
//引入LoDash  _  ,为了使用extend/assign方法

;(function(_) {



	var PressureChar = function(id, opts, xml) {
		this.id = id;
		this.opts = this.mergeOptions(opts);
		this.strokeArray = [];
		this.img;
		this.brushes = [];
		this.points = [];
		this.r = 0;
		this.P = 2;
		this.isDrawing = false;
		this.xml = xml;
		this.el = document.getElementById(id);

		this.widthMethod = "gaussianCurve";

		var tpl = '<div class="PressureChar-wrapper"><canvas class="PressureChar-canvas"></canvas></div>';
		tpl = '<div class="PressureChar-controls"></div>' + tpl;
		this.el.innerHTML = tpl;

		this.dom = {
			canvas: this.el.querySelector(".PressureChar-canvas"),
			canvasWrapper: this.el.querySelector(".PressureChar-wrapper"),
			controls: this.el.querySelector(".PressureChar-controls")
		};
		this.preloadImg();
		this.initControls();
		
		this.mode = "brush";
		this.radio = "blank";
		// this.range = "gaussian";
		this.canvas = this.dom.canvas;

		this.context = this.canvas && this.canvas.getContext && this.canvas.getContext('2d') ? this.canvas.getContext('2d') : null;
		this.init();
		//这个是个动态的， 先这样处理， 有更好的方法再修改
		this.opts.charBoxWidth = this.canvas.width;

	};
	PressureChar.prototype = {
		
		constructor: PressureChar,


		mergeOptions: function(opts) {
			opts = _.assign({}, PressureChar.defaultOpts,this.opts,opts);
			return opts;
		},

		changePosOpts: function(opts) {
			this.opts = _.assign({},opts,{
				startPosition:{
					x:0,
					y:0
				},
				charBoxWidth: this.opts.charBoxWidth
			});
		},
		changeStrokeArray: function(strokeArray) {
			this.strokeArray = _.cloneDeep(strokeArray);
		},
		/**
		 * 取得一个点得所有参数，以对象的方式存储。
		 * @param  {Number} x      笔触的当前位置
		 * @param  {Number} y      笔触的当前位置的y坐标
		 * @param  {Array} points 当前的笔画数组，不断更新到画完，需要依靠前面的点计算得到
		 * @return {Object}        笔触的当前点
		 */
		setOnePoint: function(x, y, r, points) {
			var t,v,w,p,a,deltaT;
			t = Date.now();
			deltaTime = this._setDeltaTime(x, y, t, r, points); 
			v = this._setVelocity(x, y, t, r, points);
			a = this._setAcceleration(x, y, t, r, points);
			aa = this._setAA(x, y, a, deltaTime, r, points);
			aaa = this._setAAA(x, y, a, aa, deltaTime, r, points);
			w = this._setPointWidth(v, a, aa, aaa, r, points, deltaTime);
			var point = {
				x: x,
				y: y,
				t: t,
				deltaTime: deltaTime,
				p: undefined,
				v: v,
				a: a,
				aa: aa,
				aaa: aaa,
				w: w
			};
			// console.log(point);
			return point;
		},

		_setPressure: function(r, points) {
			if(r > 1) {
				point = points[r-1];
				prePoint = points[r-2];
				d1 = self.distance(point.x, point.y, prePoint.x, prePoint.y);
				sampleNumber = parseInt(d1*50);
				if(r == 2){
					for(var u=0;u<sampleNumber;u++){
						var t=u/(sampleNumber-1);
						var x1=(1.0-t)*prePoint.x+t*point.x;
						var y1=(1.0-t)*prePoint.y+t*point.y;
						if(lineWidth){
							w1 = lineWidth;
						}else{
							w1=(1.0-t)*prePoint.w+t*point.w;
						}
					}
				}
				if(r > 2){	
						var xFirst = (points[r-3].x + prePoint.x) * 0.5; 
						var yFirst = (points[r-3].y + prePoint.y) * 0.5;
						if(lineWidth){
							wFirst = lineWidth;
						}else{
							wFirst = (points[r-3].w + prePoint.w) * 0.5;
						}
						
						var xSecond = (point.x + prePoint.x) * 0.5; 
						var ySecond = (point.y + prePoint.y) * 0.5; 
						if(lineWidth){
							wSecond = lineWidth;
						}else{
							wSecond = (point.w + prePoint.w) * 0.5;
						} 
							//Now we perform a Beizer evaluation 	
						for(var u = 0; u < sampleNumber; u++){
							var t = u/(sampleNumber-1);
								
							var x1=(1.0-t)*(1.0-t)*xFirst + 2*t*(1-t)*prePoint.x + t*t*xSecond;
							var y1=(1.0-t)*(1.0-t)*yFirst + 2*t*(1-t)*prePoint.y + t*t*ySecond;
							if(lineWidth){
								w1 = lineWidth;
							}else{
								w1=(1.0-t)*(1.0-t)*wFirst + 2*t*(1-t)*prePoint.w + t*t*wSecond;
							}
						}
				}
			}
		},

		_setPointWidthByV: function(v, a, r, points, deltaTime) {
			var m, v2, w;
			// a=this.opts.wmax/this.gaussian(0, this.opts.gaussian);
			// v2 = this.gaussian(v, this.opts.gaussian);
			
			if(this.widthMethod === "gaussianCurve"){
				m = this.opts.wmax/this.gaussian(0, this.opts.gaussian);
				v2 = this.gaussian(v, this.opts.gaussian);
			}else if (this.widthMethod === "flatCurve"){
				m = this.opts.wmax/this.flatCurve(0, this.opts.flat);
				v2 = this.flatCurve(v, this.opts.flat);
				console.log("ha");
			}else if (this.widthMethod === "sigmoidCurve") {
				m = this.opts.wmax/this.sigmoid(0, this.opts.sigmoid);
				v2 = this.sigmoid(v, this.opts.sigmoid);
			}

			// a = this.opts.wmax/this.gaussianCurve(0);
			// v2 = this.gaussianCurve(p);
			// console.log(this.sigmoid(0));
			// console.log(p);
			// console.log(this.sigmoid(p));
			w = m*v2;

			if(w < this.opts.wmin){
				w = this.opts.wmin;
			}
			if(r == 1){
				return this.opts.wmax;
			}else {
				return (w + points[r-2].w)/2;
			}
		},

		/**
		 * 取得当前点得宽度，由当前点得速度得到
		 * @param  {Number} v      当前点得速度
		 * @param  {Number} r      当前点的索引
		 * @param  {Array} points 已绘制笔画的数组
		 * @return {Number}        当前点得宽度
		 */
		_setPointWidthByA: function(v, a, r, points, deltaTime) {
			var a, v2, w;
			if(r == 1){
				// return this.opts.wmin/3 + this.opts.wmax/3*2;
				return this.opts.wmax;
			}else {
				
				w = points[r-2].w;
				var m = deltaTime;
				var amplitude = a * m;
				
				// if(amplitude > a || amplitude < -a){
				// 	amplitude = a;
				// }
				w =  w - amplitude;

				if(w < this.opts.wmin){
					w = this.opts.wmin;
				}
				if(w > this.opts.wmax){
					w = this.opts.wmax;
				}
				// console.log(w);
				return w;
				// return (w + points[r-2].w)/2;
			}
		},

		_setPointWidthByTaylor: function(v, a,aa, aaa, r, points, deltaTime) {
			var a, v2, w, jounce;
			if(r == 1){
				// return this.opts.wmin/3 + this.opts.wmax/3*2;
				return this.opts.wmax;
			}else {
				
				w = points[r-2].w;
				// w =  w - a * deltaTime ;
				// var deltaTime = 30;
				var amplitude = 1/2 * aa * deltaTime * deltaTime + 1/6 * aaa * deltaTime * deltaTime * deltaTime;
				// console.log(amplitude);
				w = w - amplitude;
				// console.log(w);


				if(w < this.opts.wmin){
					w = this.opts.wmin;
				}
				if(w > this.opts.wmax){
					w = this.opts.wmax;
				}
				return w;
			}
		},

		_setAA: function(x, y, a, deltaTime, r, points){
			var aa;

			if(r == 1){
				aa = 0
			}else {
				aa = (a-points[r-2].a)/deltaTime;
				
			}
			return aa;
		},

		_setAAA: function(x, y, a, aa, deltaTime,r , points) {
			var aaa;
			if(r == 1){
				aaa = 0
			}else {
				aaa = (aa- points[r-2].aa)/deltaTime;
			}
			// console.log([a, aa, aaa])
			return aaa;
		},


		_setAcceleration: function(x, y, t, r, points) {
			var acceleration, v1, v2;
			if(r == 1) {
				return 0;
			}else {
				var prePoint = this.points[r-2];
				var distance = this.distance(x, y, prePoint.x, prePoint.y);

				v1 = this.points[r-2].v;
				v2 = this._setVelocity(x, y, t, r, points);
				var deltatime = t - this.points[r-2].t;
				// console.log(distance);
				if(distance < 3) {
					acceleration = 0;
				}else {
					acceleration = (v2-v1)/deltatime;
				}
				// console.log(v1+'\t'+v2+'\t'+deltatime+'\t'+acceleration);
				
				return acceleration;
			}

			
		},

		// 取得当前点的速度
		_setVelocity: function(x, y, t, r, points) {
			var velocity;
			if(r == 1){
				return 0;
			}else {
				var prePoint = this.points[r-2];
				var deltatime = t - this.points[r-2].t;
				if(deltatime == 0){
					velocity = prePoint.v;
				}else {
					velocity = this.distance(x, y, prePoint.x, prePoint.y)/deltatime;
				}
				if( r > 2 ){
					velocity = velocity * 0.6 + points[r-2].v * 0.3 + points[r-3].v * 0.1;	
				}else{
					velocity = velocity * 0.7 + points[r-2].v * 0.3;
				}
				return velocity;
			}
		},

		_setDeltaTime: function(x, y, t, r, points) {
			if(r == 1) {
				return 0;
			}else {
				var deltaTime = t - this.points[r-2].t;
				// console.log(deltaTime)
				return deltaTime;
			}
		},

		_setPointWidth: function(v, a, aa,aaa, r, points, deltaTime) {
			var w1 = this._setPointWidthByV(v, a, r, points, deltaTime);
			var w2 = this._setPointWidthByA(v, a, r, points, deltaTime);
			var w3 = this._setPointWidthByTaylor(v, a,aa,aaa, r, points, deltaTime)
			// console.log(w1);
			// console.log(w2);
			var w = this._kalman(r, points, w1, w2);
			return w;
		},

		_kalman: function(r, points, w1, w2) {
			var w_, P_, Q, w, z, R, K;

			Q = 3;
			R = 4;

			w_ = w1;
			P_ = Math.sqrt(this.P*this.P + Q*Q);
			K = P_*P_/(P_*P_+R*R);
			// console.log(K);
			w = w_ + (1-K)*(w2-w_);
			this.P = Math.sqrt((1-K)*P_*P_);
			// console.log(this.P);
			return w;

		},




		_addPoint: function(point) {                                 
			this.points.push(point);
		},
		_addStroke: function() {
			//slice函数可以拷贝数组
			if(this.isDrawing) {
				this.strokeArray.push(this.points.slice());
				// points.splice(0,points.length);
				this.points.length = 0;
			}
			
			this.isDrawing = false; 
			this.r = 0;
		},
		
		drawAllPoints: function(canvas, strokeArray) {
			var colorID;
			var ctx = canvas.getContext("2d");
			if(this.mode === "animation"){
				this.drawAnimation();
			}else {

				// var ctx = this.canvas.getContext("2d");
				
				var i, j;
				for(i = 0; i< strokeArray.length; i++){
					if(this.mode  === "strokeColor"){
						colorID = i%4;
					}else{
						colorID = 0;
					}

					for(j=1; j<= strokeArray[i].length; j++){
						var points = strokeArray[i];
						//这两行代码是改变range后， 相应的参数变化。
						// if(){
						// 	var v = strokeArray[i][j-1].v;
						// 	points[j-1].w = this._setPointWidth(v, j, points);
						// }

						if(this.mode === "skeleton"){
							this._drawStrokeSkeleton(ctx, j, points);
							this._drawPointCircles(ctx, j, points);
						}else if(this.mode === "uniformWidth"){
							this.draw(ctx, j, points, colorID, 8);
						}else{
							this.draw(ctx, j, points, colorID);
						}
						
					}
				}
			}
		},

		updateStrokeArray : function() {
			var i,j;
			for(i = 0; i< this.strokeArray.length; i++){
				for(j=1; j<= this.strokeArray[i].length; j++){
					var points = this.strokeArray[i];
					// 这两行代码是改变range后， 相应的参数变化。
					var v = this.strokeArray[i][j-1].v;
					var a = this.strokeArray[i][j-1].a;
					var p = this.strokeArray[i][j-1].p;
					points[j-1].w = this._setPointWidth(v, a, aa, aaa, j, points, deltaTime);
				}
			}
		},

		saveImg: function(radio) {
			var img;
			// var strokeArray = _.cloneDeep(this.strokeArray);
			if(radio === "grid") {
				var img = new Image();
				img = this.canvas.toDataURL("image/png");
				this.img = img;
			}
			// 这种情况还没处理好，做个标签，之后处理
			else if(radio === "blank"){
				// var ctx = this.canvas.getContext("2d");
				
				this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
				this.drawAllPoints(this.canvas, this.strokeArray);
				img = new Image();
				img = this.canvas.toDataURL("image/png");
				this.img = img;
			}else {
				return false;
			}
		},


		init: function() {
			var self = this;
			var canvas = this.canvas;
			var xml = this.xml;
			
			this.canvas.width = this.dom.canvasWrapper.clientWidth ;
			this.canvas.height = this.dom.canvasWrapper.clientHeight;


			// this.dom.canvasWrapper.style.width = this.el.clientWidth + 'px';
			// this.dom.canvasWrapper.style.height = this.el.clientHeight + 'px';
			// var context = this.canvas.getContext("2d");
			this.initGrid();

			// document.body.addEventListener('touchmove', function (event) {event.preventDefault();}, false);//固定页面
			//当字是xml标准字时，不能书写

			if(!this.opts.isXML){
				this.initEvents();
			}

			if(this.opts.xmlFile){
				this.strokeArray.length = 0;
				this.initGrid();
				this.mode = "brush";
				this.parseXML();
				this.changeXY(this.strokeArray, this.opts  , 1);
				this.drawAllPoints(this.canvas, this.strokeArray);
			}
			if(xml){
				xml.addEventListener("change",function(){
					self.strokeArray.length = 0;
					self.initGrid();
					self.mode = "brush";
					self.parseXML(xml.files[0]);
					self.changeXY(self.strokeArray, self.opts, 1);
					self.drawAllPoints(self.canvas, self.strokeArray);
				},false);
			}
			
			// window.addEventListener("resize",function(){
			// 	self.canvas.width = self.opts.viewportWidth;
			// 	self.canvas.height = self.opts.viewportWidth*self.opts.aspectRatio;
			// 	self.initGrid();
			// 	// self.changeXY();
			// 	// self.drawAllPoints(canvas, self.strokeArray);
			// },false);

		},

		initEvents: function() {
			if(!this.opts.isXML) {
				this.addListenerMulti(this.canvas, 'mousedown touchstart', function(e){
					this._onInputStart(e, this._getInputCoords(e));
				});
				this.addListenerMulti(this.canvas, 'touchmove mousemove', function(e){
					this._onInputMove(e, this._getInputCoords(e));
				});
				this.addListenerMulti(this.canvas, 'mouseout ', function(e){
					this._onMouseOut(e, this._getInputCoords(e));
				});
				this.addListenerMulti(this.canvas, 'touchend mouseup', function(e){
					this._onInputStop(e, this._getInputCoords(e));
				});
			}
		},
		_getInputCoords: function(e) {
			var touch =("createTouch" in document);
			var UIEvent=touch ? e.touches[0] : e; 
			var x = UIEvent.clientX - this.canvas.getBoundingClientRect().left;
			var y = UIEvent.clientY - this.canvas.getBoundingClientRect().top;
			return {
				x: x,
				y: y
			};
		},

		_onInputStart: function(e, coords) {
			var x = coords.x;
			var y = coords.y;
			this.isDrawing = true;
			this.r++;
			var point = this.setOnePoint(x, y, this.r, this.points);
			this._addPoint(point);

			this.draw(this.context, this.r, this.points);

			e.stopPropagation();
			e.preventDefault();
		},

		_onInputMove: function(e, coords) {
			

			if(this.isDrawing){
				var x = coords.x;
				var y = coords.y;
				this.r++;
				var point = this.setOnePoint(x,y, this.r, this.points);
				this._addPoint(point);
				this.draw(this.context,this.r, this.points);
				e.stopPropagation();
				e.preventDefault();
			}
		},

		_onMouseOut: function(e, coords) {
			this._addStroke();
			e.stopPropagation();
			e.preventDefault();
		},

		_onInputStop: function(e, coords) {
			this._addStroke();
			e.stopPropagation();
			e.preventDefault();
		},

		preloadImg: function() {
			for(var i=0; i<this.opts.strokeColors.length; i++) {
				this.brushes[i] = new Image();
				this.brushes[i].src = "image/model-"+this.opts.strokeColors[i]+".png";
			}
		},

		draw: function(ctx, r, points, colorID, lineWidth) {
			var self = this;
			var d1, sampleNumber;
			var point,prePoint;
			var color;
			var w1, wFirst, wSecond;
			var image;
			var i;
			if(!colorID){
				var colorID = 0;
			}
			
			image = this.brushes[colorID];
			if(r > 1) {
				point = points[r-1];
				prePoint = points[r-2];
				d1 = self.distance(point.x, point.y, prePoint.x, prePoint.y);
				sampleNumber = parseInt(d1*50);
				if(r == 2){
					for(var u=0;u<sampleNumber;u++){
						var t=u/(sampleNumber-1);
						var x1=(1.0-t)*prePoint.x+t*point.x;
						var y1=(1.0-t)*prePoint.y+t*point.y;
						if(lineWidth){
							w1 = lineWidth;
						}else{
							w1=(1.0-t)*prePoint.w+t*point.w;
						}
						ctx.drawImage(image,x1-w1,y1-w1,w1*2,w1*2);  		
					}
				}
				if(r > 2){	
						var xFirst = (points[r-3].x + prePoint.x) * 0.5; 
						var yFirst = (points[r-3].y + prePoint.y) * 0.5;
						if(lineWidth){
							wFirst = lineWidth;
						}else{
							wFirst = (points[r-3].w + prePoint.w) * 0.5;
						}
						
						var xSecond = (point.x + prePoint.x) * 0.5; 
						var ySecond = (point.y + prePoint.y) * 0.5; 
						if(lineWidth){
							wSecond = lineWidth;
						}else{
							wSecond = (point.w + prePoint.w) * 0.5;
						} 
							//Now we perform a Beizer evaluation 	
						for(var u = 0; u < sampleNumber; u++){
							var t = u/(sampleNumber-1);
								
							var x1=(1.0-t)*(1.0-t)*xFirst + 2*t*(1-t)*prePoint.x + t*t*xSecond;
							var y1=(1.0-t)*(1.0-t)*yFirst + 2*t*(1-t)*prePoint.y + t*t*ySecond;
							if(lineWidth){
								w1 = lineWidth;
							}else{
								w1=(1.0-t)*(1.0-t)*wFirst + 2*t*(1-t)*prePoint.w + t*t*wSecond;
							}
							
								
							ctx.drawImage(image,x1-w1,y1-w1,w1*2,w1*2);  		
						}
				}
			}
			
		},

		_drawStrokeSkeleton: function(ctx, r, points,color) {
			// var x = parseInt(points[r-1].x);
			var x = points[r-1].x;
			// var y = parseInt(points[r-1].y);
			var y = points[r-1].y;
			//每个点绘制前都需要beginPath和moveTo, 否则笔画的字不会直。
			if(r == 1){
				ctx.beginPath();
				ctx.moveTo(x,y);
			}else if(r !== points.length && r >= 2){
				ctx.beginPath();
				ctx.moveTo(points[r-2].x, points[r-2].y);
				ctx.lineTo(x,y);
			}else{
				ctx.beginPath();
				ctx.moveTo(points[r-2].x, points[r-2].y);
				ctx.lineTo(x,y);
			}
			ctx.lineWidth = 1.2;
			ctx.strokeStyle='gray';
			ctx.stroke();
		},
		_drawPointCircles: function(ctx, r, points) {
			ctx.beginPath();
			ctx.arc(points[r-1].x,points[r-1].y,this.opts.radius,0,2*Math.PI,false);
			ctx.lineWidth = 1.5;
			ctx.strokeStyle='black';
			ctx.stroke();
		},
		_drawClickedPoint: function() {
			ctx.beginPath();
			for(var m=0;m<strokeArrayXML.length; m++){
				for(var n=0;n<strokeArrayXML[m].length;n++){
					if(m!=i && n!=j){
						ctx.arc(strokeArrayXML[m][n].x,strokeArrayXML[m][n].y,RADIUS,0,2*Math.PI,false);
						
					}
					
				}
			}
			ctx.lineWidth = 1.5;
			ctx.strokeStyle='black';
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(strokeArrayXML[i][j].x,strokeArrayXML[i][j].y,RADIUS,0,2*Math.PI,false);
				ctx.lineWidth = 3;
			ctx.strokeStyle='black';
			ctx.stroke();
		},

		drawAnimation: function(){
			var ctx = this.canvas.getContext("2d");
			var self =this;
			if(this.strokeArray.length != 0){
				
				var intervalID;
				var i = 0;
				var j = 1;
				var points = this.strokeArray[i];
				intervalID = setInterval(
					function() {
						self.draw(ctx, j, points);
						//其实可以单独写一个update参数的，但是因为不清楚函数间传参的规律，待完成。
						if(j < self.strokeArray[i].length) {
							j++;
						}else {
							i++;
							j = 1;
						}
						points = self.strokeArray[i];
						if(i === self.strokeArray.length){
							clearInterval(intervalID);
						}
						
					}
					,
					33
				);
			}
		},
		initGrid: function() {

			var ctx = this.canvas.getContext("2d");

			ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			// this.strokeArray.length = 0;
			
			ctx.fillStyle = "#fff";
			ctx.fillRect(0,0, this.canvas.width,this.canvas.height);
			ctx.beginPath();
			ctx.strokeStyle='gray';
			ctx.lineWidth=1.5;
			ctx.moveTo(0,ctx.canvas.height/2);
			ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2);
			ctx.moveTo(ctx.canvas.width/2,0);
			ctx.lineTo(ctx.canvas.width/2,ctx.canvas.height);
			ctx.stroke();
			ctx.lineWidth=0.5;
			this._drawDottedLine(ctx,0,0,ctx.canvas.width,ctx.canvas.height,10);
			this._drawDottedLine(ctx,0,ctx.canvas.height,ctx.canvas.width,0,10);
			ctx.closePath();
		},
		_drawDottedLine: function(context, x1, y1, x2, y2, dashLength){
			dashLength=dashLength===undefined?5:dashLength;
			var deltaX=x2-x1;
			var deltaY=y2-y1;
			var numDashes=Math.floor(Math.sqrt(deltaX*deltaX+deltaY*deltaY)/dashLength);
			for(var i=0;i<numDashes;++i){
				context[i%2===0?'moveTo':'lineTo']
				(x1+(deltaX/numDashes)*i,y1+(deltaY/numDashes)*i);
			}
			context.stroke();
		},
		// gaussian: function(p, gaussian) {
		// 	// gaussian = gaussian * (p/120);
		// 	// console.log(gaussian);	
		// 	return ((1/(Math.sqrt(2*Math.PI)*gaussian))*Math.pow(Math.E,-(p*p)/(2*gaussian*gaussian)));
		// },

		// // sigmoid method 1/(1+e^t)
		// sigmoid: function(p, sigmoid) {
		// 	return (1/(1+Math.pow(Math.E, sigmoid*p)));
		// },

		// // sqrt((1+b^2)/(1+b^2*(cos(x))^2))*cos(x)
		// flatCurve: function(p, flat) {
		// 	var p = p/124*Math.PI/2;
		// 	return (Math.sqrt((1+flat*flat)/(1+flat*flat*Math.pow(Math.cos(p), 2)))*Math.cos(p));
		// },

		// gaussian: function(v, p, gaussian) {
		// 	// gaussian = gaussian * (p/120);
			
		// 	var max = 1/Math.sqrt(2*Math.PI)*gaussian;
		// 	var b = 0;
		// 	// console.log(b*(p-100)/5);
		// 	return ((1/(Math.sqrt(2*Math.PI)*gaussian))*Math.pow(Math.E,-(v*v)/(2*gaussian*gaussian))/max*100)+b*(p-120)/5;
		// },

		// // sigmoid method 1/(1+e^t)
		// sigmoid: function(v, p, sigmoid) {
		// 	var b = 1;
		// 	return (1/(1+Math.pow(Math.E, sigmoid*v)))+b*(p-120)/5;
		// },

		// flatCurve: function(v, p, flat) {
		// 	return (Math.sqrt((1+flat*flat)/(1+flat*flat*Math.pow(Math.cos(v), 2)))*Math.cos(v));
		// },

		acceleration: function(a, w) {
			var m = 30;
			var amplitude = a * m;
			
			// if(amplitude > a || amplitude < -a){
			// 	amplitude = a;
			// }
			return (w - amplitude);
		},

		gaussian: function(v, gaussian) {
			// gaussian = gaussian * (p/120);
			// console.log(gaussian);	
			return ((1/(Math.sqrt(2*Math.PI)*gaussian))*Math.pow(Math.E,-(v*v)/(2*gaussian*gaussian)));
		},

		// sigmoid method 1/(1+e^t)
		sigmoid: function(v, sigmoid) {
			return (1/(1+Math.pow(Math.E, sigmoid*v)));
		},

		// sqrt((1+b^2)/(1+b^2*(cos(x))^2))*cos(x)
		flatCurve: function(v, flat) {
			
			var v = v/2.5*Math.PI/2;
			console.log(v);
			return (Math.sqrt((1+flat*flat)/(1+flat*flat*Math.pow(Math.cos(v), 2)))*Math.cos(v));
		},


		distance: function(x1,y1,x2,y2) {
			return (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
		},

		getRangeValue: function(ele) {
			// var input = ele.getElementsByClassName("scale-range")[0];
			// console.log(input.value);
			// console.log(parseFloat(input.value));
			return parseFloat(ele.value);
		},


		getXML: function(xml) {
			if(xml.files[0]){
				return this.xml.files[0];
			}
		},
		parseXML: function(xmlFile) {
			var i, j;
			var xmlDoc = this.loadXML(xmlFile);

			var stroke = xmlDoc.getElementsByTagName("Stroke");
			for(i=0; i<stroke.length; i++) {
				var points = [];
				for(j=0; j<stroke[i].childNodes.length; j++){
					  var t,point = {};
					  var x = Number(stroke[i].childNodes[j].getAttribute("x"));
					  var y = Number(stroke[i].childNodes[j].getAttribute("y"));
					  var p = Number(stroke[i].childNodes[j].getAttribute("pressure"));
					  if(j == 0){
							t = 0.0;
						}else{
							t=(this.points[j-1].t+Number(stroke[i].childNodes[j].getAttribute("deltaTime"))/this.opts.timeScale);
						}

						//这里根据时间计算得到速度
						var deltaTime = this.	_setDeltaTime(x, y, t, j+1, this.points);
						var v = this._setVelocity(x, y, t, j+1, this.points);
						var a = this._setAcceleration(x, y, t, j+1, this.points);
						var aa = this._setAA(x, y, a, deltaTime, j+1, this.points);
						var aaa = this._setAAA(x, y, a, aa, deltaTime,j+1 , this.points);
						var w = this._setPointWidth(v, a,aa,aaa, j+1, this.points, p, deltaTime);
									
					  point = {
					  	x : x,
						  y : y,
							p : p,
							deltaTime: deltaTime,
							t : t,
							v : v,
							a : a,
							aa: aa,
							aaa: aaa,
							w : w,
						}
						// if(j>0){
						// 	var prePoint = this.points[j-1];
						// 	var distance = this.distance(x, y, prePoint.x, prePoint.y);
						// }
						
						this.points.push(point);
				}
				this.strokeArray.push(this.points.slice());
				this.points.length = 0;

			}
			this.points.length = 0;
		},
		loadXML: function(xmlFile) {
			var xmlDoc, url, xmlhttp, xmlString, domParser;
			if(!this.opts.xmlFile){
				url = window.URL.createObjectURL(xmlFile);
				xmlhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
				xmlhttp.open("GET", url, false);
				xmlhttp.onload = function(){
				    if( xmlhttp.readyState == 4 && xmlhttp.status == 200){
				        xmlDoc =  xmlhttp.responseXML;
				    }
				}
				xmlhttp.send(null);
				return xmlDoc;
			}else{
				xmlhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
				url = encodeURI("getxml.php?name="+this.opts.fileName);
				xmlhttp.open("GET", url, false);
				
				xmlhttp.onload = function(){
				    if( xmlhttp.readyState == 4 && xmlhttp.status == 200){
				        xmlString =  xmlhttp.responseText;
				    }
				}
				xmlhttp.send(null);


				domParser = new DOMParser();
				xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
				return xmlDoc;
			}
			
		},
		
		changeXY: function(strokeArray, opts, charScale, flag) {
			var charAspectRatio;

			var minX=strokeArray[0][0].x;
			var minY=strokeArray[0][0].y;
			var maxX=strokeArray[0][0].x;
			var maxY=strokeArray[0][0].y;
			
			//Find the global bounding box
			for(var i=0;i<strokeArray.length;i++){
				for(var j=0;j<strokeArray[i].length;j++){
					if(minX>strokeArray[i][j].x){minX=strokeArray[i][j].x;}
					if(minY>strokeArray[i][j].y){minY=strokeArray[i][j].y;}
					if(maxX<strokeArray[i][j].x){maxX=strokeArray[i][j].x;}
					if(maxY<strokeArray[i][j].y){maxY=strokeArray[i][j].y;}
				}
			}
			var widthX=maxX-minX;
			var heightY=maxY-minY;
			var centerX=(minX+maxX)*0.5;
			var centerY=(minY+maxY)*0.5;
			// 保存长宽比，不然显示出来的就是1：1
			
			var	charAspectRatio=widthX/heightY;
			

			//字在区域内显示的比例
			var scale= opts.charRatio;
			//if the width is larger, make sure it is within range
			if( charAspectRatio > 1.0){
				scale/=charAspectRatio;
			}

			var charBoxWidth = opts.charBoxWidth;
			var charBoxHeight =  opts.charBoxWidth * opts.aspectRatio;

			for(var i=0;i<strokeArray.length;i++){
				for(var j=0;j<strokeArray[i].length;j++){
					//normalize the coordinates into [-0.5,0.5]	
					strokeArray[i][j].x=(strokeArray[i][j].x-centerX)*scale/widthX;
					strokeArray[i][j].y=(strokeArray[i][j].y-centerY)*scale/heightY;
					//map to canvas space
					// 缩放需要对应字的比例，固定比例为字的原始比例。
					strokeArray[i][j].x=(strokeArray[i][j].x*charAspectRatio+0.5)*charBoxWidth+ opts.startPosition.x;
					//字要缩放一样的倍数，然后平移1/2画布高度。
					strokeArray[i][j].y=strokeArray[i][j].y*charBoxWidth+0.5*charBoxHeight+ opts.startPosition.y;
					// arr[i][j].y=(arr[i][j].y+0.5)*charBoxHeight;
					// 
					if(!flag){
						strokeArray[i][j].w=strokeArray[i][j].w/charScale;
					}else{
						strokeArray[i][j].w=strokeArray[i][j].w*charScale;
					}
					
				}
			}
		},


		initControls: function() {
			this.controls = {};
			if(!this.opts.controls.length || !PressureChar.Control) return false;
			for(var i = 0; i < this.opts.controls.length; i++) {
				var c = null;
				if(typeof this.opts.controls[i] == "string") {
					c = new window['PressureChar']['Control'][this.opts.controls[i]](this);
				}else if(typeof this.opts.controls[i] == "object"){
					for(var controlName in this.opts.controls[i]) break;
					c = new window['PressureChar']['Control'][controlName](this, this.opts.controls[i][controlName]);
				}
				if (c) {
					this.dom.controls.appendChild(c.el);
					if(!this.controls){
						this.controls = [];
					}
					this.controls[this.opts.controls[i]] = c;
				}
			}
		},
		addControl: function(control) {
			this.dom.controls.appendChild(control.el);
			if(!this.controls)
				this.controls = {};
			this.controls.push(control);
		},

		getMode: function() {
			return this.mode || "brush";
		},

		setMode: function(newMode) {
			this.mode = newMode;
		},

		getRadio: function() {
			return this.radio || "blank";
		},

		setRadio: function(newRadio) {
			this.radio = newRadio;
		},

		setColor: function(color) {

		},

		addListenerMulti: function(el, s, fn) {
			var evts = s.split(' ');
			for(var i = 0, iLen = evts.length; i<iLen; i++){
				el.addEventListener(evts[i],fn.bind(this), false);
			}
		},

		reset: function() {
			this.setMode('brush');
		},





	};

	PressureChar.defaultOpts = {
		controls: [
			'Size',
			'DisplayMode',
			// 'Navigation',
			'Curve'
		],

		gaussian:1.3,
		sigmoid: 1.0,
		flat: 6.0,





		wmax: 13.0,
		wmin: 2.0,
		timeScale: 15,

		withGrid: true,
		radius: 5,
		lineWidth: 1.2,

		strokeColors: ['black', 'gray3', 'gray2', 'gray1'],

		// widthMethod: {
		// 	gaussian: true,
		// 	flatCurve: true,
		// 	sigmoidCurve: false
		// },



		isXML: false,
		xmlFile: 0,
		fileName: "10-4-6-德.xml",
		background: "#fff",

	  charRatio: 0.85,
	  aspectRatio: 4/3,
	  // viewportWidth: 500,

	  // charBoxWidth: 500,
	  startPosition: {
	  	x: 0,
	  	y: 0
	  },
	};










	PressureChar.Control = function(drawingBoard, opts){
		this. board = drawingBoard;
		this.opts = _.extend({}, this.defaults, opts);
		this.el = document.createElement('div');
		this.el.classList.add('PressureChar-control');
		if(this.name){
			this.el.classList.add('PressureChar-control-'+this.name+'s');
		}
		this.initialize.apply(this, arguments);
		// return this;
	};

	PressureChar.Control.prototype = {
		name: '',

		defaults: {},

		initialize: function(){

		},

		addToBoard: function(){
			this.board.addControl(this);
		},

		onBoardReset: function(opts){

		}
	};

	PressureChar.Control.extend = function(protoProps, staticProps){
		var parent = this;
		var child;
		if(protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		}else {
			child = function() {
				return parent.apply(this, arguments);
			};
		}
		_.extend(child, parent, staticProps);

		child.prototype = _.create(parent.prototype, protoProps);
    child.prototype.constructor = child;
		
		child.__super__ = parent.prototype;
		return child;

	};

	PressureChar.Control.DisplayMode = PressureChar.Control.extend({
		name: 'displaymode',

		defaults: {
			brush: true,
			skeleton: true,
			strokeColor: true,
			animation: true,
			uniformWidth: true
		},

		initialize: function() {
			var that = this;
			var tpl = '';
			["brush", "skeleton", "strokeColor", "animation", "uniformWidth"].forEach(function(element, index, array){
				if(element) {
					tpl = tpl + '<button class="PressureChar-control-displaymode control-displaymode-'+element+'-button" data-mode="'+ element +'">'+ element+'</button> ';
				}
			});
			this.el.innerHTML = tpl;
			var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-mode]'),0);

			buttonArray.forEach(function(e){
				e.addEventListener("click", function(e){
					var value = e.currentTarget.getAttribute('data-mode');
					var mode = this.board.getMode();
					if(mode !== value) {
						this.board.setMode(value);
					}
					this.changeButtons(this.board.getMode());
					this.board.initGrid();
					this.board.drawAllPoints(this.board.canvas,this.board.strokeArray);
					e.preventDefault();
				}.bind(this),false);
			}.bind(this));
			this.changeButtons(this.board.getMode());


		},

		changeButtons: function(mode) {
			var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-mode]'),0);
			buttonArray.forEach(function(element, index, array){
				if(element){
					var item = element;
					if(mode === item.getAttribute('data-mode')){
						item.classList.add('active');
					}else{
						item.classList.remove('active');
					}
				}
			});
		}
	});

	PressureChar.Control.Navigation = PressureChar.Control.extend({
		name: 'navigation',

		defaults: {
			back: false,
			forward: false,
			reset: true,
			add: true,
			imgRadio: true,
			update: true,
		},


		initialize: function(){
			var div = document.createElement('div');
			var tplReset = '';
			var tplAdd = '';
			var tplRadio = '';
			var tplUpdate = '';


			if(this.opts.imgRadio) {
				tplRadio = tplRadio + '<div class="PressureChar-navigation-radio"><button class="PressureChar-navigation-radio-blank" data-radio="blank">blank</button><button class="PressureChar-navigation-radio-grid" data-radio="grid">grid</button></div>';
				div.innerHTML = tplRadio;
				this.el.appendChild(div.firstChild);
			};
			if(this.opts.reset) {
				tplReset = tplReset + '<button class="PressureChar-control-navigation-reset">&times;</button>';
				div.innerHTML = tplReset;
				this.el.appendChild(div.firstChild);
			};
			if(this.opts.add) {
				tplAdd = tplAdd + '<button class="PressureChar-control-navigation-add">addChar</button>';
				div.innerHTML = tplAdd;
				this.el.appendChild(div.firstChild);
			};
			if(this.opts.update) {
				tplUpdate = tplUpdate + '<button class="PressureChar-control-navigation-update">update</button>';
				div.innerHTML = tplUpdate;
				this.el.appendChild(div.firstChild);
			}			


			// var myEvent = new CustomEvent("myevent", {
			//   detail: {
			//     foo: "bar"
			//   },
			//   bubbles: true,
			//   cancelable: false
			// });

			// this.el.addEventListener('myevent', function(event) {
			//   console.log('Hello ' + event.detail.foo);
			// });
			this.el.getElementsByClassName("PressureChar-control-navigation-reset")[0].addEventListener('click', function(){
				// this.el.dispatchEvent(myEvent);
				this.board.strokeArray.length = 0;
				this.board.initGrid();
				this.board.reset();
			}.bind(this),false);

			var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-radio]'),0);
			buttonArray.forEach(function(e){
				e.addEventListener("click", function(e){
					var value = e.currentTarget.getAttribute('data-radio');
					var mode = this.board.getRadio();
					if(mode !== value) {
						this.board.setRadio(value);
					}
					this.changeButtons(this.board.getRadio());
					e.preventDefault();
				}.bind(this),false);
			}.bind(this));

			this.changeButtons(this.board.getRadio());
			

			// this.el.dispatchEvent(myEvent);
		},
		changeButtons: function(radio) {
			var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('button[data-radio]'),0);
			console.log(buttonArray);
			buttonArray.forEach(function(element, index, array){
				if(element){
					var item = element;
					if(radio === item.getAttribute('data-radio')){
						item.classList.add('active');
					}else{
						item.classList.remove('active');
					}
				}
			});

		}
	});

	PressureChar.Control.Size = PressureChar.Control.extend({
		name: 'size',

		defaults: {
			type: "auto",
			// gaussian: {
			// 	dropdownValue: [0.1, .4, .7, .8, 1, 2, 3],
			// 	min: 0.1,
			// 	max: 3,
			// 	step: 0.1,
			// 	size: 1.3
			// },
			wmax: {
				dropdownValue: [4, 5, 7, 8, 10, 20],
				min: 4,
				max: 20,
				step: 1,
				size: 13
			},
			wmin: {
				dropdownValue: [.5, 1, 3, 4],
				min: 0.5,
				max: 5,
				step: .1,
				size: 2
			},
			timeScale: {
				dropdownValue: [5, 10 , 15, 20, 25],
				min: 5,
				max: 25,
				step: 1,
				size:15
			}
		},

		types: ['dropdown', 'range'],



		initialize: function() {
			this.updateView();

			if(this.opts.type == 'range' || this.opts.type == 'auto'){
				this._rangeTemplate();
			}

			// if(this.opts.gaussian.type == 'dropdown') {
			// 	this._dropdownTemplet();
			// }
			var buttonArray = Array.prototype.slice.call(this.el.querySelectorAll('.PressureChar-control-size input'),0);
			buttonArray.forEach(function(element){
				element.addEventListener("change", function(e){
					var range = e.currentTarget.getAttribute('data-range');
					this.board.opts[range] =  this.board.getRangeValue(e.currentTarget);
					this.board.updateStrokeArray();
					this.board.initGrid();
					this.board.drawAllPoints(this.board.canvas, this.board.strokeArray);
				}.bind(this), false);
			}.bind(this));

		},
		_rangeTemplate: function(){

			var tpl = '';
			var that = this;
			["wmax", "wmin", "timeScale"].forEach(function(element, index, array){
				if(element) {
					tpl = tpl + '<div class="PressureChar-control-size PressureChar-control-size-'+ element +'" >'
					+'<div class="PressureChar-control-inner" title="'+ that.opts[element].size +'">'
					+'<span>'+element+'</span>' 
					+'<input type="range" min="'+ that.opts[element].min +'" max="'+ that.opts[element].max +'" value="'+ that.opts[element].size 
					+'" step="'+that.opts[element].step+'" class="PressureChar-control-size-range-input" data-range="'+ element +'">' 
					+ '<span class="PressureChar-control-size-range-current"></span>' 
					+'</div></div>'
				}
			});
			this.el.innerHTML = tpl;
		},
		//这个方法暂时闲置吧~  以后需要扩展再用
		_dropdownTemplet: function(){
			var tpl = '';
			var that = this;
			["gaussian", "wmax", "wmin", "timeScale"].forEach(function(element, index, array){
				if(element) {
					tpl = tpl + '<div class="PressureChar-control-size-'+ element +'">'
					+'<div class="PressureChar-control-inner" title="'+ that.opts[element].size +'">' 
					+'<input type="dropdown" min="'+ that.opts[element].min +'" max="'+ that.opts[element].max +'" value="'+ that.opts[element].size 
					+'" step="'+that.opts[element].step+'" class="PressureChar-control-size-dropdown-input">' 
					+ '<span class="PressureChar-control-size-dropdown-current"></span>' 
					+'</div></div>'
				}
			});
			this.el.innerHTML = tpl;
		},
		onBoradReset: function(opts) {
			this.updateView();
		},
		updateView: function(){
			// console.log("updateView");
		},

	});

	PressureChar.Control.Curve = PressureChar.Control.extend({
		name : 'Curve',

		defaults: {
			// expCurve: true,
			gaussianCurve: true,
			flatCurve : true,
			sigmoidCurve : true,
			// sinCosCurve : true
			
		},

		initialize: function() {
			var divRange = document.createElement('div');
			var newRange = document.createElement('div');
			divRange.className = 'character-control-curev-ranges';
			var that = this;
			var tpl = '<select name="curve-select" id="curve-select">';

			var arr = [];
			for(var key in this.opts){
				if(this.opts.hasOwnProperty(key) && this.opts[key]){
					arr.push(key)
				}
			}


			arr.forEach(function(element, index){
				tpl = tpl + '<option value="'+ element +'" data-mode="'+ element +'">'+ that.capitalizeFirstLetter(element) +'  </option>'
			});

			tpl = tpl + '</select>';

			// tpl = tpl + '<input type="range" min="0.1" max="3" value="1.3" step="0.1" class="character-control-curve-range-input" data-range="gaussian" />'
			// tpl = '<select></select>'
			this.el.innerHTML = tpl;
			this.el.appendChild(divRange);
			divRange.innerHTML = 'gaussian<input type="range" min="0.1" max="5" value="1.3" step="0.1" class="character-control-curve-range-input" data-range="gaussian" />';


			var curveSelect = this.el.querySelector('#curve-select');
			curveSelect.addEventListener('change', function(e){
				var option = this.options[this.selectedIndex];
				var value = option.value;

				if(value === "sigmoidCurve") {
					divRange.innerHTML = 'sigmoidCurve<input type="range" min="0.01" max="1" value="1" step="0.01" class="character-control-curve-range-input" data-range="sigmoid" />';
					that.board.widthMethod = "sigmoidCurve";
					that.board.updateStrokeArray();
					that.board.initGrid();

					that.board.drawAllPoints(that.board.canvas,that.board.strokeArray);
					e.preventDefault();
				}else if(value === "flatCurve"){
					divRange.innerHTML = 'flatCurve<input type="range" min="1" max="40" value="6" step="1" class="character-control-curve-range-input" data-range="flat" />';
					that.board.widthMethod = "flatCurve";
					that.board.updateStrokeArray();
					that.board.initGrid();
					that.board.drawAllPoints(that.board.canvas,that.board.strokeArray);
					e.preventDefault();
				}else if(value === "gaussianCurve") {
					divRange.innerHTML = 'gaussian<input type="range" min="0.1" max="5" value="1.3" step="0.1" class="character-control-curve-range-input" data-range="gaussian" />';

					that.board.widthMethod = "gaussianCurve";
					that.board.updateStrokeArray();
					that.board.initGrid();
					that.board.drawAllPoints(that.board.canvas,that.board.strokeArray);
					e.preventDefault();
				}
				// if (e.target) {}
			}, false);

			divRange.addEventListener('change', function(e){
				console.log(e.target.getAttribute('data-range'));
				var range = e.target.getAttribute('data-range');
				if(range === "gaussian") {
					console.log('range change');
					that.board.opts[range] =  parseFloat(e.target.value);
					console.log(that.board.opts[range]);
					that.board.updateStrokeArray();
					that.board.initGrid();
					that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
				}else if (range === "flat") {
					
					that.board.opts[range] =  parseFloat(e.target.value);
					console.log(that.board.opts[range]);
					that.board.updateStrokeArray();
					that.board.initGrid();
					that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
				}else if (range === "sigmoid") {
					console.log('range change');
					that.board.opts[range] =  parseFloat(e.target.value);
					console.log(that.board.opts[range]);
					that.board.updateStrokeArray();
					that.board.initGrid();
					that.board.drawAllPoints(that.board.canvas, that.board.strokeArray);
				}
			}, false);
		},			
			



		changeCurve: function() {
			var curveTpl = '';
		},

		capitalizeFirstLetter: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

	});





// PressureChar.Control.File = PressureChar.Control.extend({
// 	name: "File",
// 	default: {

// 	},

// 	initialize: function() {

// 	},

// });






	window["PressureChar"] = PressureChar;
})(_);


