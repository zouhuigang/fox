;(function(_){

	var Chars = function(id, opts){
		
		this.opts = this.mergeOptions(opts);
		this.charArray = [];
		this.charNum = -1;   //指向当前操作的字
		this.charPointer = -1;
		this.id = id;
		this.el = document.getElementById(id);

		var tpl = '<div class="chars-wrapper"><canvas class="chars-canvas"></canvas></div>';
		tpl = '<div class="chars-controls"></div>' + tpl;
		this.el.innerHTML = tpl;
		this.charPos = [];
		this.dom = {
			canvas: this.el.querySelector(".chars-canvas"),
			canvasWrapper: this.el.querySelector(".chars-wrapper"),
			controls: this.el.querySelector(".chars-controls")
		};
		this.charsBox = [];
		this.canvas = this.dom.canvas;
		this.initControls();
		this.context = this.canvas && this.canvas.getContext&&this.canvas.getContext('2d') ? this.canvas.getContext('2d') : null;

		this.init();
		this.opts.viewportWidth = this.canvas.width;
		
		
	};

	Chars.prototype = {
		constructor: Chars,

		mergeOptions: function(opts) {
			opts = _.assign({}, Chars.defaultOpts,this.opts,opts);
			return opts;
		},

		addChar : function(strokeArray, img, opts) {
			var charPos = this.getCharPos();
			if(strokeArray.length){
				var context = this.canvas.getContext('2d');
				
				var startX = charPos[this.charNum].x;
				var startY = charPos[this.charNum].y;
				opts = this.mergeCharOptions(opts,{
						startPosition:{
							x:startX,
							y:startY
						},
						charBoxWidth: this.opts.charBoxWidth
				});

				this.charArray[this.charNum] = {
					strokeArray: _.cloneDeep(strokeArray),
					img:  img,
					opts: opts
				};
				
			}			
		},


		addCharBox: function() {
			var box = new window['Chars']['Box'](this);
			this.charsBox.push(box);
			this.charNum++;
			//初始化点击状态
			for(var i=0; i<this.charsBox.length; i++){
				if(this.charNum === i){
					// this.charsBox[i].isDragging = true;
					this.charsBox[i].flag = true;
					this.charsBox[i].isHitImage = true;
				}else {
					this.charsBox[i].flag = false;
					this.charsBox[i].isDown = false;
					// this.charsBox[i].isHitImage = false;
					this.charsBox[i].isResizing = false;
					this.charsBox[i].isDragging = false;
				}
				this.charsBox[i].id = i;
			}


		},



		getCharPos: function(){
			// var charPos = [
				
			// ];
			// 一个简单的问题想那么复杂，编程经验真是太少了！
			this.charPos.length = 0;
			var pos;
			for(var i=0; i<this.charsBox.length; i++) {
				pos = {
					x: this.charsBox[i].opts.startPosX,
					y: this.charsBox[i].opts.startPosY,
					r: this.charsBox[i].opts.rotation,
					w: this.charsBox[i].opts.charBoxWidth,
				}
				this.charPos.push(pos);
			}
			var charPos = this.charPos;
			return charPos;
		},
		mergeCharOptions: function(opts, charOpts) {
			var opts = _.assign({}, opts, charOpts);
			return opts;
		},

		clearChar: function() {
			
			var charsBox = this.charsBox;
			var charArray = this.charArray;
			for(var i=0; i<charsBox.length; i++){
				if(charsBox[i].flag === true){
					charsBox.splice(i,1);
					charArray.splice(i,1);
					this.charNum--;

				}
			} 
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			for(var i=0; i<charsBox.length; i++){
				charsBox[i].drawRotationHandle(true);
				charsBox[i].drawRect();
				charsBox[i].drawAnchor(true);
			}
		},
		
		updateChar: function(strokeArray, img, opts) {
			var charsBox = this.charsBox;
			var charArray = this.charArray;
			var removedCharBox;
			var removedCharArray;
			var isflag = 0;
			for(var i=0; i<charsBox.length; i++){
				if(charsBox[i].flag === true){
					removedCharBox = charsBox.splice(i,1);
					removedChar = charArray.splice(i,1);
					isflag = 1;
					charsBox.push(removedCharBox[0]);
					// charArray.push(removedChar);
				}
			}
			if(!isflag){
				alert("have no charBox selected!");
				return;
			}

			this.charArray[this.charNum] = {
				strokeArray: _.cloneDeep(strokeArray),
				img: img,
				opts: opts
			};
			this.charPos = this.getCharPos();
			console.log(this.charPos);

		},

		init: function() {
			var self = this;
			var canvas = this.canvas;
			canvas.width = this.dom.canvasWrapper.clientWidth;
			canvas.height = this.dom.canvasWrapper.clientHeight;
			var context = this.canvas.getContext('2d');
			// canvas.style.background = this.opts.background;
			canvas.style.backgroundImage = "url("+this.opts.backgroundImage+")";
			canvas.style.backgroundRepeat = "no-repeat"	;
			canvas.style.backgroundSize = "contain";

			this.initEvent();

		},

		initEvent: function() {
			this.canvas.addEventListener('dblclick', function(e){
				this.handleDblClick(e);
				console.log("1");
			}.bind(this), false);
		},

		handleDblClick: function(e) {
			var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
			var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);
			this.dblClickImage(mouseX, mouseY);
		},

		draw: function() {

			var charsBox = this.charsBox;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			for(var i=0; i<charsBox.length; i++){
				// if(i !== this.charPointer){
					charsBox[i].drawRotationHandle(true);
					charsBox[i].drawRect();
					charsBox[i].drawAnchor(true);
			// 	}
				
			}

			
		},

		dblClickImage: function(x, y) {
			// return (x > charStartX-charW/2 && x < charW/2+charStartX && y > charStartY - charW/2 && y < charStartY + charW/2);
	    var charsBox = this.charsBox;
	    for(var i= charsBox.length-1; i>=0; i--){
	    	var charW = charsBox[i].opts.charBoxWidth;
	    	var charH = charsBox[i].opts.charBoxWidth * charsBox[i].opts.charBoxRatio;
	    	var charStartX = charsBox[i].opts.startPosX + charsBox[i].opts.referencePoint.x;
	    	var charStartY = charsBox[i].opts.startPosY + charsBox[i].opts.referencePoint.y;
	    	var index;
	    	var one = 0;
	    	if(((x - charStartX)*(x-charStartX) + (y-charStartY) * (y-charStartY) <= charW/2*charW/2 )
	    		&& !charsBox[i].isHitImage 
	    		&& !charsBox[i].flag
	    		&& !one
	    		){
	    		charsBox[i].isHitImage = true;
					charsBox[i].flag = true;
					index = i;
					one = 1;
	    	}else {
	    		index = -1;
	    		charsBox[i].flag = false;
					charsBox[i].isDown = false;
					charsBox[i].isHitImage = false;
					charsBox[i].isResizing = false;
					charsBox[i].isDragging = false;
	    	}
	    	this.draw();
	    }
		},

		initControls: function() {
			this.controls = {};
			if(!this.opts.controls.length || !Chars.Control)
				return false;
			for(var i=0; i<this.opts.controls.length; i++) {
				var c = null;
				if(typeof this.opts.controls[i] == "string") {
					c = new window['Chars']['Control'][this.opts.controls[i]](this);
				}else if(typeof this.opts.controls[i] == "object"){
					for(var controlName in this.opts.controls[i]) break;
					c = new window['Chars']['Control'][controlName](this, this.opts.controls[i][controlName]);
				}
				if(c) {
					this.dom.controls.appendChild(c.el);
					if(!this.controls) {
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
		}
	};

	Chars.defaultOpts = {
		controls:[
			'Edit'
		],  //这个参数可以先留着，用于展示工具栏。

		background: "#ccc",
		backgroundImage: "/static/images/services/shanzi.png",

	  // viewportWidth:500,
	  // viewportHeight:640,
	  // aspectRatio: 16/9,

	  charBoxWidth: 60,
	  charBoxRatio: 4/3
	};



	Chars.Box = function(board, opts){
		this.board = board;
		this.canvas = board.canvas;
		this.ctx = board.context;
		this.opts = this.mergeOptions(opts);
		this.initOpts();

		this.id;
		this.isDown = false;
		this.isDragging = false;
		this.flag = false;

		this.isHitImage =false;
		this.withAnchor = false;



		// this.initialize();
	};

	Chars.Box.prototype = {

		constructor: Chars.Box,

		mergeOptions: function(opts) {
			opts = _.assign({}, Chars.Box.defaultOpts,opts);
			return opts;
		},

		initialize: function(){
			var imageData = this.board.charArray[this.board.charNum].img;

			// this.img = imageData.replace("image/png", "image/octet-stream");
			this.img = new Image();
			this.img.src = imageData;
			this.img.onload = function () {
			    this.board.draw();
			}.bind(this);
			
			this.initEvent();

		},

		initOpts: function() {
			// this.opts.startPosX = 0;
			// this.opts.startPosY = 0;
			// this.opts.
		},

		initEvent: function() {
			this.canvas.addEventListener('mousedown', function(e){
				this.handleMouseDown(e);
			}.bind(this), false);
			this.canvas.addEventListener('mousemove', function(e){
				this.handleMouseMove(e);
			}.bind(this), false);
			this.canvas.addEventListener('mouseup', function(e){
				this.handleMouseUp(e);
			}.bind(this), false);
			this.canvas.addEventListener('mouseout', function(e){
				this.handleMouseOut(e);
			}.bind(this), false);
			// this.canvas.addEventListener('click', function(e){
			// 	this.handleMouseClick(e);
			// }.bind(this), false);
			// this.canvas.addEventListener('dblclick', function(e){
			// 	this.handleDblClick(e);
			// }.bind(this), false);
		},




		drawRect: function() {
			var w = this.img.width;
			var h = this.img.height;
			var ctx = this.ctx;
			var lineWidth = 2;

			var charW = this.opts.charBoxWidth;
			var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
			var charStartX = this.opts.startPosX;
			var charStartY = this.opts.startPosY;
			var refX = this.opts.referencePoint.x;
			var refY = this.opts.referencePoint.y;

			ctx.save();
			ctx.translate(refX, refY);
			ctx.translate(charStartX,charStartY);
			ctx.rotate(this.opts.rotation);
			ctx.drawImage(this.img, 0, 0, w, h, -charW/2, -charH/2, charW, charH);
			if(this.flag){
	 			ctx.shadowColor = "black";
	 			ctx.shadowOffsetY = 1;
	 			ctx.shadowOffsetX = 1;
	 			ctx.shadowBlur = 3;
	 			ctx.beginPath();
	 			ctx.rect(-charW/2, -charH/2, charW, charH);
	 			ctx.strokeStyle = "black";
	 			ctx.lineWidth = 1;
	 			ctx.stroke();
	 			ctx.closePath();
	 		}

	 		if(this.isDragging) {
	 			ctx.beginPath();
	 			ctx.rect(-charW/2, -charH/2, charW, charH);
	 			ctx.strokeStyle = "blue";
	 			ctx.lineWidth = lineWidth;
	 			ctx.stroke();
	 			ctx.closePath();
	 		}

	 		
			ctx.restore();

		},

		drawAnchor: function(withFill){
			var ctx = this.ctx;
			var charStartX = this.opts.startPosX;
			var charStartY = this.opts.startPosY;
			var refX = this.opts.referencePoint.x;
			var refY = this.opts.referencePoint.y;
			var charW = this.opts.charBoxWidth;
			var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
			if(this.flag){
				ctx.save();
				ctx.translate(refX, refY);
				ctx.translate(charStartX,charStartY);

				ctx.rotate(this.opts.rotation);
	 			ctx.beginPath();
				ctx.arc(charW/2, charH/2,this.opts.radius, 0, 2*Math.PI, false);
				ctx.closePath();
				if(withFill){
					ctx.fillStyle = "blue";
					ctx.fill();
				}
				ctx.restore();
	 		}
		},

		drawRotationHandle: function(withFill) {
			var charW = this.opts.charBoxWidth;
			var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
			var charStartX = this.opts.startPosX;
			var charStartY = this.opts.startPosY;

			var refX = this.opts.referencePoint.x;
			var refY = this.opts.referencePoint.y;
			if(this.flag){
				this.ctx.save();
				this.ctx.translate(refX, refY);
				this.ctx.translate(charStartX, charStartY);
				this.ctx.rotate(this.opts.rotation);
				this.ctx.beginPath();
				this.ctx.moveTo(charW/2, -1);
		    this.ctx.lineTo(charW/2 + 10, -1);
		    this.ctx.lineTo(charW/2 + 10, -7);
		    this.ctx.lineTo(charW/2 + 20, -7);
		    this.ctx.lineTo(charW/2 + 20, 7);
		    this.ctx.lineTo(charW/2 + 10, 7);
		    this.ctx.lineTo(charW/2 + 10, 1);
		    this.ctx.lineTo(charW/2, 1);
		    this.ctx.closePath();
		    if(withFill) {
			    this.ctx.fillStyle = "blue";
			    this.ctx.fill();
		    }
		    this.ctx.restore();
			}

		},

		hitImage: function(x, y) {
			var charW = this.opts.charBoxWidth;
			var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
			var charStartX = this.opts.startPosX + this.opts.referencePoint.x;
			var charStartY = this.opts.startPosY + this.opts.referencePoint.y;

			return (x - charStartX)*(x-charStartX) + (y-charStartY) * (y-charStartY) <= charW/2*charW/2;
		},



		hitAnchor: function(x, y) {
			var charW = this.opts.charBoxWidth;
			var charH = this.opts.charBoxWidth * this.opts.charBoxRatio;
			var charStartX = this.opts.startPosX + this.opts.referencePoint.x;
			var charStartY = this.opts.startPosY + this.opts.referencePoint.y;
			var r = this.opts.radius;


			return (x > charStartX + charW/2 - r &&
							x < charStartX + charW/2 + r &&
							y > charStartY + charH/2 - r &&
							y < charStartY + charH/2 + r
							);
		},


		handleMouseDown: function(e){
			var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
			var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);
			
			this.opts.mouseStartX = mouseX;
			this.opts.mouseStartY = mouseY;
			
			// this.isDown = this.hitAnchor();
			// this.hitImage(this.opts.mouseStartX, this.opts.mouseStartY);
			// this.isHitImage = this.hitImage(this.opts.mouseStartX, this.opts.mouseStartY);
			// this.isDragging = this.hitImage(this.opts.mouseStartX, this.opts.mouseStartY);

			if(this.flag) {
				this.isDragging = this.hitImage(this.opts.mouseStartX, this.opts.mouseStartY);
				this.drawAnchor(false);
				this.isResizing = this.ctx.isPointInPath(mouseX, mouseY);
				this.drawRotationHandle(false);
				this.isDown = this.ctx.isPointInPath(mouseX, mouseY);
			}

			// this.isResizing = this.hitAnchor(this.opts.mouseStartX, this.opts.mouseStartY);

		},

		handleMouseUp: function(e) {
			this.isDown = false;
			this.isDragging = false;
			this.isResizing = false;
			this.board.draw();
		},   

		handleMouseOut: function(e) {
			this.isDown = false;
			this.isDragging = false;
			this.isResizing = false;
			this.board.draw();
		},

		// handleDblClick: function(e) {
		// 	var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
		// 	var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);
		// 	console.log([mouseX, mouseY]);
		// 	this.dblClickImage(mouseX, mouseY);

		// 	// if(this.isHitImage){
		// 	// 	this.flag = (this.flag === true ? false : true);
		// 	// }
			
		// 	// console.log(this.isHitImage);
		// 	// console.log(this.flag);
			
		// },

		handleMouseMove: function(e) {
			var refX = this.opts.referencePoint.x;
			var refY = this.opts.referencePoint.y;


			var startX = this.opts.mouseStartX;
			var startY = this.opts.mouseStartY;

			if(this.isDragging) {
				var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
				var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);

				var dx = mouseX - startX;
				var dy = mouseY - startY;

				this.opts.startPosX += dx; 
				this.opts.startPosY += dy;

				this.opts.mouseStartX = mouseX;
				this.opts.mouseStartY = mouseY;

				this.board.draw();
			}else if(this.isDown) {
				// this.flag = false;
				var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
				var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);

				var cx = refX + this.opts.startPosX;
				var cy = refY + this.opts.startPosY;

				var dx = mouseX - cx;
				var dy = mouseY - cy;
				this.opts.rotation = Math.atan2(dy, dx);
				this.board.draw();

			}else if(this.isResizing){
				var mouseX = parseInt(e.clientX - this.canvas.getBoundingClientRect().left);
				var mouseY = parseInt(e.clientY - this.canvas.getBoundingClientRect().top);
				var deltaX = mouseX - startX;
				var deltaY = mouseY - startY;
				var newDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX:deltaY;

				// var newDeltaY = this.opts.charBoxWidth/2 * this.opts.charBoxRatio + deltaY;

				// this.opts.charBoxWidth = Math.sqrt(newDeltaX * newDeltaX + newDeltaY * newDeltaY);

				this.opts.charBoxWidth += newDelta;

				this.opts.mouseStartX = mouseX;
				this.opts.mouseStartY = mouseY;

				this.board.draw();

			}
			this.board.getCharPos();
			
		},

		// handleMouseClick: function(e) {
		// 	console.log("click");
		// 	if(!this.flag && this.isHitImage){
		// 		this.flag = true;
		// 		this.draw(true);
		// 	}
		// 	else if(this.flag && this.isHitImage){
		// 		this.flag = false;
		// 		this.draw(false);
		// 	}
		// }



	};
	Chars.Box.defaultOpts = {
		//这里发现了一个参数使用对象的一个弊端，一个对象的更改，会引发另外一个对象的更改。目前还没有想象到如何去解决这个问题。所以先将参数设置为常值。
		// startPos: {
		// 	x: 0,
		// 	y: 0
		// },
		startPosX: 0,
		startPosY: 0,
		rotation: 0,
		charBoxWidth: 100,
		charBoxRatio: 4/3,

		referencePoint: {
			x: 200,
			y: 200
		},

		lineWidth: 2,
		radius: 5,

		mouseStartX: 0,
		mouseStartY: 0,
		edit: {
			translation: true,
			rotatable: true,
			scalable: true
		}
	};


	Chars.Control = function(board, opts){
		this.board = board;
		this.opts = _.extend({},this.defaults, opts);
		this.el = document.createElement('div');
		this.el.classList.add('chars-control');
		if(this.name) {
			this.el.classList.add('chars-control-' +this.name);
		}
		this.initialize.apply(this, arguments);
	};

	Chars.Control.prototype = {
		name: '',

		defaults: {},

		initialize: function(){

		}

	};

	Chars.Control.extend = function(protoProps, staticProps){
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

	Chars.Control.Edit = Chars.Control.extend({
		name: 'edit', 

		defaults: {
			add: true,
			clear: true,
			save: false,
			delete: false
		},

		initialize: function(){
			// var tpl = '';
			// tpl = tpl + '<button class="control-edit-clear" data-edit="edit">clear</button>'
			// this.el.innerHTML = tpl;

			var div = document.createElement('div');
			var tplClear = '';
			var tplAdd = '';

			if(this.opts.clear) {
				tplClear = tplClear + '<button class="control-edit-clear" data-edit="edit">delete</button>';
				div.innerHTML = tplClear;
				this.el.appendChild(div.firstChild);
			}
			if(this.opts.add) {
				tplAdd = tplAdd + '<button class="control-edit-add" data-edit="add">addBox</button>';
				div.innerHTML = tplAdd;
				// this.el.appendChild(div.firstChild);
			}

			var buttonClear = this.el.querySelector('.control-edit-clear');
			buttonClear.addEventListener("click", function(e){
				this.board.clearChar();
			}.bind(this), false);

		}

	});






	window['Chars'] = Chars;



})(_);
