var isSubmit=0;
$(function(){
    FastClick.attach(document.body);

	//聚焦
	//$("input").focus(function(){
	 $(".zkeywords > input").on("click",function(e){
		$(".zkeywords").removeClass("focus");
  		$(this).parent().addClass("focus");
		$(".keyboard-input").show();
        $(".total-wrap").addClass('input-status');
		$(".zkeywords > input").removeClass("zactive");
		$(this).addClass('zactive');
	});

    $(".btn-num").on("click",function(e){
        e.stopPropagation();
        var text = $(this).text();
		var _this=$(".focus input");
        var val = _this.val();

        //if(val.indexOf(".")!=-1&&text=='.'){return;}
        if($.isNumeric(text) || text=="x"){
            _this.val(val+$(this).text())
        }
        _this.trigger("change");
        
    })
    $(".btn-cancel").click(function(){
		var _this=$(".zactive");
        var val = _this.val();
        _this.val(val.substr(0,val.length-1) || "")
        _this.trigger("change");
        $(".keyboard-input").show();
        $(".total-wrap").addClass('input-status')
    })
    $(".btn-keyboard").click(function(){
        $(".keyboard-input").hide();
        $(".total-wrap").addClass('input-status')
    });

	$(".btn-clear").click(function(){
        $("#money").val("");
        $("#money").trigger("change");
    });

  

 

    $(".btn-confirm").click(function(){
        var active=$(".btn-confirm").hasClass("active");
        if(!active){
            return ;
        }
        var idcard=$("#idcard").val(); 
        if(!idcard){
             mError("请输入你的身份证后6位");
            return;
        }
		 var cdkeypass=$("#cdkeypass").val(); 
        if(!cdkeypass){
             mError("请输入6位数字安全码");
            return;
        }
		var re=	/^\d{6}$/;//判断6位数
    	if(!re.test(cdkeypass)){
			mError("安全码为6位数字");
            return;
		}
		 var confirmcdkeypass=$("#confirmcdkeypass").val(); 
        if(!confirmcdkeypass){
             mError("请重复输入6位数字安全码");
            return;
        }

		if(cdkeypass!=confirmcdkeypass){
			mError("2次输入安全码不一致");
            return
		}

		SubmitCdKey();
      
    })
	/*
    $("#money").change(function(){
        var val = $(this).val();
        val&&$(".btn-confirm").addClass("active")
        !val&&$(".btn-confirm").removeClass("active")
    })
	*/


    $("#transferwx").click(function(){wxpay()});
})


function contactData(){
    var  obj={};
    var idcard=$("#idcard").val();
    var cdkeypass=$("#cdkeypass").val();
    var confirmcdkeypass=$("#confirmcdkeypass").val();
	var backurl=$("#backurl").val();
  

    obj.idcard=idcard;
    obj.cdkeypass=cdkeypass;
    obj.confirmcdkeypass =confirmcdkeypass;
	obj.backurl=backurl;
    
    return obj;
}
var index=0;//是否可以提交,0可以提交，1不能提交
function SubmitCdKey(){
    if(index==1){
        return;
    }
    index=1;
    var obj=contactData();
    if(obj==null|obj==''){
        index=0;
        return;
    }
  
    var json=JSON.stringify(obj);
    $.ajax({
        type: "post",
        url: '/edu/api/setCdKey?randomParam='+Math.random(),
        cache:false,
        async:false,
        data:json,
		beforeSend: function () { mLoading();},
        contentType:"application/json;charset=UTF-8",
        dataType: "json",
        success: function(dataObj){
			index=0;
            if(dataObj.status=='200'){
                var backurl = dataObj.data.backurl;
                mAlert(dataObj.info,backurl);
            }else{
				mAlert(dataObj.info);
            }
        }
    });
    $(".dialog").fadeOut(500);
}






