$(document).ready(function () {
							
	var $docH1 = $(document).height();
    var $winH1 = $(window).height();
	var $c1 = parseInt($docH1) - parseInt($winH1);
	var gzWarpTopH=$(".gzWarpTop").height();
	$("#wrapper").height($winH1-gzWarpTopH);

    var headerH = $("#header").height();
    var footerH = $("#footer").height();
    $(".footerNav").css("bottom", footerH)
    $(".icon-user").on("click", function () {
        $(".menuwarp").show();
        $("#slideMenu").css("top", headerH)
        $("#slideMenu").slideToggle("fast");
        $(".footerNav").slideUp("fast");
    })
    $(".click").on("click", function () {

        $(".menuwarp").show();
        $(".footerNav").slideToggle("fast");
        $("#slideMenu").slideUp("fast");
    });
	var Navw=$(".gzWarpList").width();
	$(".gzWarpList").css("left",-Navw)
	
    $(".gzbtn").click(function () {							
	   $(".bg").fadeIn(300);						
       $(".gzWarpList").animate({ left: 0 }, 300)
       
	   

    })
	
	$(".bg").click(function(){
	    $(".gzWarpList").animate({ left: -Navw }, 100);
	    $(this).fadeOut(100);
	});
	
    $(".menuwarp").click(function (e) {
        e.stopPropagation();
        $(this).hide()
        $("#slideMenu").slideUp("fast");
        $(".footerNav").slideUp("fast");
        
    });

   

    $(".zxb-list>li").last().addClass("last")
    var $num = $(".zxb-list>li").length;
    for (i = 0; i < $num; i++) {
        $(".zxb-list li").eq(i).addClass("item-" + i)
    }

   
	/*
	if($c1<=0){
		$("#footer").removeClass("fixted");
        $("#footer").addClass("relative")
		
		}*/
		
	

    /*滚动条事件开始*/
    var timer = 0;
	
    $(window).scroll(function () {
    var $sc = $(window).scrollTop();
    var $docH = $(document).height();
    var $winH = $(window).height();
    var $c = parseInt($docH) - parseInt($winH);
    // var $fixed =$("#fixed-bottom").height();
    var $footer = $("#footer").height();

    // var $b=parseInt($fixed)+parseInt($footer) 				   
        
        if (timer) {
            clearTimeout(timerfunction);
            timer = 0;
        }
        timerfunction = setTimeout(function () {
            if ($sc >= $c - $footer) {
                $("#footer").removeClass("fixted");
                $("#footer").addClass("relative")

            } else { $("#footer").addClass("fixted"); $("#footer").removeClass("relative") }
        }, 300);
    });

    /*滚动条事件结束*/
	
	$("input.focus").each(function(){
	  var $this = $(this);				   
	   $this.focus(function(){
		
		$this.parent().addClass("selected");
		$this.parent().siblings().removeClass("selected");
		$this.parent().removeClass("unselected");
		$this.parent().siblings(".ipnutBox").addClass("unselected");
									
	  });	
	
	});
	
	$(".scroll ul li").click(function(){
	  $(this).addClass("cur");
	  $(this).siblings().removeClass("cur");
	
	});
	
	$("#click").click(function(){
			$("#windows").fadeIn("fast");
	
	});
	$(".close").click(function(){$("#windows").fadeOut("fast");})
	
	$(".ul").each(function(){
		var $this =$(this);
		var lis = $("li", $this)
		lis.last().addClass("last")
	
	});
	
	
    window.onresize = function(){  
	      /*九宫图*/
         var winw = $(".reppop9 dl").width();	
	     var dtH = $(".reppop9 dl dt").height();
		 var ddH = $(".reppop9 dl dd").height();
		 var d = (dtH+ddH)/2
		 var pTop = (winw/2-d)/1.5;
         $(".reppop9 dl a").css({"padding-top":pTop,"height":winw-pTop});
		
		  
    }  
	$(window).resize();
	
	/*判断浏览是否有滚动条*/
	if($winH1 > $docH1){
		 $(".icopy").addClass("fixted");
		}else{
		 $(".icopy").removeClass("fixted");
		};
		
    /*图片放大插件*/
	 $('.photos').each(function(i){
	     $(this).children("a").each(function(index){
		     $(this).click(function(event){
				event.preventDefault();					
			    $(this).parent().siblings(".swiperWindows").css({"display":"block","visibility":"visible",scale:0}).transition({scale:1},500,"cubic-bezier(.44,1.5,.55,.87)");
				var mySwiper = new Swiper(".sip"+i,{
				initialSlide :index,						  
                pagination : '.pag'+i,
                });
				var wincenter = $(this).parent().siblings(".swiperWindows").children();
				var H = wincenter.height()/2
				wincenter.css("margin-top",-H)
				
			})
		})
	 });		 
	  /*图片关闭*/	
	$(".swiperWindows").on("click",function(){
	 $(this).transition({scale:0,complete:function(){$(this).css({"visibility":"hidden","display:":"none"})}},400,"cubic-bezier(.88,-0.39,.72,.27)");		
	 
	});
	
	/*placeholder 输入框事件*/
	
	$('[placeholder]').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();
   /* $('.SearchBox [placeholder]').parents('form').submit(function() {
        $(this).find('[placeholder]').each(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        })
    });*/
   
   /*LBS地图选择*/
   $(".LBS-SearchList li").each(function(){
	    $(this).click(function(){
			$(this).addClass("selected").siblings().removeClass("selected");				   
		});
	});
   
    /*活动详情地图选择*/
	$(".MainBoxNav li a").each(function(){
         $(this).click(function(event){
			event.preventDefault();		
			$(this).parent().addClass("selected").siblings().removeClass("selected");				   
		});
	});
	
	/*微信弹窗*/
	var Body = $("body");
	
	
	
	$(".NS-WeiXin").click(function(){
     $("html").css({"position":"absolute", "overflow":"hidden", "height":100+'%', "width":100+'%'});							   
	 Body.css({"position":"absolute", "overflow":"hidden", "height":100+'%', "width":100+'%'});							   
	 $(".WinXinWindows").css({"display":"block","visibility":"visible",scale:0,"height":$winH1}).transition({scale:1},500,"cubic-bezier(.44,1.5,.55,.87)");
	});
	
	$(".closes").click(function(){
	  Body.removeAttr("style");	
	  $("html").removeAttr("style");
	  $(".WinXinWindows").transition({scale:0,complete:function(){$(".WinXinWindows").css({"visibility":"hidden","display:":"none"})}},400,"cubic-bezier(.88,-0.39,.72,.27)");	
	 
	});
	var DEWindows;
	/*单组图片弹窗*/
	$(".DE-TB-IMGList li").each(function(index){
		 $(this).click(function(){
		    $(".gallayWin").css({"display":"block","visibility":"visible",scale:0}).transition({scale:1},500,"cubic-bezier(.44,1.5,.55,.87)");
			 DEWindows = new Swiper(".DEWindows",{
				 initialSlide :index,						  
                 pagination : '.DEPage'
            });
			 var wincenter = $(".DEWindows").parent();
			 var H = wincenter.height()/2
			wincenter.css("margin-top",-H)
		 });							 
	
	});
	$(".gallayWin").on("click",function(){
	 $(this).transition({scale:0,complete:function(){$(this).css({"visibility":"hidden","display:":"none"})}},400,"cubic-bezier(.88,-0.39,.72,.27)");		
	 DEWindows.destroy(false);
	});
	
	//交替添加图片
	$(".NC-List li:even .NC-Main-Img img").attr("src","../images/photo0000001.png");
	$(".NC-List li:odd .NC-Main-Img img").attr("src","../images/photo0000002.png"); 
	
});