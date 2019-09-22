$(function(){
	if(typeof($.fn.fancybox)=='function'){
		$(".contFancybox").fancybox({
			padding:0
		});
		$(".imgsFancybox").fancybox({
			padding:15,
			openEffect:"elastic",
			openSpeed:150,
			closeEffect:"elastic",
			closeSpeed:150,
			closeClick:true
		});
	}	
	
	setTimeout(showFoot,100);
	clicks(".dzxzBox .List li","");
	//产品筛选下拉菜单
	$(".proxzMenu .xz .wz").click(function(){
		$(this).toggleClass("on");
		$(this).parents(".xz").siblings(".xz").find(".wz").removeClass("on");
		$(this).siblings(".xl").toggle();
		$(this).parents(".xz").siblings(".xz").find(".xl").hide();
	})
	$(".proxzMenu .xl a").click(function(){
		$(this).parents(".xl").hide();
		$(this).parents(".xl").siblings(".wz").removeClass("on");
		var tet = $(this).text();
		$(this).parents(".xl").siblings(".wz").find("span").text(tet);
	})
	//评价星星
	$(".MStar li").hover(function(){
			$(this).addClass("cur").siblings("li").removeClass("cur");
		},function(){
			$(this).parents(".MStar").find("li").removeClass("cur");
			$(this).parents(".MStar").find("li.on").addClass("cur");
	})
	$(".MStar li").click(function(){
			$(this).addClass("on").siblings("li").removeClass("on");
	})
	//发布求购所在地下拉
	$(".bpriceBox .addr .wz").click(function(){
		$(this).siblings(".xl").toggle();
		$(this).parents(".xz").siblings(".xz").find(".xl").hide();
	})
	
})	
	//让下面的底部做判断是否在最下面固定：内容大于手机浏览器窗口的时候在下面固定。
function showFoot(){	
	var $height01 = $(window).height();
	var $height02 = $("body").height();
	if($height01>$height02){
		$("footer").addClass("footer_fix");
	}
	$(window).resize(function(){
		var $height01 = $(window).height();
		if($height01>$height02){
			$("footer").addClass("footer_fix");
		}else{
			$("footer").removeClass("footer_fix");
		}
	})
}
function clicks(element,links){	
	$(element).on({
		'touchstart mousedown' : function(){
			if(links == ''){
				$(this).addClass('active');
			}else{
				$(this).children(links).addClass('active');	
			}
		},
		'touchend touchcancel mouseup' : function(){
		 	if(links == ''){
				$(this).removeClass('active');
			}else{
				$(this).children(links).removeClass('active');	
			}
		}
	});
	
}








