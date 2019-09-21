/**
 * Created by test on 2016/9/12.
 */
var isSubmit=0;
$(function(){
    FastClick.attach(document.body);
    getFansInfo();
    $("#money").on("click focus",function(){
        $(".keyboard-input").show();
        $(".total-wrap").addClass('input-status');
    })
    $(".btn-num").on("click",function(e){
        e.stopPropagation();
        var text = $(this).text();
        var val = $("#money").val()||"￥";

        if(val.indexOf(".")!=-1&&text=='.'){return;}
        if($.isNumeric(text) || text=="."){
            $("#money").val(val+$(this).text())
        }
        $("#money").trigger("change");
        countActualAmount();
    })
    $(".btn-cancel").click(function(){
        var val = $("#money").val();
        if(val.length==2){
            $("#money").val("");
            $("#money").trigger("change");
            countActualAmount();
            return;
        }
        $("#money").val(val.substr(0,val.length-1) || "")
        $("#money").trigger("change");
        $(".keyboard-input").show();
        $(".total-wrap").addClass('input-status')
        countActualAmount();
    })
    $(".btn-keyboard").click(function(){
        $(".keyboard-input").hide();
        $(".total-wrap").removeClass('input-status')
    })

    $("#jf-checkbox").click(function(){
        var hasCheceked=$("#jf-checkbox");
        if(hasCheceked.hasClass("check")){
            $("#jf-checkbox").removeClass("check") ;

        }else {
            $("#jf-checkbox").addClass("check");
        }
        var price=calcutePrice();
        $("#total-price").text(price);
    })

    function calcutePrice(){
        var money=$("#money").val();
        var price="";
        if(money.length>0){
            price=money.substr(1,money.length);
        }
        //计算折扣
        var zkChecked=$("#zk-checkbox");
        if(zkChecked.hasClass("check")){
            var tag = zkChecked.attr("uid");
            var zk=$("#"+tag).text();
            if(zk!='0'){
                price=Math.round(price*10.00*zk)/100.00;
                price=price.toFixed(2);
            }
        }
        //计算积分
        var jfChecked=$("#jf-checkbox");
        if(jfChecked.hasClass("check")){
            var tag = jfChecked.attr("uid");
            var val=$("#"+tag).text();
            if(price >0){
                price=(price*1.00)-(val*1.00);
                price=price.toFixed(2);
            }else {
                $("#jf-checkbox").removeClass("check");
                return '0.00'
            }

        }
        if($("#ye-checkbox").hasClass("check")){
            price=calculateCard(price);
        }
        if(price <0){
            price ='0.00';
        }
        return price;
    }

    $("#ye-checkbox").click(function(){
        var hasCheceked=$("#ye-checkbox");
        if(hasCheceked.hasClass("check")){
            $("#ye-checkbox").removeClass("check") ;

        }else{
            $("#ye-checkbox").addClass("check");

        }
        var price=calcutePrice();
        $("#total-price").text(price);
    })

    $("#zk-checkbox").click(function(){
        var hasCheceked=$("#zk-checkbox").hasClass("check");
        if(hasCheceked){
            $("#zk-checkbox").removeClass("check") ;
        }else{
            $("#zk-checkbox").addClass("check");
        }
        var price=calcutePrice();
        $("#total-price").text(price);
    })

    $(".btn-confirm").click(function(){
        var active=$(".btn-confirm").hasClass("active");
        if(!active){
            return ;
        }
        var money=$("#money").val();
        if(money.length>0){
            money=money.substr(1,money.length);
        }
        if(money<0.01){
            alert("输入金额需大于0");
            return;
        }
        var actFee=$("#total-price").text();
        if($(this).hasClass("active")){
            var isFans=$("#isFans").val();
            var stored=$("#stored").val();
            var dealPassword=$("#dealPassword").val();
            var actFeef=parseFloat(actFee);
            var storedf=parseFloat(stored);
            if(actFeef==0|| actFeef==0.00){
                if(isSubmit==1){
                    alert("已发起支付，请稍后！");
                    return;
                }
                isSubmit=1;
                balancePay();
                return;
            }else if(isFans==1){
                wxpay();
            }else if(storedf<actFeef||dealPassword==''){
                wxpay();
            }else{
                $("#actFee").text(actFee);
                $(".dialog").fadeIn(500);
                $(".keyboard-input").hide();
                $(".total-wrap").removeClass('input-status')
                if(actFee<0.01){
                    $(".dlg-footer").hide();
                }
                return;
            }
        }
    })
    $("#money").change(function(){
        var val = $(this).val();
        val&&$(".btn-confirm").addClass("active")
        !val&&$(".btn-confirm").removeClass("active")
    })


    /*支付**/
    $("#submit_pay").click(function(){
        if(isSubmit==1){
            alert("已发起支付，请稍后！");
            return;
        }
        isSubmit=1;
        var pwd=$("#pwd").val();
        if($.trim(pwd)==''){
            alert("请输入密码！");
            return;
        }
        balancePay();
    })
    $("#try_again").click(function(){
        var actFee=$("#total-price").text();
        $("#actFee").text(actFee);
        $(".pay-input-wrap").css("display","inline-block");
        $(".wxpay-dlg-wrap").hide()
        if(actFee<0.01){
            $(".dlg-footer").hide();
        }
    })

    /***dialog*/
    $(".dialog .close,#cancel_pay").click(function(){
        $(".dialog").fadeOut(500);
        $(".keyboard-input").show();
    })
    $("#transferwx").click(function(){wxpay()});
})

//余额支付
function balancePay(){
    var obj=contactData();
    if(obj==null|obj==''){
        isSubmit=0;
        return;
    }
    var pwd=$("#pwd").val();
    obj.pwd=pwd;
    var json=JSON.stringify(obj);
    $.ajax({
        type: "post",
        url: 'payByBalance?randomParam='+Math.random(),
        cache:false,
        async:false,
        data:json,
        contentType:"application/json;charset=UTF-8",
        dataType: "json",
        success: function(data){
            if(data.flag&&data.flag=='00'){
                $(".dialog").fadeOut(500);
                window.location.href=data.callBackUrl;
            }else if(data.flag&&data.flag=='01'){
                $(".pay-input-wrap").hide();
                $(".wxpay-dlg-wrap").css("display","inline-block");
            }else {
                $(".wxpay-dlg-wrap").hide();
                alert(data.msg);
                $(".keyboard-input").show();
                $(".total-wrap").addClass('input-status')
            }
            isSubmit=0;
            $("#pwd").val('');
        }
    });
}
function contactData(){
    var  obj={};
    var openId=$("#openId").val();
    var shopId=$("#shopId").val();
    var storeId=$("#storeId").val();
    var qrCode=$("#qrCode").val();
    var mchId=$("#mchId").val();
    var subMchId=$("#subMchId").val();
    var appId=$("#appId").val();
    var money=$("#money").val();
    if(money.length>0){
        money=money.substr(1,money.length);
    }
    var actlPrice=$("#total-price").text();
    obj.openId=openId;
    obj.shopId=shopId;
    obj.storeId =storeId;
    obj.appId =appId
    obj.qrCode =qrCode;
    obj.mchId =mchId;
    obj.subMchId =subMchId;
    obj.totalFee =Math.round(money*100);
    obj.actlPrice =Math.round(actlPrice*100);
    $(".check").each(function(){
        var _this = $(this), tag = _this.attr("uid");
        if(tag=='hyLeaguerFee'){
            var zk=$("#"+tag).text();
            obj.discount=zk;
        }else if('hyIntegralFee'==tag){
            var val=$("#"+tag).text();
            obj.integral=Math.round(val*100);
        }else{
            var val=$("#"+tag).text();
            obj.codeData=tag;
            obj.amount=Math.round(val*100);
        }

    });
    return obj;
}
var index=0;
function wxpay(){
    if(index==1){
        return;
    }
    index=1;
    var obj=contactData();
    if(obj==null|obj==''){
        index=0;
        return;
    }
    var actlPrice=$("#total-price").text();
    if(actlPrice){

    }
    var json=JSON.stringify(obj);
    $.ajax({
        type: "post",
        url: 'doPay?randomParam='+Math.random(),
        cache:false,
        async:false,
        data:json,
        contentType:"application/json;charset=UTF-8",
        dataType: "json",
        success: function(data){
            if(data.code&&data.code=='00'){
                //window.location.href=data.payUrl;
                if(data.bankCode=="PAB_SELF"){

                }else {
                    detectWeixinApi(data.appId, data.timeStamp, data.nonceStr, data.package, data.signType, data.paySign, data.callback);
                }
            }else{alert(data.errMsg);index=0;
            }
        }
    });
    $(".dialog").fadeOut(500);
}
function countActualAmount(){
    var money=$("#money").val();
    var price="";
    if(money.length>0){
        price=money.substr(1,money.length);
    }else{
        $("#total-price").val("0.00");
        $("#jf-checkbox").removeClass("check");
        $("#ye-checkbox").removeClass("check");
        return ;
    }
    if(price.length>0&&price.substr(0,1)=='.'){
        price='0'+price;
        $("#money").val("￥"+price);
    }
    var re = /^(0|[1-9][0-9]{0,3}|[1-4][0-9]{0,4})?(([.][0-9]{1,2})?|[.])$/;
    if(re.test(price)){
        if("0.00"==price){
            $("#money").val(money.substring(0,money.length-1));
            return;
        }
        countActualFee();
    }else{
        $("#money").val(money.substring(0,money.length-1));
        return ;
    }
}

function countActualFee(){
    var money=$("#money").val();
    var price="";
    if(money.length>0){
        price=money.substr(1,money.length);
    }else {
        $("#jf-checkbox").removeClass("check");
        $("#ye-checkbox").removeClass("check");
        return;
    }
    var isFans=$("#isFans").val();
    if(isFans==1){
        $("#total-price").text(price*1.00);
        return;
    }
    //计算折扣
    var zkChecked=$("#zk-checkbox");
    if(zkChecked.hasClass("check")){
        var tag = zkChecked.attr("uid");
        var zk=$("#"+tag).text();
        if(zk!='0'){
            price=Math.round(price*10.00*zk)/100.00;
            price=price.toFixed(2);
        }
    }

    if(price>0){
        $("#jf-checkbox").addClass("check");
        //计算积分
        var jfChecked=$("#jf-checkbox");
        var tag = jfChecked.attr("uid");
        var val=$("#"+tag).text();
        price=(price*1.00)-(val*1.00);
        price=price.toFixed(2);
    }else{
        $("#jf-checkbox").removeClass("check");
        $("#ye-checkbox").removeClass("check");
    }
    //计算卡卷
    if(price>0){
        $("#ye-checkbox").addClass("check");
        price=calculateCard(price);
    }else{
        $("#ye-checkbox").removeClass("check");
    }
    if(price<0){
        price='0.00';
    }
    $("#total-price").text(price);
}

function calculateCard(price){
    if(price<0.01){
        $("#ye-checkbox").removeClass("check");
        price='0.00';
    }
    var dif= -1,cardValue= 0,conDif= 0,tmpCond=0;
    $(".kj-div").each(function(){
        var _this = $(this),tag=_this.find(".jf-price2"),condition=tag.next();
        var id=tag.attr("id"),value=tag.text(),conditionAmount=condition.text();
        if((conditionAmount*1)>(price*1)){
            return;
        }
        var dift=Math.abs(price*1.0-value*1.0);
        var carddif=conditionAmount-tmpCond;
        if(dift==dif&&carddif>=0){
            tmpCond=conditionAmount;
            cardValue=value;
            $("#ye-checkbox").attr("uid",id);
            dif=dift;
            var curshow=$(".kj-div:visible").hide();
            _this.show();
        }else if(dift==0){
            tmpCond=conditionAmount;
            if(cardValue!=value){
                tmpCond=0;
            }
            cardValue=value;
            $("#ye-checkbox").attr("uid",id);
            dif=dift;
            var curshow=$(".kj-div:visible").hide();
            _this.show();
            return;
        }else if(dift<dif||dif==-1){
            if(cardValue!=value&&dif!=0){
                tmpCond=0;
            }
            cardValue=value;
            $("#ye-checkbox").attr("uid",id);
            dif=dift;
            tmpCond=conditionAmount;
            var curshow=$(".kj-div:visible").hide();
            _this.show();
        }
    });
    if(cardValue>0){
        price=(price*1.00)-(cardValue*1.00);
        price=price.toFixed(2);
    }else{
        $("#ye-checkbox").removeClass("check");
    }
    return price;
}

function detectWeixinApi(appId,timeStamp,nonceStr,packages,signType,paySign,callback){
    if(typeof window.WeixinJSBridge == 'undefined' || typeof window.WeixinJSBridge.invoke == 'undefined'){
        setTimeout(function(appId,timeStamp,nonceStr,packages,signType,paySign,callback){
            detectWeixinApi(appId,timeStamp,nonceStr,packages,signType,paySign,callback);
        },200);
    }else{
        initPay(appId,timeStamp,nonceStr,packages,signType,paySign,callback);
    }
}

function initPay(appId,timeStamp,nonceStr,packages,signType,paySign,callback) {
    if (typeof WeixinJSBridge != "undefined") {
        WeixinJSBridge.invoke('getBrandWCPayRequest' , {
            "appId"     : appId,
            "timeStamp" : timeStamp ,
            "nonceStr"  : nonceStr ,
            "package"   : packages ,
            "signType"  : signType ,
            "paySign"   : paySign
        } , function(res){
            index=0;
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                window.location.href = callback;
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                window.location.href =  callback.replace("callBack","cancel")+"&msg=用户取消付款";
            } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                window.location.href =  callback.replace("callBack","cancel");
            } else {
                window.location.href =  callback.replace("callBack","cancel");
            }
        });
    } else {
        index=0;
        alert('请使用微信进行支付！');
    }
}

//查询粉丝信息接口
function getFansInfo(){
    var shopId=$("#shopId").val();
    var storeId=$("#storeId").val();
    var openId=$("#openId").val();
    $.ajax({
        type: "post",
        url: "getFansInfo?randomParam="+Math.random(),
        cache:false,
        async:false,
        data:{
            "shopId":shopId,"storeId":storeId,"openId":openId  },
        dataType: "json",
        success: function(data){
            if (data.fansBaseInfoVo) {
                $("#isFans").val("0");
                $("#forget_psw").attr('href',data.fanspwd);
                var fansBaseInfoVo=data.fansBaseInfoVo;
                var htmlStr='<input type="hidden" value="'+fansBaseInfoVo.stored+'" id="stored"/>';
                htmlStr +='<input type="hidden" value="'+fansBaseInfoVo.dealPassword+'" id="dealPassword"/>';
                //会员折扣
                if(fansBaseInfoVo.memberLevelRate&&fansBaseInfoVo.memberLevelRate>0){
                    htmlStr +='<div class="jf-wrap mt30" > <span >'+fansBaseInfoVo.memberLevelName+' </span><i class="jf-price1 highlight" id="hyLeaguerFee" >'+
                    fansBaseInfoVo.memberLevelRate+'</i>折<a id="zk-checkbox" class="right-center un-check check" uid="hyLeaguerFee"></a></div>';
                }
                //会员积分
                if(fansBaseInfoVo.integral&&fansBaseInfoVo.integral>0&&data.integral&&data.integral>0){
                    htmlStr +='<div class="jf-wrap" >共有积分<i class="jf-price1 highlight" >'+fansBaseInfoVo.integral
                    +'</i>(可抵扣<i id="hyIntegralFee" class="jf-price2 highlight" >'+data.integral
                    +'</i>元)<a id="jf-checkbox" class="right-center un-check " uid="hyIntegralFee"></a></div>';
                }
                //代金券
                if(data.ticketRecordVos&&data.ticketRecordVos.length){
                    var index=1;
                    htmlStr +='<div class="jf-wrap" >';
                    $.each(data.ticketRecordVos, function (i, ticketRecordVo) {
                        var condition='0.00';
                        if(ticketRecordVo.conditionAmount&&ticketRecordVo.conditionAmount!=null){
                            condition=ticketRecordVo.conditionAmount;
                        }
                        var style="display:none";
                        if(index==1){
                            style="display:block";
                        }
                        htmlStr +='<div  style="'+style+'" class="kj-div"><i class="jf-price2 highlight" id="'+ticketRecordVo.codeData +'" >'+ticketRecordVo.amount
                        +'</i>元代金券（满<i class="highlight" >'+condition
                        +'</i>可抵扣）</div>';
                        index++;
                    });
                    htmlStr +='<a id="ye-checkbox" class="right-center un-check" uid="ye"></a></div>';
                }
                $("#fans").html(htmlStr);
            }
        }
    })
}