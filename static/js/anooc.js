// 作者:邹慧刚,一些常用的js函数，整理了下，方面各个项目调用
// 在anooc.js之前，需要引入其他js,如:jquery 和layer.js
// 版本:2017-7-6 v1.0.0
var pwd_isok = 0;
var email_isok = 0;
var vemail_isok = 0;
var vmobile_isok = 0;
var iTime = 120;
var _anooc = {
	emailExp: new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$"),
    usernameExp: new RegExp("^(?!_)(?!.*?_$)[a-zA-Z0-9_]{6,20}$"), //(\u4e00-\u9fa5)
    passwordExp: new RegExp("^[a-zA-Z0-9]{6,20}$"),
    mobileExp: new RegExp("^[1][3-8]\\d{9}$"),
    chkpwd: function (n) {
        if (!n) {
            art.dialog.tips("请输入密码！");
            pwd_isok = 0;
        } else {
            if (this.passwordExp.test(n)) {
                pwd_isok = 1;
            } else {
                art.dialog.tips("您输入的密码格式不正确！（6-20字母或数字，不包含特殊字符）");
                pwd_isok = 0;
                return false;
            }
        }
    },
	valicatmobile: function (n) {
        if (!n) {
            alert("<span style='color:red;'>请输入手机号码！</span>");
            vmobile_isok = 0;
        } else {
            if (this.mobileExp.test(n)) {
                $.ajax({
                    url: "/ajax/ucenterFront/",
                    data: {ajaxdata: "chkmobile", mobile: n, ajax: Math.random()},
                    async: false,
                    timeout: 90000,
                    beforeSend: function () {
                    },
                    dataType: 'json',
                    success: function (o) {
                        if (o.isok == true) {
                            vmobile_isok = 1;
                        } else {
                            alert("<span style='color:red;'>手机号码已被占用！</span>");
                            vmobile_isok = 0;
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
            } else {
                alert("<span style='color:red;'>手机号码格式不正确！</span>");
                vmobile_isok = 0;
            }
        }
    },
	  /*
	   *_TYPES:button/a
	   * */
	sendCode: function (_INPUT_ID,_TYPES,_TYPES_ID) {
        var n = $("#"+_INPUT_ID).val();//请输入验证码,input的id
        //alert(n);
        /*this.valicatmobile(n);
        if (!vmobile_isok) {
            return false;
        }*/
	
	    if (!this.mobileExp.test(n)) {
           // alertMsg("<span style='color:red;'>请正确输入手机号码！</span>");
		   	//alert("请正确输入手机号码!");
			weui.topTips('请正确输入手机号码', 3000);
            return false;
        }
        $.ajax({
            url: "/anooc/sendcode/",
            data: {ajaxdata: "sendMcode", type: 'bdB', mobile: n, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
					if(_TYPES_ID&&_TYPES=="a"){//存在则有倒计时，为空则不用倒计时
						_anooc.RemainTime_a(_TYPES_ID);//倒计时超链接a的id	
					}else if(_TYPES_ID&&_TYPES=="button"){
						_anooc.RemainTime(_TYPES_ID);//button的id	
					}
                	weui.topTips(o.data, 3000);
                    //alert("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    //alert("<span style='color:red;'>" + o.data + "</span>");
				    weui.topTips(o.data, 3000);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },

	RemainTime_a: function (buttonID){
		//验证码标签用a做的
		//<a href="javascript:;" onClick="return _user.sendRcode('reg')" id="zphone" >获取验证码</a>
		if(buttonID){
			var buttonID=buttonID;
		}else{
			var buttonID='zphone';
		}
         $("#"+buttonID).removeAttr("onclick"); 
      	var iSecond,sSecond="",sTime="";
		if (iTime >= 0){
			iSecond = parseInt(iTime%60);
			iMinute = parseInt(iTime/60)
			if (iSecond >= 0){
				if(iMinute>0){
					sSecond = iMinute + "分" + iSecond + "秒";
				}else{
					sSecond = iSecond + "秒";
				}
			}
			sTime=sSecond;
			if(iTime==0){
				clearTimeout(Account);
				sTime='重新获取';
				iTime = 120;
				//document.getElementById('zphone').disabled = false;
				$("#"+buttonID).attr("onclick","return _anooc.sendCode();"); 
			}else{
				Account = setTimeout("_anooc.RemainTime_a('"+buttonID+"')",1000);
				iTime=iTime-1;
			}
		}else{
			//sTime='没有倒计时';
			sTime='已发送';
		}
		$("#"+buttonID).html(sTime);

	},
	RemainTime: function (buttonID){
		//验证码标签用input做的
		//<input type="button"  id="zphone" onClick="_user.sendRcode('reg')"  value="获取验证码">
		////<button class="weui-vcode-btn" id="btncode" onclick="_anooc.sendCode('mobile','button','btncode');" disabled="" value="1分47秒">1分47秒</button>
	   if(buttonID){
			var buttonID=buttonID;
		}else{
			var buttonID='zphone';
		}
	   document.getElementById(buttonID).disabled = true;
		var iSecond,sSecond="",sTime="";
		if (iTime >= 0){
			iSecond = parseInt(iTime%60);
			iMinute = parseInt(iTime/60)
			if (iSecond >= 0){
				if(iMinute>0){
					sSecond = iMinute + "分" + iSecond + "秒";
				}else{
					sSecond = iSecond + "秒";
				}
			}
			sTime=sSecond;
			if(iTime==0){
				clearTimeout(Account);
				sTime='重新获取';
				iTime = 120;
				document.getElementById(buttonID).disabled = false;
			}else{
				Account = setTimeout("_anooc.RemainTime('"+buttonID+"')",1000);
				iTime=iTime-1;
			}
		}else{
			sTime='没有倒计时';
		}
		
		document.getElementById(buttonID).value = sTime;
		//document.getElementById(buttonID).innerHtml = sTime;
		$('#'+buttonID).text(sTime);
	}


//end _anooc
};


//移动端弹框插件
//Region Diglog Redefine
function mAlert(Msg, url) {
    layer.closeAll();
    if (url != null && url != 'undefined' && url.length > 0) {
        layer.open({
            content: Msg,
            btn: ['确认'],
            shadeClose: false,
            yes: function () {
                location.href = url;
            }
        });
    }
    else {
        layer.open({
            content: Msg,
            time: 5
        });
    }
}

function mcAlert(msg)
{
    layer.closeAll();
    layer.open({
        content: msg,
        time: 5
    });
}

function mConfirm(tipMsg, okCallback) {
    layer.open({
        content: tipMsg,
        btn: ['取消', '确定'],
        shadeClose: false,
        yes: function () {
            layer.closeAll();
        },
        no: function () {
            okCallback();
        }
    });
}

function mAlertByQQ(Msg, url, btns) {
    layer.closeAll();
    layer.open({
        content: Msg,
        btn: btns,
        shadeClose: false,
        yes: function () {
            location.href = url;
        }, no: function () {
        }
    });
}

function mError(Msg) {

    layer.closeAll();
    layer.open({
        content: Msg,
        style: 'background-color:#F05133; color:#fff;',
        time: 5
    });

}

//function mAlert(Msg,url) {
//    layer.closeAll();
//    layer.open({ content: Msg,

//    btn: ['确认'],
//    shadeClose: false,
//    yes: function(){
//        location.href = url;
//    }
//    });
//}

function mLoading() {
    layer.closeAll();
    layer.open({ type: 2 });
}

function mClose() {
    layer.closeAll();
}
function zAlert($msg,$btn){
	layer.open({
  	content: $msg,
  	btn: $btn,
  	shadeClose: false,
  	yes: function(index){
		layer.close(index)
	}
	});
}
//EndRegion
function ValidatePhoneNo(PNo) {
    var patrn = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    return patrn.test(PNo);
}


