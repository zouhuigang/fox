var interval;
var prize = new Array();
var isAction=false;
function reset() {
	$("#bottle_fetch").css('display','block');
	if(isAction){
		alert("正在打捞,请勿重复");
		return false;
	}
	isAction=true;
	$("#bottle_fetch").css({
		left : "200px",
		top : "350px",
		width:"166px",
		height:"71px",
	});
	$(".prize").css({
		"z-index" : 1,
		"display" : "none"
	});
	
	track.init($('#bottle_fetch'),850,450,300);
}
//抛出网兜 旋转加放大的过程
function salveage() {
	
	$salveage.animate({
		left : "750px",
		top : "160px",
		width : "266px",
		height : "171px",
	}, 1000, function () {
		
	});
}
//来回搜索
function search() {
	 
	$("#bottle_fetch").animate({
		left : "400px",
	}, 1000, function () {
		$("#bottle_fetch").animate({
			left : "800px"
		}, 1000, function () {
				$("#bottle_fetch").animate({
					left : "600px"
					}, 1000, function () {
			
						showPrize();
					})

		})

	
	});
}
function showPrize() {
	$("#bottle_fetch").css({"-webkit-transform":"rotate(0deg)"});
	
	$(".sea").css({
		"z-index" : -1
	});
	$(".water").css({
		"z-index" : 3,
		"opacity" : 1,
		"top" : "150px"
	});
	$(".water").animate({
		top : "220px",
		opacity : 0
	}, 500, function () {});

	getPrize();
	$(".prize").css({
		"z-index" : 1,
		"display" : "block"
	});

	$(".sea").css({
		"z-index" : 1
	});
	isAction=false;
}

function getPrize() {
	prize[0] = "salvage_0.png";
	prize[1] = 'salvage_1.png';
	prize[2] = 'salvage_2.png';
	prize[3] = 'salvage_3.png';
	var num = Math.round(Math.random() * 6);
	$("#prize").attr("src", "/static/images/bottle/salvage_" + num + ".png");
}

var track={
 interval:0,//定时器
 offsetX:300,//初始坐标x
 offsetY:300,//初始坐标Y
 $box:0,//选定的对象
 angle:0,//初始角度
 R:100,//半径
 w:0,
 h:0,
 rotate:0,
 jump:function(){
 if(track.angle<=-120){
   clearInterval(track.interval);
   track.$box.addClass("rotate");
		$(".sea").css({
			"z-index" : 3
		});
		
		search();

 }
 
 //快掉落的时候 插入海底
 if(track.angle<-100){
	 $(".sea").css({
		"z-index" :3
	});
	 
 }

 track.w+=0.5;
 track.h+=0.5;
 track.rotate-=0.7;
 track.angle-=1;
 var rotate="rotate("+track.rotate+"deg)";
 var x=track.offsetX+track.R*Math.cos(track.angle*Math.PI/180);
 var y=track.offsetY+track.R*Math.sin(track.angle*Math.PI/180);
   track.$box.css({left:x,top:y,width:track.w,height:track.h, "-webkit-transform":rotate});
 
},
 init:function(obj,x,y,r){
	 track.angle=0;
	 track.rotate=0;
 track.$box=obj;
 track.w=obj.width();
 track.h=obj.height();
 track.offsetX=x;
 track.offsetY=y;
 track.R=r;
 track.interval= setInterval(track.jump,10);

}
}
