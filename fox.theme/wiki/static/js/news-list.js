jQuery(function($){
var pullDown = document.querySelector("#PullDown");
var pullUp = document.querySelector("#PullUp");
var isPulled = false; // 拉动标记
var PullDirection = 0; // 0下面的更新，1上面的更新
var village=$("#village").attr("data-village");
	village=village?village:"";

	newslists ={
 		_init: function (){
			 $.ajax({
             type: "GET",
             url: "/api/anote/list",
             data: {recoid:0,count:32,method:"new",kw:village},
			 beforeSend:newslists._beforeSend,
             dataType: "json",
             success:function(data){
				newslists._success(data,"append");
			},
			 complete:newslists._complete
			});
		},
		_ajax_note:function(pulldire,method,prep){
			 if(pulldire){
				var first = $("#wrapper").find("li").first();
				var n = first.attr("recoid");
			 }else{
			 	var last = $("#wrapper").find("li").last();
				var n = last.attr("recoid");
			 }
           
			 $.ajax({
             type: "GET",
             url: "/api/anote/list",
             data: {recoid:n,count:20,method:method,kw:village},
			// beforeSend:newslists._beforeSend,
             dataType: "json",
             success:function(data){
				newslists._success(data,prep);
			 },
			 complete:newslists._complete_note
			});
		},
		 _ajax:function (page,parameters,callback,method){
			parameters.rand=Math.round(Math.random()*100000);
			return jQuery.get(page,parameters,callback,method);
		},
		_beforeSend:function(XMLHttpRequest){
			//alert("加载前");
			$(".page-loading").show();
			$("#PullUp").show();
		},
		_complete:function(XMLHttpRequest){
		},
		_complete_note:function(XMLHttpRequest){
		   isPulled = false;
		},
		_success:function(responseText,prep){//加载成功
			//console.log(prep);
			$(".page-loading").hide();
			$("#PullUp").hide();
			//console.log("隐藏加载...");
			try{
					if(responseText.status == "200"){
						newslists._template(responseText.data.list,prep);
			        }else if(responseText.status == "500"){		
			        	$("#wrapper").html('<div class="article-tips">没有文章！</div>');
					}else{
			   			$("#wrapper").html('<div class="article-tips">文章加载失败！</div>');
					}
			}catch (e){
			}	
			//console.log(respone.data);
		//	newslists._template(respone.data);
		},
		_template:function(list,prep){//解析模板
			var strTpl="";
			for(var key in list){ 
				//console.log(list[key].id);
				var imgCount = list[key].newslist_tpl;
				if(imgCount==3){
				 strTpl +=newslists._tpl_3(list[key]);
				}else if(imgCount==2){
				 strTpl +=newslists._tpl_2(list[key]);
				}else if(imgCount==1){
				 strTpl +=newslists._tpl_1(list[key]);
				}else{
				 strTpl +=newslists._tpl_0(list[key]);
				}
				
			
			}

		    $("#wrapper")[prep](strTpl);//在下面添加
		},
		_tpl_0:function(data){
			//console.log(data.id);
			var strVar = "";
   		    strVar += "	<li class=\"item-tt\" recoid=\""+data.id+"\">";
   		    strVar += "	<a href=\"/vm/"+data.vid+"\">";
    		strVar += "		<div class=\"text\">";
    		strVar += "			<p class=\"content_p\">"+data.title+"<\/p>";
    		strVar += "			<p class=\"subhead\"><\/p>";
   	        strVar += "			<p class=\"date\"><span class=\"time\" title=\""+data.ctime+"\">"+cutils.dateFormatM(data.ctime)+"<\/span><span class=\"source_name\">"+data.uid+"<\/span><span class=\"cmt_tt \">"+data.commentnum+"<\/span><\/p>";
    		strVar += "		<\/div>";
    		strVar += "	<\/a><\/li>";
			return strVar;
		},
		_tpl_1:function(data){
				var strVar=newslists._tpl_1_R(data);
				return strVar;
		},
		_tpl_1_L:function(data){
				var arrayObj = new Array();
				arrayObj=eval(data.Cover);
				var strVar = "";
   				strVar += "<li data-pos=\"item\" grab_time=\"1475628683530\" recoid=\""+data.id+"\" class=\"item-tt\" data-itemtype=\"operate\" data-channel=\"100\" data-article=\"5259557646590556888\">";
    			strVar += "<a href=\"/vm/"+data.vid+"\">";
    			strVar += "<div class=\"newsimg-tt left\">";
    			strVar += "	<img class=\"showImg finish\" src=\""+arrayObj[0]+"\">";
    			strVar += "<\/div>";
   			 	strVar += "<div class=\"text\">";
    			strVar += "	<p class=\"content_p left\">";
    			strVar += data.title;
    			strVar += "	<\/p>";
    			strVar += "	<p class=\"subhead left\">";
    			strVar += "	<\/p>";
    			strVar += "	<p class=\"date left\">";
    			strVar += "		<span class=\"op_mark\" style=\"color: #f24a3e;background: url(http://image.zzd.sm.cn/12013266730753243483.jpg?id=0) left center no-repeat;background-size: 12px;\">事件追踪<\/span><span class=\"time\" data-value=\"1475628683530\" title=\"1475628683530\">3分钟前<\/span><span class=\"source_name\">新京报<\/span><span class=\"cmt_tt \">702<\/span>";
    			strVar += "	<\/p>";
    			strVar += "<\/div>";
    			strVar += "<\/a><\/li>";
				return strVar;
		},
		_tpl_1_R:function(data){
				var arrayObj = new Array();
				arrayObj=eval(data.Cover);
				var strVar = "";
    			strVar += "<li data-pos=\"item\" grab_time=\"1475545859325\" recoid=\""+data.id+"\" class=\"item-tt\" data-itemtype=\"operate\" data-channel=\"51830095\" data-article=\"11391263073754802877\">";
    			strVar += "<a href=\"/vm/"+data.vid+"\">";
    			strVar += "<div class=\"newsimg-tt\">";
    			strVar += "	<img class=\"showImg finish\" src=\""+arrayObj[0]+"\">";
    			strVar += "<\/div>";
    			strVar += "<div class=\"text\">";
    			strVar += "	<p class=\"content_p\">";
    			strVar += data.title;
    			strVar += "	<\/p>";
    			strVar += "	<p class=\"subhead\">";
    			strVar += "	<\/p>";
    			strVar += "	<p class=\"date\">";
    			//strVar += "		<span class=\"op_mark\" style=\"color: #f24a3e;background: url(http://image.zzd.sm.cn/12013266730753243483.jpg?id=0) left center no-repeat;background-size: 12px;\">国内关注<\/span>";
				strVar += "<span class=\"time\" data-value=\"1475545859325\" title=\"1475545859325\">"+cutils.dateFormatM(data.ctime)+"<\/span><span class=\"source_name\">0<\/span><span class=\"cmt_tt \">0<\/span>";
    			strVar += "	<\/p>";
    			strVar += "<\/div>";
    			strVar += "<\/a><\/li>";
				return strVar;
		},
		_tpl_1_B:function(data){
				var arrayObj = new Array();
				arrayObj=eval(data.Cover);
			    var strVar = "";
    			strVar += "<li data-pos=\"item\" grab_time=\"1479452951000\" recoid=\""+data.id+"\" class=\"item-tt\" data-itemtype=\"operate\" data-channel=\"100\" data-article=\"5911304477800468633\">";
    			strVar += "<a href=\"/vm/"+data.vid+"\">";
    			strVar += "<div class=\"picsTitle\">";
    			strVar += data.title;
    			strVar += "<\/div>";
    			strVar += "<div class=\"picsImg\">";
    			strVar += "	<img style=\"width:100%;\" src=\""+arrayObj[0]+"\" class=\"finish\" width=\"640\" height=\"240\">";
    			strVar += "	<div class=\"isDraw\">";
    			strVar += "	<\/div>";
    			strVar += "<\/div>";
    			strVar += "<p class=\"subhead2\">";
    			strVar += "<\/p>";
    			strVar += "<div class=\"picsInfo clearfix\" style=\"margin-bottom:-3px;\">";
    			strVar += "	<span class=\"time\" data-value=\"1479452951000\" title=\"1479452951000\">"+cutils.dateFormatM(data.ctime)+"<\/span><span class=\"source_name\">封面新闻<\/span><span class=\"cmt_tt \">2850<\/span>";
    			strVar += "<\/div>";
    			strVar += "<\/a>";
    			strVar += "<div class=\"dislike bigpic\" readid=\"13479230276296002807\" recoid=\"6451172646170473985\">";
    			strVar += "<\/div>";
    			strVar += "<\/li>";
			    return strVar;
		},
		_tpl_2:function(data){
				//640*240
			    var arrayObj = new Array();
				arrayObj=eval(data.Cover);
			    var strVar = "";
    			strVar += "<li data-pos=\"item\" grab_time=\"1479452951000\" recoid=\""+data.id+"\" class=\"item-tt\" data-itemtype=\"operate\" data-channel=\"100\" data-article=\"5911304477800468633\">";
    			strVar += "<a href=\"/vm/"+data.vid+"\">";
    			strVar += "<div class=\"picsTitle\">";
    			strVar += data.title;
    			strVar += "<\/div>";
    			strVar += "<div class=\"picsImg clearfix\" style=\"margin:0 auto;\">";
    			strVar += "	<div style=\"float:left;max-width: 49.75%;height: 0;padding-bottom: 25%;overflow: hidden;\"><img style=\"width:100%;\" src=\""+arrayObj[0]+"\" class=\"finish\"><\/div>";
				strVar += "	<div style=\"float:right;max-width: 49.75%;height: 0;padding-bottom: 25%;overflow: hidden;\"><img style=\"width:100%;\" src=\""+arrayObj[1]+"\" class=\"finish\"><\/div>";
    			strVar += "	<div class=\"isDraw\">";
    			strVar += "	<\/div>";
    			strVar += "<\/div>";
    			strVar += "<p class=\"subhead2\">";
    			strVar += "<\/p>";
    			strVar += "<div class=\"picsInfo clearfix\" style=\"margin-bottom:-3px;\">";
    			strVar += "	<span class=\"time\" data-value=\"1479452951000\" title=\"1479452951000\">"+cutils.dateFormatM(data.ctime)+"<\/span><span class=\"source_name\">0<\/span><span class=\"cmt_tt \">0<\/span>";
    			strVar += "<\/div>";
    			strVar += "<\/a>";
    			strVar += "<div class=\"dislike bigpic\" readid=\"13479230276296002807\" recoid=\"6451172646170473985\">";
    			strVar += "<\/div>";
    			strVar += "<\/li>";
			    return strVar;
		},
		_tpl_3:function(data){
				//210*140
				var arrayObj = new Array();
				arrayObj=eval(data.Cover);
				//arrayObj=["http://upload-images.jianshu.io/upload_images/2674450-41223019f55ddf7c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240","http://upload-images.jianshu.io/upload_images/2674450-b66c68a8ec38b050.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240","http://upload-images.jianshu.io/upload_images/2674450-b3865d2b369e8330.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240"];
				var strVar = "";
    			strVar += "<li data-pos=\"item\" grab_time=\"1475544659325\"  recoid=\""+data.id+"\" class=\"item-tt\" data-itemtype=\"operate\" data-channel=\"51830095\" data-article=\"7000855879443943800\">";
    			strVar += "<a href=\"/vm/"+data.vid+"\">";
    			strVar += "<p class=\"content_p\">";
    			strVar += data.title;
    			strVar += "<\/p>";
    			strVar += "<div class=\"list-col3-tt clearfix\">";
    			strVar += "	<div>";
    			strVar += "		<p class=\"col3-0\" style=\"max-width: 100%;padding-bottom: 70%;height: 0;overflow: hidden;\">";
    			strVar += "			<span class=\"col3-tt\"><img src=\""+arrayObj[0]+"\" data-width=\"500\" data-height=\"375\" class=\"finish\"><\/span>";
    			strVar += "		<\/p>";
    			strVar += "	<\/div>";
   			 	strVar += "	<div>";
    			strVar += "		<p class=\"col3-1\" style=\"max-width: 100%;padding-bottom: 70%;height: 0;overflow: hidden;\">";
    			strVar += "			<span class=\"col3-tt\"><img src=\""+arrayObj[1]+"\" data-width=\"500\" data-height=\"375\" class=\"finish\"><\/span>";
    			strVar += "		<\/p>";
    			strVar += "	<\/div>";
    			strVar += "	<div>";
    			strVar += "		<p class=\"col3-2\" style=\"max-width: 100%;padding-bottom: 70%;height: 0;overflow: hidden;\">";
    			strVar += "			<span class=\"col3-tt\"><img src=\""+arrayObj[2]+"\" data-width=\"500\" data-height=\"375\" class=\"finish\"><\/span>";
    			strVar += "		<\/p>";
    			strVar += "	<\/div>";
    			//strVar += "	<div class=\"i-images\">";
    			//strVar += "		多图";
    			//strVar += "	<\/div>";
    			strVar += "<\/div>";
    			strVar += "<div class=\"subhead col3\">";
    			strVar += "<\/div>";
    			strVar += "<div class=\"date-col3\">";
    			strVar += "	<span class=\"time\" data-value=\"1475544659325\" title=\"1475544659325\">"+cutils.dateFormatM(data.ctime)+"<\/span><span class=\"source_name\">0<\/span><span class=\"cmt_tt \">0<\/span>";
    			strVar += "<\/div>";
    			strVar += "<\/a><\/li>";
				return strVar;
		},
		_scroll_end:function(){
			   	//console.log("isPulled:"+isPulled);
            	if (isPulled) { // 如果达到触发条件，则执行加载
					if(PullDirection){
						//console.log("上面的更新");
						newslists._ajax_note(1,"new","prepend");
				    }else{
						//alert("下面的更新");
						//console.log("下面的更新");
						newslists._ajax_note(0,"his","append");
					}
            	 }
				return;
		},
		_scroll_top:function(){
		     
		},
		_addScrollListener:function(){	
			var range=60;
    		$(window).scroll(function(){
        		   var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
        		   var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
		 		   if(totalheight>$(document).height()-range) {
                      newslists._OnDownLoad();			   
                 }
		 		
    		});	

	},
	 _OnDownLoad:function(){ //下面的更新		 		
		 		//console.log("进入下拉更新");
				if(!isPulled){
					pullUp.style.display = "block";
                    isPulled = true;
				    PullDirection=0;
					newslists._scroll_end(); //开始更新啦
                    return;
				}
	}


//end newslists
	}


	newslists._init();
	newslists._addScrollListener();
	
});
