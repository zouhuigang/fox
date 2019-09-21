//这个文件仅仅提供写字的对象
//引入LoDash  _  ,为了使用extend/assign方法

;(function(_) {



	var Character = function(canvas, opts, xml) {
		this.canvas = canvas;
		this.opts = this.mergeOptions(opts);
		this.strokeArray = [];
		this.points = [];
		this.r = 0;
		this.isDrawing = false;
		this.xml = xml;

	};
	Character.prototype = {
		
		constructor: Character,


		mergeOptions: function(opts) {
			opts = _.assign({}, Character.defaultOpts,this.opts,opts);
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
			var t,v,w,p;
			t = Date.now();
			v = this._setVelocity(x, y, t, r, points);
			w = this._setPointWidth(v, r, points);
			var point = {
				x: x,
				y: y,
				t: t,
				p: undefined,
				v: v,
				w: w
			};
			// console.log(point);
			return point;
		},
		/**
		 * 取得当前点得宽度，由当前点得速度得到
		 * @param  {Number} v      当前点得速度
		 * @param  {Number} r      当前点的索引
		 * @param  {Array} points 已绘制笔画的数组
		 * @return {Number}        当前点得宽度
		 */
		_setPointWidth: function(v, r, points) {
			var a, v2, w;
			a=this.opts.wmax/this.gaussian(0, this.opts.gaussian);
			v2 = this.gaussian(v, this.opts.gaussian);
			w = a*v2;
			if(w < this.opts.wmin){
				w = this.opts.wmin;
			}
			if(r == 1){
				return this.opts.wmax;
			}else {
				return (w + points[r-2].w)/2;
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
			var ctx = canvas.getContext("2d");
			var i, j;
			for(i = 0; i< strokeArray.length; i++){
				if(this.opts.displayMode.strokeColor){
					color = this.opts.strokeColors[i%4];
				}else{
					color = 'black';
				}

				for(j=1; j<= strokeArray[i].length; j++){
					var points = strokeArray[i];
					//这两行代码是改变range后， 相应的参数变化。
					// if(){
					// 	var v = strokeArray[i][j-1].v;
					// 	points[j-1].w = this._setPointWidth(v, j, points);
					// }

					if(this.opts.displayMode.skeleton){
						this._drawStrokeSkeleton(ctx, j, points);
						this._drawPointCircles(ctx, j, points);
					}else if(this.opts.displayMode.uniformWidth){
						this.drawStrokePointByImage(ctx, j, points, color, 8);
					}else{
						this.drawStrokePointByImage(ctx, j, points, color);
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
					points[j-1].w = this._setPointWidth(v, j, points);
				}
			}
		},


		init: function() {
			var self = this;
			var canvas = this.canvas;
			var xml = this.xml;
			this.canvas.width = this.opts.viewportWidth;
			this.canvas.height = this.opts.viewportWidth*this.opts.aspectRatio;
			var context = this.canvas.getContext("2d");
			this.initGrid();
			document.body.addEventListener('touchmove', function (event) {event.preventDefault();}, false);//固定页面
			//当字是xml标准字时，不能书写
			if(!this.opts.isXML){
				var touch =("createTouch" in document);
				var startEvent = touch ? "touchstart" : "mousedown";
				var moveEvent = touch ? "touchmove" : "mousemove";
				var endEvent = touch ? "touchend" : "mouseup";
				canvas.addEventListener(startEvent, function(e){
					 	var UIEvent=touch ? e.touches[0] : e; 

						var x = UIEvent.clientX - canvas.getBoundingClientRect().left;
						var y = UIEvent.clientY - canvas.getBoundingClientRect().top;
						self.isDrawing=true;
						self.r++;
						var point = self.setOnePoint(x, y, self.r, self.points);
						self._addPoint(point);
						self.drawStrokePointByImage(context, self.r, self.points);
				}, false);
				canvas.addEventListener(moveEvent, function(e){
					  var UIEvent=touch ? e.touches[0] : e;
						if(self.isDrawing){
							// var x=UIEvent.pageX-UIEvent.target.offsetLeft;
						 //  var y=UIEvent.pageY-UIEvent.target.offsetTop;
						 	var x = UIEvent.clientX - canvas.getBoundingClientRect().left;
						 	var y = UIEvent.clientY - canvas.getBoundingClientRect().top;
						  self.r++;
						  var point = self.setOnePoint(x, y, self.r, self.points);
						  self._addPoint(point);
						  self.drawStrokePointByImage(context, self.r, self.points);
						}
				}, false);
				canvas.addEventListener("mouseout", function(e){
					// console.log("out");
						self._addStroke();
				}, false);
				canvas.addEventListener(endEvent, function(e){
						self._addStroke();
				}, false);
			}

			if(this.opts.xmlFile){
				this.strokeArray.length = 0;
				this.initGrid();
				this.opts.displayMode = {
					brush: 1,
					skeleton: 0,
					strokeColor: 0,
					animation: 0,
					uniformWidth: 0
				};
				this.parseXML();
				this.changeXY(this.strokeArray, this.opts, 1);
				this.drawAllPoints(canvas, this.strokeArray);
			}
			if(xml){
				xml.addEventListener("change",function(){
					self.strokeArray.length = 0;
					self.initGrid();
					self.opts.displayMode = {
						brush: 1,
						skeleton: 0,
						strokeColor: 0,
						animation: 0,
						uniformWidth: 0
					};
					self.parseXML(xml.files[0]);
					self.changeXY(self.strokeArray, self.opts, 1);
					self.drawAllPoints(canvas, self.strokeArray);
				},false);
			}
			
			window.addEventListener("resize",function(){
				self.canvas.width = self.opts.viewportWidth;
				self.canvas.height = self.opts.viewportWidth*self.opts.aspectRatio;
				self.initGrid();
				// self.changeXY();
				// self.drawAllPoints(canvas, self.strokeArray);
			},false);

		},

		drawStrokePoint: function(){

		},

		drawStrokePointByImage: function(ctx, r, points, color, lineWidth) {
			var self = this;
			var d1, sampleNumber;
			var point,prePoint;
			var color;
			var w1, wFirst, wSecond;
			var i;
			var t, x1, y1;
			if(!color){
				var color = 'black';
			}


			if(r > 1) {
				point = points[r-1];
				prePoint = points[r-2];
				
				d1 = self.distance(point.x, point.y, prePoint.x, prePoint.y);
				sampleNumber = parseInt(d1*1);
				if(sampleNumber<=5){
					sampleNumber *= 40;
				}
				//画第一个点到第二个点的笔画
				if(r == 2){
					if(lineWidth){
						ctx.beginPath();
						ctx.arc(prePoint.x,prePoint.y, lineWidth/2, 0, 2*Math.PI);
						ctx.fill();
					}else{
						ctx.beginPath();
						ctx.arc(prePoint.x,prePoint.y, prePoint.w/2, 0, 2*Math.PI);
						ctx.fill();
					}
					ctx.beginPath();
					ctx.arc(prePoint.x,prePoint.y, prePoint.w/2, 0, 2*Math.PI);
					ctx.fill();
					ctx.beginPath();
					ctx.moveTo(prePoint.x, prePoint.y);

					for(var u=0;u<sampleNumber;u++){      
						t=u/(sampleNumber-1);
						x1=(1.0-t)*prePoint.x+t*point.x;
						y1=(1.0-t)*prePoint.y+t*point.y;
					

						if(lineWidth){
							w1 = lineWidth;
						}else{
							w1=(1.0-t)*prePoint.w+t*point.w;
						}
						ctx.lineWidth = w1;
						// ctx.lineWidth = 1;
						ctx.strokeStyle = "black";
						ctx.lineTo(x1,y1);
						ctx.stroke();
					}

					
				//第一个点和第二个点的中点，到第二个点和第三个点的中点，以第二个点为控制点，按照贝塞尔曲线，绘制笔画。
				}
				if(r > 2 ){
						// console.log(r);
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


						ctx.beginPath();
						ctx.moveTo(xFirst, yFirst);
						// console.log(sampleNumber);
						for(var u = 0; u < sampleNumber; u++){
							t = u/(sampleNumber-1);
							x1=(1.0-t)*(1.0-t)*xFirst + 2*t*(1-t)*prePoint.x + t*t*xSecond;
							y1=(1.0-t)*(1.0-t)*yFirst + 2*t*(1-t)*prePoint.y + t*t*ySecond;
							if(lineWidth){
								w1 = lineWidth;
							}else{
								w1=(1.0-t)*(1.0-t)*wFirst + 2*t*(1-t)*prePoint.w + t*t*wSecond;
							}
							ctx.lineWidth = w1;
							// ctx.lineWidth = 1;
							ctx.strokeStyle = 'black';
							// ctx.moveTo(xFirst, yFirst);
							ctx.lineTo(x1,y1);
							ctx.stroke();
							
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
						self.drawStrokePointByImage(ctx, j, points);
						//其实可以单独写一个update参数的，但是因为不清楚函数间传参的规律，待完成。
						if(j < self.strokeArray[i].length) {
							j++;
						}else {
							i++;
							j = 1;
						}
						points = self.strokeArray[i];
						console.log(i);
						console.log(j);
						if(i === self.strokeArray.length){
							clearInterval(intervalID);
							console.log("clear");
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
		gaussian: function(v1, gaussian) {
			return ((1/(Math.sqrt(2*Math.PI)*gaussian))*Math.pow(Math.E,-(v1*v1)/(2*gaussian*gaussian)));
		},
		distance: function(x1,y1,x2,y2) {
			return (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
		},

		getRangeValue: function(ele) {
			var input = ele.getElementsByClassName("scale-range")[0];
			// console.log(input.value);
			// console.log(parseFloat(input.value));
			return parseFloat(input.value);
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
						var v = this._setVelocity(x, y, t, j+1, this.points);
						var w = this._setPointWidth(v, j+1, this.points);
					  point = {
					  	x : x,
						  y : y,
							p : p,
							t : t,
							v : v,
							w : w,
						}
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


	};

	Character.defaultOpts = {
		gaussian: 1.3,
		wmax: 13.0,
		wmin: 2.0,
		timeScale: 15,

		radius: 5,
		lineWidth: 1.2,

		displayMode: {
			brush: 1,
			skeleton: 0,
			strokeColor: 0,
			animation: 0,
			uniformWidth: 0
		},
		strokeColors: ['black', 'gray3', 'gray2', 'gray1'],

		isXML: false,
		xmlFile: 0,
		fileName: "10-4-6-德.xml",
		background: "#fff",

	  charRatio: 0.85,
	  aspectRatio: 4/3,
	  viewportWidth: 500,

	  charBoxWidth: 500,
	  startPosition: {
	  	x: 0,
	  	y: 0
	  },
	};




	window["Character"] = Character;
})(_);


