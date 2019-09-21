// JavaScript Document
var pwd_isok = 0;
var email_isok = 0;
var vemail_isok = 0;
var vmobile_isok = 0;
var iTime = 120;
var _ucenter = {
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
    chkemail: function (n) {
        if (!n) {
            art.dialog.tips("请输入邮箱地址！");
            email_isok = 0;
        } else {
            if (this.emailExp.test(n)) {
                email_isok = 1;
            } else {
                art.dialog.tips("邮箱地址格式不正确！（例：example@qq.com）");
                email_isok = 0;
            }
        }
    },
    valicatemail: function (n) {
        if (!n) {
            art.dialog.tips("请输入邮箱地址！");
            vemail_isok = 0;
        } else {
            if (this.emailExp.test(n)) {
                $.ajax({
                    url: "/ajax/ucenterFront/",
                    data: {ajaxdata: "chkemail", email: n, ajax: Math.random()},
                    async: false,
                    timeout: 90000,
                    beforeSend: function () {
                    },
                    dataType: 'json',
                    success: function (o) {
                        if (o.isok == true) {
                            vemail_isok = 1;
                        } else {
                            art.dialog.tips("邮箱已被占用！");
                            vemail_isok = 0;
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
            } else {
                art.dialog.tips("邮箱地址格式不正确！（例：example@qq.com）");
                vemail_isok = 0;
            }
        }
    },
    valicatmobile: function (n) {
        if (!n) {
            alertMsg("<span style='color:red;'>请输入手机号码！</span>");
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
                            alertMsg("<span style='color:red;'>手机号码已被占用！</span>");
                            vmobile_isok = 0;
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
            } else {
                alertMsg("<span style='color:red;'>手机号码格式不正确！</span>");
                vmobile_isok = 0;
            }
        }
    },
    sendBDcode: function () {
        var n = $("#oldmobile").val();
        $.ajax({
            url: "/ajax/userBasic/sendcode/",
            data: {ajaxdata: "sendMcode", type: 'bdA', mobile: n, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                	_ucenter.RemainTime_a('zphone');
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    sendBDcodeB: function () {
        var n = $("#bd_mobile").val();
        //alert(n);
        this.valicatmobile(n);
        if (!vmobile_isok) {
            return false;
        }
        $.ajax({
            url: "/ajax/userBasic/sendcode/",
            data: {ajaxdata: "sendMcode", type: 'bdB', mobile: n, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                	_ucenter.RemainTime_a('zphonenew');
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
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
				sTime='获取验证码';
				iTime = 120;
				//document.getElementById('zphone').disabled = false;
				$("#"+buttonID).attr("onclick","return _ucenter.sendBDcode();"); 
			}else{
				Account = setTimeout("_ucenter.RemainTime_a('"+buttonID+"')",1000);
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
				sTime='获取手机验证码';
				iTime = 120;
				document.getElementById(buttonID).disabled = false;
			}else{
				Account = setTimeout("_ucenter.RemainTime('"+buttonID+"')",1000);
				iTime=iTime-1;
			}
		}else{
			sTime='没有倒计时';
		}
		
		document.getElementById(buttonID).value = sTime;
	},
	
	
    bdMobile: function () {
        var oldmobile = $("#oldmobile").val();
        var bd_oldcode = $("#bd_oldcode").val();
        var bd_mobile = $("#bd_mobile").val();
        var bd_newcode = $("#bd_newcode").val();

        if (!bd_oldcode) {
            alertMsg("<span style='color:red;'>请输入原手机号验证码！</span>");
            return false;
        }
        if (!bd_mobile) {
            alertMsg("<span style='color:red;'>请输入新手机号！</span>");
            return false;
        } else {
            this.valicatmobile(bd_mobile);
            if (!vmobile_isok) {
                return false;
            }
        }
        if (!bd_newcode) {
            alertMsg("<span style='color:red;'>请输入新手机号验证码！</span>");
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
                return false;
            }
        };
        $('#bdForm').ajaxSubmit(options);
        return false;
    },
    sendFcode: function () {
    	var n = $("#fpwd_mobile").val();
        if (!n) {
            return false;
        }
           if (!this.mobileExp.test(n)) {
            alertMsg("<span style='color:red;'>请正确输入手机号码！</span>");
            return false;
        }
    
        $.ajax({
            url: "/ajax/userBasic/sendcode/index/",
            data: {ajaxdata: "sendMcode", type: 'findpwd', mobile: n, ajax: Math.random()},
            async: false,//同步浏览
            timeout: 90000,
            beforeSend: function () {
            	_ucenter.RemainTime('findpwdcode');
            },
            dataType: 'json',
            success: function (o) {
            	 if (o.isok == true) {
                	alertMsg("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
                return false;
            },
            complete: function () {
            },
            error: function () {
            }
        });
            return false;
    },   
    sendRcodeW: function () {//提现
        var n = $("#mobile").val();
         if (!n) {
            alertMsg("<span style='color:red;'>请输入手机号码！</span>");
            return false;
        }
        if (!this.mobileExp.test(n)) {
            alertMsg("<span style='color:red;'>请正确输入手机号码！</span>");
            return false;
        }
         $.ajax({
            url: "/ajax/userBasic/sendcode/",
            data: {ajaxdata: "sendMcode", type: 'bdA', mobile: n, ajax: Math.random()},
            async: true,//默认，异步浏览
            timeout: 90000,
            beforeSend: function () {
            	_ucenter.RemainTime('get_code');
            },
            dataType: 'json',
            success: function (o) {
            	if (o.isok == true) {
                	 alertMsg("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
               return false;
              },
            complete: function () {
            },
            error: function () {
            }
        });
          return false;
    },
        sendRcode: function () {
        var n = $("#reg_mobile").val();
         if (!n) {
            alertMsg("<span style='color:red;'>请输入手机号码！</span>");
            return false;
        }
        if (!this.mobileExp.test(n)) {
            alertMsg("<span style='color:red;'>请正确输入手机号码！</span>");
            return false;
        }
         $.ajax({
            url: "/ajax/userBasic/sendcode/",
            data: {ajaxdata: "sendMcode", type: 'reg', mobile: n, ajax: Math.random()},
            async: true,//默认，异步浏览
            timeout: 90000,
            beforeSend: function () {
            	
            },
            dataType: 'json',
            success: function (o) {
            	if (o.isok == true) {
            		_ucenter.RemainTime('get_reg_code');
                	 alertMsg("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
               return false;
              },
            complete: function () {
            },
            error: function () {
            }
        });
          return false;
    },
    Findpwd: function () {

        var fpwd_mobile = $("#fpwd_mobile").val();
        var code = $("#fpwd_code").val();
        var pwd = $("#fpwd_pwd").val();
        var newpwd = $("#fpwd_newpwd").val();

        if (!fpwd_mobile) {
            alertMsg("<span style='color:red;'>请输入您注册时的手机号！</span>");
            return false;
        } else {
            if (!this.mobileExp.test(fpwd_mobile)) {
                alertMsg("<span style='color:red;'>您输入的手机号格式不正确！</span>");
                return false;
            }
        }
        code_isok = 0;
        this.chkcode(code);
        if (!code_isok) {
            return false;
        }
        pwd_isok = 0;
        this.chkpwd(pwd);
        if (!pwd_isok) {
            return false;
        }
        if (!newpwd) {
            alertMsg("<span style='color:red;'>请再次确认新密码！</span>");
            return false;
        } else {
            if (pwd != newpwd) {
                alertMsg("<span style='color:red;'>两次密码不一致！</span>");
                return false;
            }
        }

        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='/'", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
               // return false;
            }
        };
        $('#findpwdForm').ajaxSubmit(options);
        return false;
    },
    EdtPwd: function () {
        var oldpwd = $("#edt_oldpwd").val();
        var pwd = $("#edt_pwd").val();
        var newpwd = $("#edt_newpwd").val();

        if (!oldpwd) {
            alertMsg("<span style='color:red;'>请输入您的原密码！</span>");
            return false;
        } else {
            pwd_isok = 0;
            $.ajax({
                url: "/ajax/ucenterFront/",
                data: {ajaxdata: "chkoldpwd", pwd: oldpwd, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok == true) {
                        pwd_isok = 1;
                    } else {
                        alertMsg("<span style='color:red;'>原密码不正确！</span>");
                        pwd_isok = 0;
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        }
        if (!pwd_isok) {
            return false;
        }
        if (!pwd) {
            alertMsg("<span style='color:red;'>请设置新密码！</span>");
            return false;
        } else {
            if (!this.passwordExp.test(pwd)) {
                alertMsg("<span style='color:red;'>您输入的密码格式不对！</span>");
                return false;
            }
        }

        if (!newpwd) {
            alertMsg("<span style='color:red;'>请再次确认新密码！</span>");
            return false;
        } else {
            if (pwd != newpwd) {
                alertMsg("<span style='color:red;'>两次密码不一致！</span>");
                return false;
            }
        }

        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
                return false;
            }
        };
        $('#edtPwdFrom').ajaxSubmit(options);
        return false;
    },
    addGoods: function (val) {
        var tmp = $(val).prop('rel');
        var nums = parseInt($("#" + tmp).html());
        tmp = tmp.split('_');
        var goods_id = tmp[0];
        var product_id = tmp[1];
        $.ajax({
            url: "/ajax/ucenterFront/",
            data: {ajaxdata: "addGoods", gid: goods_id, pid: product_id, nums: nums, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $(val).parent().hide().siblings().show().parents('.clearfix').addClass('cur');
                    _ucenter.getGoods();
                } else {
                    alertMsg(o.data);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    //删除购物车中的商品
    delGoods: function (val) {
        var tmp = $(val).prop('rel');
        var nums = parseInt($("#" + tmp).html());
        tmp = tmp.split('_');
        var goods_id = tmp[0];
        var product_id = tmp[1];
        $.ajax({
            url: "/ajax/ucenterFront/",
            data: {ajaxdata: "delGoods", pk: product_id, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $(val).parent().hide().siblings().show().parents('.clearfix').removeClass('cur');
                    _ucenter.getGoods();
                } else {
                    alertMsg(o.data);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    getGoods: function () {
        var tpl_id = $("#tpl_id").val();
        $.ajax({
            url: "/ajax/ucenterFront/",
            data: {ajaxdata: "getGoods", tpl_id: tpl_id, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $("#cartInfo").html(o.htmlcode);
                } else {
                    alertMsg(o.data);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    addTpl: function () {
        var tpl_name = $("#tpl_name").val();
        var pid = $("input[name='cart[pid][]']").val();

        if (!tpl_name) {
            alertMsg("<span style='color:red;'>请设置模版名称！</span>");
            return false;
        }
        if (!pid) {
            alertMsg("<span style='color:red;'>您没有选择任何商品加入模版！</span>");
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='/ucenter/ordertpl/'", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
                return false;
            }
        };
        $('#addTplForm').ajaxSubmit(options);
        return false;
    },
    editTplSub: function () {
        var tpl_name = $("#tpl_name").val();
        var pid = $("input[name='cart[pid][]']").val();

        if (!tpl_name) {
            alertMsg("<span style='color:red;'>请设置模版名称！</span>");
            return false;
        }
        if (!pid) {
            alertMsg("<span style='color:red;'>您没有选择任何商品加入模版！</span>");
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='/ucenter/ordertpl/'", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
                return false;
            }
        };
        $('#editTplForm').ajaxSubmit(options);
        return false;
    },
    editTpl: function (id) {
        $.ajax({
            url: "/ajax/ucenterFront/",
            data: {ajaxdata: "editTpl", id: id, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                window.location.href = "/ucenter/ordertpl/edit/id/" + id + "/";
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    delTpl: function (id) {
        art.dialog.confirm('确定要删除该快速购物模版！', function () {
            $.ajax({
                url: "/ajax/ucenterFront/",
                data: {ajaxdata: "delTpl", id: id, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok == true) {
                        alertMsg("<span style='color:green;'>" + o.data + "</span>");
                        setTimeout("window.location.reload()", 500);
                    } else {
                        alertMsg("<span style='color:red;'>" + o.data + "</span>");
                        setTimeout("window.location.reload()", 500);
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    useTpl: function (id) {
        art.dialog.confirm('确定将该模版商品加入购物车吗？', function () {
            $.ajax({
                url: "/ajax/ucenterFront/",
                data: {ajaxdata: "useTpl", id: id, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok == true) {
                        alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    } else {
                        alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    }
                    setTimeout("window.location.href='/shopping/'", 500);
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    saveAddress: function () {
        var frm = parseInt($("#frm").val());
        var addr_name = $("#addr_name").val();
        var addr_address = $("#addr_address").val();
        var addr_addr = $("#addr_addr").val();
        var addr_mobile = $("#addr_mobile").val();

        if (!addr_name) {
            alertMsg("<span style='color:red;'>请填写收货人名称</span>");
            return false;
        }
        if (!addr_mobile) {
            alertMsg("<span style='color:red;'>请填写收货人手机号</span>");
            return false;
        } else {
            if (!this.mobileExp.test(addr_mobile)) {
                alertMsg("<span style='color:red;'>您输入的手机号码格式不正确！</span>");
                return false;
            }
        }
        if (!addr_address) {
            alertMsg("<span style='color:red;'>请填写所在区域</span>");
            return false;
        }
        if (!addr_addr) {
            alertMsg("<span style='color:red;'>请填写详细的地址</span>");
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    if (frm == '1') {
                        setTimeout("window.location.href='/order/index/'", 500);
                    } else if (frm == '2') {
                        setTimeout("window.location.href='/fastorder/order/'", 500);
                    } else {
                        setTimeout("window.location.href='/ucenter/address/'", 500);
                    }
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
                return false;
            }
        };
        $('#addressFrom').ajaxSubmit(options);
        return false;
    },
    addressDefault: function (n) {
        var frm = parseInt($("#frm").val());
        $.ajax({
            url: "/ajax/ucenterFront/",
            data: {ajaxdata: "addressDefault", id: n, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    if (frm == '1') {
                        setTimeout("window.location.href='/order/index/'", 500);
                    } else if (frm == '2') {
                        setTimeout("window.location.href='/fastorder/order/'", 500);
                    } else {
                        setTimeout("window.location.reload()", 100);
                    }
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    addressDel: function (n) {

        art.dialog.confirm('你确定要删除该收货地址吗？', function () {
            $.ajax({
                url: "/ajax/ucenterFront/",
                data: {ajaxdata: "addressDel", id: n, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok == true) {
                        alertMsg("<span style='color:green;'>" + o.data + "</span>");
                        setTimeout("window.location.reload()", 500);
                    } else {
                        alertMsg("<span style='color:red;'>" + o.data + "</span>");
                        setTimeout("window.location.reload()", 1000);
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    OrderDel: function (orderid) {
        art.dialog.confirm('确定要删除该订单吗？', function () {
            if (!orderid) {
                alertMsg('订单参数错误！');
                return false;
            }
            $.ajax({
                url: "/ajax/ucenterFront/",
                data: {ajaxdata: "orderDel", orderid: orderid, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    alertMsg(o.data);
                    if (o.isok == true) {
                        setTimeout("window.location.reload()", 500);
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    OrderCancel: function (orderid) {
        art.dialog.confirm('订单取消之后，该订单作废无法进行任何操作。你确认要取消该订单吗？', function () {
            if (!orderid) {
                alertMsg('订单参数错误！');
                return false;
            }
            $.ajax({
                url: "/ajax/ucenterFront/",
                data: {ajaxdata: "orderCancel", orderid: orderid, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    alertMsg(o.data);
                    if (o.isok == true) {
                        setTimeout("window.location.reload()", 500);
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    OrderConfirm: function (orderid) {
        art.dialog.confirm('确认收货之后，该订单交易完成。确认已收到购买的商品吗？', function () {
            if (!orderid) {
                alertMsg('订单参数错误！');
                return false;
            }
            $.ajax({
                url: "/ajax/ucenterFront/",
                data: {ajaxdata: "orderConfirm", orderid: orderid, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    alertMsg(o.data);
                    if (o.isok == true) {
                        setTimeout("window.location.reload()", 500);
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    recharge: function () {
        var money = $("#cz_money").val();
        var payment = $("input[name='payment_id']:checked").val();
        if (money < 1) {
            alertMsg('<span style="color:red;">请输入充值金额！</span>');
            return false;
        }
        var moneytrue=this.jdmoney(money);
        if (!moneytrue) {
            alertMsg('<span style="color:red;">请输入正确金额</span>');
             return false;
         }
        if (!payment) {
            alertMsg('<span style="color:red;">请选择充值方式！</span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
                showMsg("充值信息提交中……", 'recharge');
            },
            dataType: 'html',
            success: function (o) {
                art.dialog.list['recharge'].close();//关闭充值信息提交中
               
					layer.open({
						type: 1,
						title: false,
						closeBtn: 1,
						shade: [0.8, '#000000'],
						shadeClose: true,
						content: o
						});
//              if (o.isok == true) {
//                  setTimeout("window.location.reload()", 1000);
//              }
                return false;
            }
        };
        $('#rechargeForm').ajaxSubmit(options);
        return false;
    },  
    rechargefriend: function () {
    	var money = $("#cz_money_friend").val();
        var friendsuid = $("#friendsuid").val();
        var payment = $("input[name='payment_id_friend']:checked").val();
        if (!friendsuid) {
            alertMsg('<span style="color:red;">请输入选择好友</span>');
            return false;
        }
        if (money < 1) {
            alertMsg('<span style="color:red;">请输入充值金额！</span>');
            return false;
        }
        var moneytrue=this.jdmoney(money);
        if (!moneytrue) {
            alertMsg('<span style="color:red;">请输入正确金额</span>');
             return false;
         }
        if (!payment) {
            alertMsg('<span style="color:red;">请选择充值方式！</span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
                showMsg("充值信息提交中……", 'recharge');
            },
            dataType: 'html',
            success: function (o) {
                art.dialog.list['recharge'].close();//关闭充值信息提交中
               
					layer.open({
						type: 1,
						title: false,
						closeBtn: 1,
						shade: [0.8, '#000000'],
						shadeClose: true,
						content: o
						});
//              if (o.isok == true) {
//                  setTimeout("window.location.reload()", 1000);
//              }
                return false;
            }
        };
        $('#rechargefriendForm').ajaxSubmit(options);
        return false;
    },
    //判断是否为正实数。
    jdmoney: function (money){
        var t=/^\d+(\.\d+)?$/;
        return t.test(money)
        }

};