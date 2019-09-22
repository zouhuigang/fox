// strokeArray[m][r] , m是笔画，r是点数。
// strokeArrayXML[m][r], 导入的xml数组。
// 每个点的数据： {x:横坐标, y:纵坐标 , t:着点时间 ,w: 宽度(与速度相关) ,p:压力值 ,v: 速度}
// t: 是时间差值，t[0]可以设置为0，对于时间值得缩放， 就是对速度的缩放。
// isDrawing  ：判断是否正在画，标识
// points : 单个Stroke笔画的数组，临时数组。
// drawAllPoints(context) :画点，贝塞尔曲线化
// drawStrokePoint(context, r, points)
// gaussian : gaussian function,高斯系数r1.
// getVelcity() :  获取速度。
// getPointWidth(m, r) ：通过速度，计算宽度， 做了平滑处理。
// initGrid() : 初始化网格,drawDottedLine
//parseXML() :解析xml, 并将有效数组放入数组。
// 几个可调变量：时间缩放:timescale, 高斯系数：r1, 最大宽度：wmax, 最小宽度：wmin.




var TIME_SCALE = 15;

//xml字显示宽高比
// var aspectRatio;
var SCREENSCALE = 4/3;
//xml显示出得字，占canvas空间的比例
//var SCALE = 0.85;
var SCALE = 0.80;

var isDrawing = false;
var strokeArray = [];  //存储画板上的所有点
var strokeArrayXML = [];  // 存储xml的所有点
var r = 0;      //笔画中点得索引
var m = 0;      // 笔画的索引


//骨架字
var RADIUS = 5;
var	LINE_WIDTH = 2;
var isSkeleton = false;
var setColor = false;
var isAnimation = false;
var pointDetail = false;
var colors = ['black','gray3','gray2','gray1'];


//获取参数的默认值

var r1 				= parseFloat(document.getElementById('r1-scale-range').value);
var wmax 			= parseFloat(document.getElementById('wmax-scale-range').value);
var wmin 			= parseFloat(document.getElementById('wmin-scale-range').value);
var resetChar = document.getElementById('resetchar');


//声明画幅的三个变量

var sec2cX=[];//画幅x坐标
var sec2cY=[];//画幅y坐标
var sec2R=0;  //字索引

//xml文件
var readxml = 		document.getElementById('readxml');

window.addEventListener("resize",wringting,true);
window.addEventListener("load",wringting,true);

//写字主函数
function wringting(){

	//画板的context
	var canvas = document.getElementById('canvas');

	var width = document.getElementById('canvas-wrap').offsetWidth;
	var height = width*SCREENSCALE;
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext('2d');
	drawAllPoints(context);
	initGrid(context);

	//显示xml字的context
	var canvasxml = document.getElementById('canvasxml');
	canvasxml.width = document.getElementById('secxml-div').offsetWidth;
	canvasxml.height = canvasxml.width * SCREENSCALE;
	var contextxml = canvasxml.getContext('2d');
	contextxml.clearRect(0,0,canvasxml.width,canvasxml.height);
	initGrid(contextxml);
	if(readxml.files[0]){
		changeXY(contextxml,strokeArrayXML);
		drawXMLPoints(contextxml);
	}

	//字幅的context
	// var canvas3 =document.getElementById("canvas3");
	// var sec3div = document.getElementById('sec3div');
	// canvas3.height = sec3div.offsetHeight -5;
	// canvas3.width  = sec3div.offsetWidth  -5;
	// var context3 = canvas3.getContext("2d");


  //判断是手指滑动还是鼠标
	document.body.addEventListener('touchmove', function (event) {event.preventDefault();}, false);//固定页面
	var touch =("createTouch" in document);
	var startEvent = touch ? "touchstart" : "mousedown";
	var moveEvent = touch ? "touchmove" : "mousemove";
	var endEvent = touch ? "touchend" : "mouseup";

	//画板笔画数组，用于传递参数
	var points = [];

/***********************************************************/

	//4个嗅探器，start,move,end, mouseout
	// canvas['on'+startEvent]= function(e){
	// 	console.log(e);
	//  	var UIEvent=touch ? e.touches[0] : e; 
	// 	var x = UIEvent.clientX - canvas.getBoundingClientRect().left;
	// 	var y = UIEvent.clientY - canvas.getBoundingClientRect().top;
	// 	isDrawing=true;
	// 	r++;
	// 	m++;
	// 	var point = getOnePoint(x, y, r, points);
	// 	points.push(point);
	// 	drawStrokePoint(context, r, points);

	// }
	canvas.addEventListener(startEvent,startDraw, false);
	function startDraw(e){
		console.log(e);
		var UIEvent=touch ? e.touches[0] : e; 
		var x = UIEvent.clientX - canvas.getBoundingClientRect().left;
		var y = UIEvent.clientY - canvas.getBoundingClientRect().top;
		isDrawing=true;
		r++;
		m++;
		var point = getOnePoint(x, y, r, points);
		points.push(point);
		drawStrokePoint(context, r, points);
	}
	canvas['on'+moveEvent]=function(e){
	  var UIEvent=touch ? e.touches[0] : e;
		if(isDrawing){
			// var x=UIEvent.pageX-UIEvent.target.offsetLeft;
		 //  var y=UIEvent.pageY-UIEvent.target.offsetTop;
		 	var x = UIEvent.clientX - canvas.getBoundingClientRect().left;
		 	var y = UIEvent.clientY - canvas.getBoundingClientRect().top;
		  r++;
		  var point = getOnePoint(x, y, r, points);
		  points.push(point);
		  drawStrokePoint(context, r, points);
		}
	}
	canvas.onmouseout=function(e){
		if(isDrawing) {
			strokeArray.push(points.slice());
	    points.length = 0;
		}
    
    // console.log(points);
    isDrawing = false;
    r = 0;
	}
	canvas['on'+endEvent]=function(e){
		//slice函数可以拷贝数组
		if(isDrawing) {
			strokeArray.push(points.slice());
			// points.splice(0,points.length);
			points.length = 0;
		}
		
		isDrawing = false; 
		r = 0;
	}

/****************************************************************/


	//获取range控件
	var r1_scale = 		document.getElementById('r1-scale-range');
	var wmax_scale = 	document.getElementById('wmax-scale-range');
	var wmin_scale = 	document.getElementById('wmin-scale-range');

  //xml文件改变后,重绘canvasxml.
	readxml.onchange=function(){
		strokeArrayXML.length = 0;		
		contextxml.clearRect(0,0,canvasxml.width,canvasxml.height);
		initGrid(contextxml);
		parseXML(readxml.files[0]);
		changeXY(contextxml,strokeArrayXML);
		drawXMLPoints(contextxml);	
		
	}

	//当range控件使用鼠标移动时，重绘。
	// r1_scale.onmousemove = function(){
	// 	r1 = parseFloat(r1_scale.value);
	// 	context.clearRect(0,0,canvas.width,canvas.height);
	// 	initGrid(context);
	// 	drawAllPoints(context);

	// 	contextxml.clearRect(0,0,canvasxml.width,canvas.height);
	// 	initGrid(contextxml);
	// 	drawXMLPoints(contextxml);

	// 	changeText(this);
	// };
	r1_scale.onchange = function() {
		r1 = parseFloat(r1_scale.value);
		context.clearRect(0,0,canvas.width,canvas.height);
		initGrid(context);
		drawAllPoints(context);

		contextxml.clearRect(0,0,canvasxml.width,canvas.height);
		initGrid(contextxml);
		drawXMLPoints(contextxml);

		changeText(this);
		changeText(this);
	}



	// wmax_scale.onmousemove = function() {
	// 	wmax = parseFloat(wmax_scale.value);
	// 	context.clearRect(0,0,canvas.width,canvas.height);
	// 	initGrid(context);
	// 	drawAllPoints(context);

	// 	contextxml.clearRect(0,0,canvasxml.width,canvas.height);
	// 	initGrid(contextxml);
	// 	drawXMLPoints(contextxml);
		
	// 	changeText(this);
	// };
	wmax_scale.onchange = function() {
		wmax = parseFloat(wmax_scale.value);
		context.clearRect(0,0,canvas.width,canvas.height);
		initGrid(context);
		drawAllPoints(context);

		contextxml.clearRect(0,0,canvasxml.width,canvas.height);
		initGrid(contextxml);
		drawXMLPoints(contextxml);
		changeText(this);
	}

	// wmin_scale.onmousemove = function() {
	// 	wmin = parseFloat(wmin_scale.value);
	// 	context.clearRect(0,0,canvas.width,canvas.height);
	// 	initGrid(context);
	// 	drawAllPoints(context);

	// 	contextxml.clearRect(0,0,canvasxml.width,canvas.height);
	// 	initGrid(contextxml);
	// 	drawXMLPoints(contextxml);

	// 	changeText(this);
	// };
	wmin_scale.onchange = function() {
		wmin = parseFloat(wmin_scale.value);
		context.clearRect(0,0,canvas.width,canvas.height);
		initGrid(context);
		drawAllPoints(context);

		contextxml.clearRect(0,0,canvasxml.width,canvas.height);
		initGrid(contextxml);
		drawXMLPoints(contextxml);
		changeText(this);
	}
	/**
	 * 重置参数
	 */
	resetChar.onclick = function(){
		r1 = document.getElementById("r1-scale-range").value=1.3;
		wmax = document.getElementById("wmax-scale-range").value=13;
		wmix = document.getElementById("wmin-scale-range").value=2;
		context.clearRect(0,0,canvas.width,canvas.height);
		initGrid(context);
		drawAllPoints(context);

		contextxml.clearRect(0,0,canvasxml.width,canvas.height);
		initGrid(contextxml);
		drawXMLPoints(contextxml);

		changeText(r1_scale);
		changeText(wmax_scale);
		changeText(wmin_scale);

	};


	document.getElementById('xml-origin').onclick = function(){
		isSkeleton = false;
		setColor = false;
		isAnimation = false;
		var pointDescribe = document.getElementById("point-describe");
		pointDescribe.style.display = 'none';
		contextxml.clearRect(0,0,canvasxml.width,canvasxml.height);
		initGrid(contextxml);
		drawXMLPoints(contextxml);
	}
	document.getElementById('xml-skeleton').onclick = function(){
		isSkeleton = true;
		setColor = false;
		isAnimation = true;
		var pointDescribe = document.getElementById("point-describe");
		pointDescribe.style.display = 'none';
		contextxml.clearRect(0,0,canvasxml.width,canvasxml.height);
		initGrid(contextxml);
		drawXMLPoints(contextxml);
	}
	document.getElementById('xml-color').onclick = function(){
		if(!setColor){
			setColor = true;
		}
		isSkeleton = false;
		isAnimation = true;
		var pointDescribe = document.getElementById("point-describe");
		pointDescribe.style.display = 'none';
		contextxml.clearRect(0,0,canvasxml.width,canvasxml.height);
		initGrid(contextxml);
		drawXMLPoints(contextxml);
	}
	document.getElementById('xml-animation').onclick = function() {
		if(!isAnimation){
			isAnimation = true;
		}
		isSkeleton = false;
		setColor = false;
		contextxml.clearRect(0,0,canvasxml.width,canvasxml.height);
		initGrid(contextxml);
		if(strokeArrayXML.length != 0){
			var intervalID;
			var i = 0;
			var j = 1;
			var points = strokeArrayXML[i];
			intervalID = setInterval(
				function() {
					drawStrokePoint(contextxml, j, points);
					//其实可以单独写一个update参数的，但是因为不清楚函数间传参的规律，待完成。
					if(j < strokeArrayXML[i].length) {
						j++;
					}else {
						i++;
						j = 1;
					}
					points = strokeArrayXML[i];
					console.log(i);
					console.log(j);
					if(i === strokeArrayXML.length){
						clearInterval(intervalID);
						console.log("clear");
					}
					
				}
				,
				50
			);
			console.log('ok');
		}
	}
	canvasxml.onclick = function(e) {
		if(isSkeleton){
			var i,j,x,y,t,p,v,w;
			var pointDetail = true;
			
			var pointDescribe = document.getElementById("point-describe");
			
			var spans = pointDescribe.getElementsByTagName("span");
			var UIEvent=touch ? e.touches[0] : e;
			var clickedX = UIEvent.clientX - canvasxml.getBoundingClientRect().left;
			var clickedY = UIEvent.clientY - canvasxml.getBoundingClientRect().top;
			for(i=0; i<strokeArrayXML.length; i++){
				for(j=0; j<strokeArrayXML[i].length; j++){
					x = strokeArrayXML[i][j].x;
					y = strokeArrayXML[i][j].y;
					t = strokeArrayXML[i][j].t;
					p = strokeArrayXML[i][j].p;
					v = strokeArrayXML[i][j].v;
					w = strokeArrayXML[i][j].w;
					if(clickedX < x + RADIUS && clickedX > x - RADIUS&& clickedY < y+RADIUS && clickedY > y - RADIUS){
						spans[0].innerHTML = parseFloat(Math.round(x * 100)/100).toFixed(2); 
						spans[1].innerHTML = parseFloat(Math.round(y * 100)/100).toFixed(2)
						spans[2].innerHTML = parseFloat(Math.round(t * 100)/100).toFixed(2); 
						spans[3].innerHTML = parseFloat(Math.round(p * 100)/100).toFixed(2);
						spans[4].innerHTML = parseFloat(Math.round(v * 100)/100).toFixed(2); 
						spans[5].innerHTML = parseFloat(Math.round(w * 100)/100).toFixed(2);
						pointDescribe.style.display = 'block';
						// contextxml.clearRect(0,0,canvasxml.width,canvasxml.height);
						// initGrid(contextxml);
						// drawClickedPoint(contextxml, i,j);


					}
				}	
			}
		}
	}



	//获取删除，保存按钮, 保持原来的名字
	var sec2Clear = document.getElementById('sec2Clear');
	var sec2Save  = document.getElementById('sec2Save');
	// var sec2Test  = document.getElementById('sec2Test');

	// 清空写字板
	sec2Clear.onclick = function(){
		context.clearRect(0,0,canvas.width,canvas.height);
		initGrid(context);
		strokeArray.length = 0;
	}

	//将写好的字保存到画幅中
	// sec2Save.onclick = function() {
	// 	context.clearRect(0,0,canvas.width,canvas.height);
	// 	drawAllPoints(context);
	// 	saveimage(context3);
	// 	initGrid(context);
	// }

	//pop画幅中得字
	// sec2Test.onclick=function(){
	// 	if(sec2R>=0){
	// 	sec2cX.pop(sec2R--);
	// 	if(sec2R<0){
	// 		sec2R = 0;
	// 		sec2cX=[];
	// 		sec2cY=[];
	// 	}
	// 	context3.clearRect(sec2cX[sec2R],0,100,100);
	//  }
	// }
}

/***************************************************/

//将写好的字，暂存到画幅中。
function saveimage(ctx){
	if(sec2R==0){
		sec2cX.push(0);
	}
	var mycanvas = document.getElementById("canvas");
	var imgurl = mycanvas.toDataURL("image/png");
	var imgchar=document.createElement("img");
	imgchar.setAttribute("src", imgurl);  
	ctx.drawImage(imgchar,sec2cX[sec2R],0,100,100);
	sec2R++;
	sec2cX.push(sec2cX[sec2R-1]+100);
}

function changeText(obj) {
	var val = obj.value;
	var span = obj.nextSibling.nextSibling;
	span.innerHTML = val;
}

//绘制单个笔画上的单个点，用到了贝塞尔曲线知识
function drawStrokePoint(ctx, r, points,color) {
	var d1, sampleNumber;
	var point,prePoint;
	//为手写字设置的
	if(!color){
		var color = 'black';
	}
	
	var image = new Image();
	image.src = "image/model-"+color+".png";
	image.onload = function() {
		if(r > 1) {
			point = points[r-1];
			prePoint = points[r-2];
			d1 = distance(point.x, point.y, prePoint.x, prePoint.y);
			sampleNumber = parseInt(d1*50);
			if(r == 2){
				for(var u=0;u<sampleNumber;u++){
					var t=u/(sampleNumber-1);
					var x1=(1.0-t)*prePoint.x+t*point.x;
					var y1=(1.0-t)*prePoint.y+t*point.y;
					var w1=(1.0-t)*prePoint.w+t*point.w;	
					ctx.drawImage(image,x1-w1,y1-w1,w1*2,w1*2);  		
				}
			}
			if(r > 2){	
					var xFirst = (points[r-3].x + prePoint.x) * 0.5; 
					var yFirst = (points[r-3].y + prePoint.y) * 0.5; 
					var wFirst = (points[r-3].w + prePoint.w) * 0.5; 

					var xSecond = (point.x + prePoint.x) * 0.5; 
					var ySecond = (point.y + prePoint.y) * 0.5; 
					var wSecond = (point.w + prePoint.w) * 0.5; 
						//Now we perform a Beizer evaluation 	
					for(var u = 0; u < sampleNumber; u++){
						var t = u/(sampleNumber-1);
							
						var x1=(1.0-t)*(1.0-t)*xFirst + 2*t*(1-t)*prePoint.x + t*t*xSecond;
						var y1=(1.0-t)*(1.0-t)*yFirst + 2*t*(1-t)*prePoint.y + t*t*ySecond;
						var w1=(1.0-t)*(1.0-t)*wFirst + 2*t*(1-t)*prePoint.w + t*t*wSecond;
							
						ctx.drawImage(image,x1-w1,y1-w1,w1*2,w1*2);  		
					}
			}
		}
	}
	
}

//绘制单个笔画的骨架
function drawStrokeSkeleton(ctx, r, points) {
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

}
//绘制骨架字的每个顿点的圆圈
function drawPointCircles(ctx, r, points) {	
	// if(r==1){
	// 	ctx.beginPath();
	// 	ctx.arc(points[r-1].x,points[r-1].y,RADIUS,0,2*Math.PI,false);
	// }else if(r !==points.length){
	// 	ctx.beginPath();
	// 	ctx.arc(points[r-1].x,points[r-1].y,RADIUS,0,2*Math.PI,false);
	// }else {
	// 	ctx.beginPath();
	// 	ctx.arc(points[r-1].x,points[r-1].y,RADIUS,0,2*Math.PI,false);
	// 	}
	ctx.beginPath();
	ctx.arc(points[r-1].x,points[r-1].y,RADIUS,0,2*Math.PI,false);
		ctx.lineWidth = 1.5;
	ctx.strokeStyle='black';
	ctx.stroke();
	
}
//绘制点击后的圆圈
function drawClickedPoint(ctx, i, j){
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
}

//根据保存的大数组，触发参数后，需要更新w，再绘制所有的点。
function drawAllPoints(ctx){
	var i, j;
	for(i = 0; i< strokeArray.length; i++){
		for(j=1; j<= strokeArray[i].length; j++){
			var v = strokeArray[i][j-1].v;
			var points = strokeArray[i];
			points[j-1].w = getPointWidth(v, j, points);
			drawStrokePoint(ctx, j, points);
		}
	}
}


//取得一个点得所有参数，以对象的方式存储。
function getOnePoint(x, y, r, points){
	var t,v,w,p;
	t = Date.now();
	v = getVelocity(x, y, t, r, points);
	w = getPointWidth(v, r, points);
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

}

//计算点的宽度
function getPointWidth(v, r, points) {
	var a, v2, w;
	a=wmax/gaussian(0, r1);
	v2 = gaussian(v, r1);
	w = a*v2;
	if(w < wmin){
		w = wmin;
	}
	if(r == 1){
		return wmax;
	}else {
		return (w + points[r-2].w)/2;
	}
}
//计算速度
function getVelocity(x, y, t, r, points ) {
	var velocity;
	if(r == 1){
		return 0;
	}else {
		var prePoint = points[r-2];
		var deltatime = t - points[r-2].t;
		if(deltatime == 0){
			velocity = prePoint.v;
		}else {
			velocity = distance(x, y, prePoint.x, prePoint.y)/deltatime;
		}
		if( r > 2 ){
			velocity = velocity * 0.6 + points[r-2].v * 0.3 + points[r-3].v * 0.1;	
		}else{
			velocity = velocity * 0.7 + points[r-2].v * 0.3;
		}
		return velocity;
	}
}

//两点距离公式
function distance(x1,y1,x2,y2) {
	return (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
}

//高斯分布
function gaussian(v1, r1){
	return ((1/(Math.sqrt(2*Math.PI)*r1))*Math.pow(Math.E,-(v1*v1)/(2*r1*r1)));
}

//初始化网格
function initGrid(ctx){
	ctx.beginPath();
	ctx.strokeStyle='gray';
	ctx.lineWidth=1.5;
	ctx.moveTo(0,ctx.canvas.height/2);
	ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2);
	ctx.moveTo(ctx.canvas.width/2,0);
	ctx.lineTo(ctx.canvas.width/2,ctx.canvas.height);
	ctx.stroke();
	ctx.lineWidth=0.5;
	drawDottedLine(ctx,0,0,ctx.canvas.width,ctx.canvas.height,10);
	drawDottedLine(ctx,0,ctx.canvas.height,ctx.canvas.width,0,10);
	ctx.closePath();
}

//绘制虚斜线
function drawDottedLine(context,x1,y1,x2,y2,dashLength){
	dashLength=dashLength===undefined?5:dashLength;
	var deltaX=x2-x1;
	var deltaY=y2-y1;
	var numDashes=Math.floor(Math.sqrt(deltaX*deltaX+deltaY*deltaY)/dashLength);
	for(var i=0;i<numDashes;++i){
		context[i%2===0?'moveTo':'lineTo']
		(x1+(deltaX/numDashes)*i,y1+(deltaY/numDashes)*i);
	}
	context.stroke();
}

//解析xml，得到strokeArrayXML数组。
function parseXML(xmlfile){
	var i, j;
	var xmlDoc = loadXML(xmlfile);
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
					t=(points[j-1].t+Number(stroke[i].childNodes[j].getAttribute("deltaTime"))/TIME_SCALE);
				}
				var v = getVelocity(x, y, t, j+1, points);
				var w = getPointWidth(v, j+1, points);
			  point = {
			  	x : x,
				  y : y,
					p : p,
					t : t,
					v : v,
					w : w,
				}
				points.push(point);
		}
		strokeArrayXML.push(points);

	}
}



//根据strokeArrayXML,绘制所有的xml的点
function drawXMLPoints(ctx){
	var i, j;
	var color;
	for(i = 0; i< strokeArrayXML.length; i++){

		if(setColor){
			// color = colors[Math.floor(Math.random()*colors.length)];
			color = colors[i%4];
		}else {
			color = "black";
		}
		for(j=1; j<= strokeArrayXML[i].length; j++){
			var v = strokeArrayXML[i][j-1].v;
			var points = strokeArrayXML[i];
			points[j-1].w = getPointWidth(v, j, points);
			if(isSkeleton){
				drawStrokeSkeleton(ctx, j, points);
				drawPointCircles(ctx, j, points);
			}else {
				drawStrokePoint(ctx, j, points,color);
			}
			
		}
	}
}

//update 需要绘制的点的参数
//这个函数可以先留着
function update(){

}

//将xml文件，解析为xml格式化对象。 
function loadXML(xmlFile){
  var xmlDoc ;
  var url = window.URL.createObjectURL(xmlFile);
  xmlhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.open("GET", url, false);
  xmlhttp.onload = function(){
      if( xmlhttp.readyState == 4 && xmlhttp.status == 200){
          xmlDoc =  xmlhttp.responseXML;
      }
  }
  xmlhttp.send(null);
  return xmlDoc;
}

//将xml的字的大小，缩放为canvasxml比例。
function changeXY(ctx,arr){
	var minX=arr[0][0].x;
	var minY=arr[0][0].y;
	var maxX=arr[0][0].x;
	var maxY=arr[0][0].y;
	
	//Find the global bounding box
	for(var i=0;i<arr.length;i++){
		for(var j=1;j<arr[i].length;j++){
			if(minX>arr[i][j].x){minX=arr[i][j].x;}
			if(minY>arr[i][j].y){minY=arr[i][j].y;}
			if(maxX<arr[i][j].x){maxX=arr[i][j].x;}
			if(maxY<arr[i][j].y){maxY=arr[i][j].y;}
		}
	}
	var widthX=maxX-minX;
	var heightY=maxY-minY;
	var centerX=(minX+maxX)*0.5;
	var centerY=(minY+maxY)*0.5;
	// 保存长宽比，不然显示出来的就是1：1
	
	var aspectRatio=widthX/heightY;

	
	// console.log(aspectRatio);
	//shrink a little bit to fit into the canvas
	//字在区域内显示的比例
	var scale= SCALE;
	//if the width is larger, make sure it is within range
	if( aspectRatio > 1.0){
		scale/=aspectRatio;
	}

	var widthCanvas=ctx.canvas.width;
	var heightCanvas=ctx.canvas.height;

	//这里有个问题：字随着canvas的比例缩放。文字自身的比例也会变化。 如何限定文字自身的比例？
	for(var i=0;i<arr.length;i++){
		for(var j=0;j<arr[i].length;j++){
			//normalize the coordinates into [-1,1]	
			arr[i][j].x=(arr[i][j].x-centerX)*scale/widthX;
			arr[i][j].y=(arr[i][j].y-centerY)*scale/heightY;
			//map to canvas space
			// 缩放需要对应字的比例，固定比例为字的原始比例。
			arr[i][j].x=(arr[i][j].x*aspectRatio+0.5)*widthCanvas;
			//字要缩放一样的倍数，然后平移1/2画布高度。
			arr[i][j].y=arr[i][j].y*widthCanvas+0.5*heightCanvas;
			// arr[i][j].y=(arr[i][j].y+0.5)*heightCanvas;
		}
	}
}












