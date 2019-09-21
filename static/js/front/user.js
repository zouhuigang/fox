// JavaScript Document
var pwd_isok = 0;
var email_isok = 0;
var username_isok = 0;
var code_isok = 0;
var vemail_isok = 0;
var vmobile_isok = 0;

var _user = {
    emailExp: new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$"),
    usernameExp: new RegExp("^(?!_)(?!.*?_$)[a-zA-Z0-9_]{6,20}$"), //(\u4e00-\u9fa5)
    passwordExp: new RegExp("^[a-zA-Z0-9]{6,20}$"),
    mobileExp: new RegExp("^[1][3-8]\\d{9}$"),
    chkpwd: function (n) {
        if (!n) {
            alertMsg("请输入密码！");
            pwd_isok = 0;
        } else {
            if (this.passwordExp.test(n)) {
                pwd_isok = 1;
            } else {
                alertMsg("您输入的密码格式不正确！（6-20字母或数字）");
                pwd_isok = 0;
                return false;
            }
        }
    },
    chkemail: function (n) {
        if (!n) {
            alertMsg("请输入邮箱地址！");
            email_isok = 0;
        } else {
            if (this.emailExp.test(n)) {
                email_isok = 1;
            } else {
                alertMsg("邮箱地址格式不正确！（例：example@qq.com）");
                email_isok = 0;
            }
        }
    },
    valicatemail: function (n) {
        if (!n) {
            alertMsg("请输入邮箱地址！");
            vemail_isok = 0;
        } else {
            if (this.emailExp.test(n)) {
                $.ajax({
                    url: "/ajax/userBasic/sendcode/",
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
                            alertMsg("邮箱已被占用！");
                            vemail_isok = 0;
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
            } else {
                alertMsg("邮箱地址格式不正确！（例：example@qq.com）");
                vemail_isok = 0;
            }
        }
    },
    valicatmobile: function (n) {
        if (!n) {
            alertMsg("请输入手机号码！");
            vmobile_isok = 0;
        } else {
            if (this.mobileExp.test(n)) {
                $.ajax({
                    url: "/ajax/userBasic/sendcode/",
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
                            alertMsg("手机号码已被占用！");
                            vmobile_isok = 0;
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
            } else {
                alertMsg("手机号码格式不正确！");
                vmobile_isok = 0;
            }
        }
    },
    valicatusername: function (n) {
        if (!n) {
            alertMsg("请输入用户名！");
            username_isok = 0;
        } else {
            if (this.usernameExp.test(n)) {
                $.ajax({
                    url: "/ajax/userBasic/sendcode/",
                    data: {ajaxdata: "chkusername", username: n, ajax: Math.random()},
                    timeout: 90000,
                    async: false,
                    beforeSend: function () {
                    },
                    dataType: 'json',
                    success: function (o) {
                        if (o.isok == true) {
                            username_isok = 1;
                        } else {
                            username_isok = 0;
                            alertMsg("用户名已被占用，请更换用户名！");
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
            } else {
                username_isok = 0;
                alertMsg("用户名格式不正确！（由（6-20个）字母或数字或'_'组成，不能包含特殊字符）");
            }
        }
    },
    chkcode: function (n) {
        if (!n) {
            code_isok = 0;
            alertMsg("<span style='color:red;'>请输入验证码！</span>");
        } else {
            $.ajax({
                url: "/ajax/userBasic/sendcode/",
                data: {ajaxdata: "chkcode", code: n, ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok == true) {
                        code_isok = 1;
                    } else {
                        code_isok = 0;
                        alertMsg("<span style='color:red;'>验证码错误！</span>");
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        }
    },

    Reg: function () {
    	var reg_nickname = $('#reg_nickname').val();
        var reg_mobile = $('#reg_mobile').val();
        var reg_code = $("#reg_code").val();
        var reg_pwd = $("#reg_pwd").val();
        var is_ok = $("input[name='reg_isok']:checked").val();
        
        if (!reg_nickname) {
           alertMsg('<span style="color:red;">请填写用户名</span>');
            return false;
        }
        if (!reg_mobile) {
            alertMsg('<span style="color:red;">请填写手机号</span>');
            return false;
        }
        this.valicatmobile(reg_mobile);
        if (!vmobile_isok) {
            return false;
        }
        if (!reg_code) {
            alertMsg('<span style="color:red;">请填写验证码</span>');
            return false;
        }
       
        this.chkcode(reg_code);
        if (!code_isok) {
            return false;
        }
        this.chkpwd(reg_pwd);
        if (!pwd_isok) {
            return false;
        }
       
        if (is_ok != '1') {
            alertMsg("<span style='color:red;'>请阅读并同意用户注册协议！</span>");
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='/'", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#regForm').ajaxSubmit(options);
        return false;
    },
    //登录
    Login: function () {

        var loginname = $("#lg_username").val();
        var password = $("#lg_pwd").val();
        var reurl = $("#reurl").val();

        //帐号
        if (!loginname) {
            alertMsg("<span style='color:red;'>请输入手机号码！</span>");
            return false;
        }
        //密码
        if (!password) {
            alertMsg("<span style='color:red;'>请输入登录密码！</span>");
            return false;
        } else {
            if (!this.passwordExp.test(password)) {
                alertMsg("<span style='color:red;'>密码格式有误！</span>");
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
                    setTimeout("window.location.href='" + reurl + "'", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
                return false;
            }
        };
        $('#loginForm').ajaxSubmit(options);
        return false;
    },
    chkTime: function () {
        $.ajax({
            url: "/ajax/userBasic/sendcode/",
            data: {ajaxdata: "chkTime", ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    window.location.href = "/fastorder/index/";
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>", 3);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    Uploadtext: function () {
    	var sub1 = $('#sub1').val();
        var sub2 = $('#sub2').val();
        var title = $("#title").val();
        var content = $("#content").val();
        var file_upload = $("#file_upload").val();
        
        if (!title) {
           alertMsg('<span style="color:red;">请输入标题</span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                     setTimeout("window.location.href='"+o.jumpPage+"'", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#uploadtextForm').ajaxSubmit(options);
        return false;
    },
    Uploadppt: function () {
    	var sub1 = $('#sub1ppt').val();
        var sub2 = $('#sub2ppt').val();
        var title = $("#titleppt").val();
        var content = $("#contentppt").val();
     //   var file_uploadpre = $("#prefileppt").val();
        var file_upload = $("#fileppt").val();
        if (!title) {
           alertMsg('<span style="color:red;">请输入标题</span>');
            return false;
        }
        //alert(file_uploadpre);
        if (!file_upload) {
            alertMsg('<span style="color:red;">请上传文件</span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='"+o.jumpPage+"'", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#uploadpptForm').ajaxSubmit(options);
        return false;
    },
    Uploadreward: function () {//发布悬赏
    	//var sub1 = $('#sub1ppt').val();
       // var sub2 = $('#sub2ppt').val();
        var title = $("#reward-title").val();
         
        if (!title) {
           alertMsg('<span style="color:red;">请输入描述</span>');
            return false;
        }
     
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#rewardForm').ajaxSubmit(options);
        return false;
    },
    Downtext: function (id) {
    	var aj = $.ajax( {    
    	    url:'/everybody_watching/downtext/',// 跳转到 action    
    	    data:{ reid : id},    
    	    type:'post',    
    	    cache:false,    
    	    dataType:'json',    
    	    success:function(data) {    
    	        if(data.isok){  
    	        	$('.floatmain .close').parents(".floatmain").hide();
    	        	if(data.oneself){//自己的文件，免费下载
    	        	layer.confirm('该文件为您自己的文件，可免费无限次下载，确定下载？', {
    	        	    btn: ['下载','取消'], //按钮
    	        	    shade: false //不显示遮罩
    	        	}, function(){
    	        	    //layer.msg('的确很重要', {icon: 1});
    	        		layer.closeAll('dialog');
    	        		window.location.href = data.data;
    	        	}, function(){
    	        	    //layer.msg('奇葩么么哒', {shift: 6});
    	        	});
    	        	}else{
    	        	window.location.href = data.data;//文件位置   
    	        	}
    	               
    	        }else{   
    	        	alertMsg("<span style='color:red;'>" + data.data + "</span>");
    	        	 setTimeout("window.location.reload()", 1000);
    	        }    
    	     },    
    	     error : function() {    
    	          // view("异常！");    
    	          alert("异常！");    
    	     }    
    	});  
        //$('#uploadtextForm').ajaxSubmit(options);
        return false;
    },
    Downtextpre: function (rid) {
    	javascript:ShowTC('#xzkjf');
    	var rid=parseInt(rid);
    	    $.ajax({
            url: "/ajax_refresh/loadtext/",
            data: {rid:rid, ajax: Math.random()},
            async: false,
            timeout: 90000,
            dataType: 'html',
            success: function (o) {
            	$('#xzkjf').html(o);
               // alertMsg(o.data);
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    
       Downppt: function (id) {
    	var aj = $.ajax( {    
    	    url:'/everybody_watching/downppt/',// 跳转到 action    
    	    data:{ reid : id},    
    	    type:'post',    
    	    cache:false,    
    	    dataType:'json',    
    	    success:function(data) {    
    	        if(data.isok){  
    	        	$('.floatmain .close').parents(".floatmain").hide();
    	        	if(data.oneself){//自己的文件，免费下载
    	        	layer.confirm('该文件为您自己的文件，可免费无限次下载，确定下载？', {
    	        	    btn: ['下载','取消'], //按钮
    	        	    shade: false //不显示遮罩
    	        	}, function(){
    	        	    //layer.msg('的确很重要', {icon: 1});
    	        		layer.closeAll('dialog');
    	        		window.location.href = data.data;
    	        	}, function(){
    	        	    //layer.msg('奇葩么么哒', {shift: 6});
    	        	});
    	        	}else{
    	        	window.location.href = data.data;//文件位置   
    	        	}
    	               
    	        }else{   
    	        	alertMsg("<span style='color:red;'>" + data.data + "</span>");
    	        	 setTimeout("window.location.reload()", 1000);
    	        }    
    	     },    
    	     error : function() {    
    	          // view("异常！");    
    	          alert("异常！");    
    	     }    
    	});  
        //$('#uploadtextForm').ajaxSubmit(options);
        return false;
    },
        
       Downpptbuyout: function (id) {//买断下载
    	var aj = $.ajax( {    
    	    url:'/everybody_watching/downpptbuyout/',// 跳转到 action    
    	    data:{ reid : id},    
    	    type:'post',    
    	    cache:false,    
    	    dataType:'json',    
    	    success:function(data) {    
    	        if(data.isok){  
    	        	$('.floatmain .close').parents(".floatmain").hide();
    	        	if(data.oneself){//自己的文件，免费下载
    	        	layer.confirm('该文件为您自己的文件，可免费无限次下载，确定下载？', {
    	        	    btn: ['下载','取消'], //按钮
    	        	    shade: false //不显示遮罩
    	        	}, function(){
    	        	    //layer.msg('的确很重要', {icon: 1});
    	        		layer.closeAll('dialog');
    	        		window.location.href = data.data;
    	        	}, function(){
    	        	    //layer.msg('奇葩么么哒', {shift: 6});
    	        	});
    	        	}else{
    	        	window.location.href = data.data;//文件位置   
    	        	}
    	               
    	        }else{   
    	        	alertMsg("<span style='color:red;'>" + data.data + "</span>");
    	        	 setTimeout("window.location.reload()", 1000);
    	        }    
    	     },    
    	     error : function() {    
    	          // view("异常！");    
    	          alert("异常！");    
    	     }    
    	});  
        //$('#uploadtextForm').ajaxSubmit(options);
        return false;
    },
    Downpptpre: function (rid) {
    	javascript:ShowTC('#xzkjf');
    	var rid=parseInt(rid);
    	    $.ajax({
            url: "/ajax_refresh/loadppt/",
            data: {rid:rid, ajax: Math.random()},
            async: false,
            timeout: 90000,
            dataType: 'html',
            success: function (o) {
            	$('#xzkjf').html(o);
               // alertMsg(o.data);
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    DownpptpreBuyout:function (rid){
    	
    	javascript:ShowTC('#xzkjf');
    	var rid=parseInt(rid);
    	    $.ajax({
            url: "/ajax_refresh/loadpptbuyout/",
            data: {rid:rid, ajax: Math.random()},
            async: false,
            timeout: 90000,
            dataType: 'html',
            success: function (o) {
            	$('#xzkjf').html(o);
               // alertMsg(o.data);
            },
            complete: function () {
            },
            error: function () {
            }
        });
    
    	
    },
    
    Pointexchange: function () {
    	var points_num = $('#points_num').val();
        var points_mobile = $('#points_mobile').val();
        var points_code = $("#points_code").val();
      if (!points_num) {
           alertMsg('<span style="color:red;">请输入兑换金额</span>');
            return false;
        }
      var points_numtrue=this.isPositiveNum(points_num);
      if (!points_numtrue) {
          alertMsg('<span style="color:red;">请输入正整数</span>');
           return false;
       }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='/'", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#pointsForm').ajaxSubmit(options);
        return false;
    }, 
    //判断是否为正实数。
   jdmoney: function (money){
    var t=/^\d+(\.\d+)?$/;
    return t.test(money)
    },
    isPositiveNum: function (s){//是否为正整数
    	var re = /^[0-9]*[1-9][0-9]*$/ ;
    	return re.test(s)
    	},
    sendEXcode: function (mobile) {
        if (!this.mobileExp.test(mobile)) {
            alertMsg("<span style='color:red;'>手机号码错误！</span>");
            return false;
        }
        $.ajax({
            url: "/ajax/userBasic/sendcode/",
            data: {ajaxdata: "sendMcode", type: 'bdA', mobile: mobile, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                alertMsg(o.data);
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    commented:function (){
    	var title = $('#titlecomment').val();
         if (!title) {
           alertMsg('<span style="color:red;">请输入您的评论..</span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#commentedForm').ajaxSubmit(options);
        return false;
    },
        commented_w:function (post_id){
    	//var title = $('#titlecomment').val();
    	var title = $('#titlecomment'+post_id).val();
         if (!title) {
           alertMsg('<span style="color:red;">请输入您的评论..</span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#commentedForm'+post_id).ajaxSubmit(options);
        return false;
    },
    commentreplyed:function (post_id){
    	
    	//var idstr="preview"+id+'-'+count;
    	//$('#'+idstr).remove();
    	var title = $('#titler'+post_id).val();
         if (!title) {
           alertMsg('<span style="color:red;">请输入您的评论..</span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
            	layer.closeAll(); //关闭后面新加的js
            },
            dataType: 'json',
            success: function (o) {
            	if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#commentedreplyForm'+post_id).ajaxSubmit(options);
        return false;
    },
    zan:function (postid,type){
    	  $.ajax({
              url: "/everybody_watching/zan/",
              data: {postid:postid,type:type, ajax: Math.random()},
              async: false,
              timeout: 90000,
              beforeSend: function () {
              },
              dataType: 'json',
              success: function (o) {
                  //alertMsg(o.data);
            	  if(type=='post'){
            		  $('#zana'+postid).html('<i></i>'+o.data); 
            	  }else if(type=='postreply'){
            		  $('#zanar'+postid).html('<i></i>赞（'+o.data+')');  
            	  }
            	  
              },
              complete: function () {
              },
              error: function () {
              }
          });
    },
    addfriends:function (uid,type){//加关注
  	  $.ajax({
            url: "/welcome/addfriends/",
            data: {uid:uid,type:type, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                //alertMsg(o.data);
            	if(o.isok){
            		 if(o.data=='add'){
                 		  $('#addfriends'+uid).addClass("old"); 
                 	  }else if(o.data=='minus'){
                 		 $('#addfriends'+uid).removeClass("old"); 
                 	  }
            	}else{
            		if(o.data=='nologin'){
            			alertMsg("<span style='color:red;'>请先登录..</span>");
            		}else if(o.data=='copy'){
            			alertMsg("<span style='color:red;'>请勿关注自己..</span>");
            		}
            	}
          	 
          	  
            },
            complete: function () {
            },
            error: function () {
            }
        });
  },
  addfriendsstyle:function (uid,type){//加关注
  	  $.ajax({
            url: "/welcome/addfriends/",
            data: {uid:uid,type:type, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                //alertMsg(o.data);
            	if(o.isok){
            		 if(o.data=='add'){
            			 $('#addfriends'+uid).html('');
            			$('#addfriends'+uid).addClass('quxiaoguanz');	
                 	  }else if(o.data=='minus'){
                 		 $('#addfriends'+uid).html('<img src="/static/ydb/images/guanzhuicon02.jpg" width="76" height="27" />');
                 		 $('#addfriends'+uid).removeClass("quxiaoguanz"); 
                 	  }
            	}else{
            		if(o.data=='nologin'){
            			alertMsg("<span style='color:red;'>请先登录..</span>");
            		}else if(o.data=='copy'){
            			alertMsg("<span style='color:red;'>请勿关注自己..</span>");
            		}
            	}
          	 
          	  
            },
            complete: function () {
            },
            error: function () {
            }
        });
  },
  myucenteraddfriends:function (uid,type){//加关注样式不一样
  	  $.ajax({
            url: "/welcome/addfriends/",
            data: {uid:uid,type:type, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                //alertMsg(o.data);
            	if(o.isok){
            		 if(o.data=='add'){
            			  $('#addfriends'+uid).removeClass("bc22428"); 
            			  $('#addfriends'+uid).html("取消关注");
                 	  }else if(o.data=='minus'){
                 		 $('#addfriends'+uid).addClass("bc22428"); 
                 		 $('#addfriends'+uid).html("添加关注"); 
                 	  }
            	}else{
            		if(o.data=='nologin'){
            			alertMsg("<span style='color:red;'>请先登录..</span>");
            		}else if(o.data=='copy'){
            			alertMsg("<span style='color:red;'>请勿关注自己..</span>");
            		}
            	}
          	 
          	  
            },
            complete: function () {
            },
            error: function () {
            }
        });
  },
  friendscircle:function (uid,type){//加关注样式不一样
  	  $.ajax({
            url: "/welcome/friendscircle/",
            data: {uid:uid,type:type, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                //alertMsg(o.data);
            	if(o.isok){
            		 if(o.data=='add'){
            			  $('#friendscircle'+uid).removeClass("bc22428"); 
            			  $('#friendscircle'+uid).html("从课题圈移去");
                 	  }else if(o.data=='minus'){
                 		 $('#friendscircle'+uid).addClass("bc22428"); 
                 		 $('#friendscircle'+uid).html("添加至课题圈"); 
                 	  }
            	}else{
            		if(o.data=='nologin'){
            			alertMsg("<span style='color:red;'>请先登录..</span>");
            		}else if(o.data=='copy'){
            			alertMsg("<span style='color:red;'>请勿添加自己..</span>");
            		}
            	}
          	 
          	  
            },
            complete: function () {
            },
            error: function () {
            }
        });
  },
  adopt:function (viewid,postid){//加关注样式不一样
  	  $.ajax({
            url: "/trade_zone/adopt/",
            data: {viewid:viewid,postid:postid, ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                //alertMsg(o.data);
            	if(o.isok){
            		if(o.data=='success'){
            			 alertMsg("<span style='color:red;'>采纳成功！</span>");
            			 setTimeout("window.location.reload()", 1000);
                         
            		}
            		
            	}else{
            		if(o.data=='nologin'){
            			alertMsg("<span style='color:red;'>请先登录..</span>");
            		}else if(o.data=='notexist'){
            			alertMsg("<span style='color:red;'>系统资源不存在</span>");
            		}
            		else if(o.data=='notexistpost'){
            			alertMsg("<span style='color:red;'>该答案不存在</span>");
            		}
            	}
          	 
          	  
            },
            complete: function () {
            },
            error: function () {
            }
        });
  },
  Refresh:function (p,page,type,conid){//加关注样式不一样
  	  $.ajax({
            url: "/ajax_refresh/"+type,
            data: {p:p,page:page,ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'html',
            success: function (data) {
            	$("#"+conid).html(data);
            },
            complete: function () {
            },
            error: function () {
            }
        });
  },
  CallDownload:function (sresid){//呼叫下载
  	  $.ajax({
            url: "/everybody_watching/CallDownload/",
            data: {sresid:sresid,ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (data) {
            	if(data.isok){
            		if(data.oneself){//为自己的文件
            		//$('.floatmain .close').parents(".floatmain").hide();
    	        	if(data.oneself){//自己的文件，免费下载
    	        	layer.confirm('该文件为您自己的文件，可免费无限次下载，确定下载？', {
    	        	    btn: ['下载','取消'], //按钮
    	        	    shade: false //不显示遮罩
    	        	}, function(){
    	        	    //layer.msg('的确很重要', {icon: 1});
    	        		layer.closeAll('dialog');
    	        		window.location.href = data.data;
    	        	}, function(){
    	        	    //layer.msg('奇葩么么哒', {shift: 6});
    	        	});
            	}
            	}else{//不是自己的文件,呼叫成功
            	alertMsg("<span style='color:red;'>"+data.data+"</span>");
            	
            	}
            }else{//呼叫不成功
            	
            	alertMsg("<span style='color:red;'>"+data.data+"</span>");
            }
            	},
            complete: function () {
            },
            error: function () {
            }
        });
  },
  Answering:function (sresid,conid){//应答
  	//alert(conid);
  	  $.ajax({
            url: "/everybody_watching/answering/",
            data: {sresid:sresid,ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (data) {
            	if(data.isok){
            		//alertMsg('<span style="color:green;">应答成功..</span>');
            		      $('#answering'+conid).removeClass("old"); 
            			  $('#answering'+conid).html("已应答");
            	}
            	},
            complete: function () {
            },
            error: function () {
            }
        });
  },
    write_article: function () {//发文章
        var sub1 =parseInt($('#parentcate option:selected').val());
        var sub2 = parseInt($('#childcate option:selected').val());
        var title = $("#title").val();
      
         if (!sub1) {
           alertMsg('<span style="color:red;">请选择分类</span>');
            return false;
        }
         if (!sub2) {
         	//alert(sub2);
           alertMsg('<span style="color:red;">请选择子分类</span>');
            return false;
        }
        if (!title) {
           alertMsg('<span style="color:red;">请输入标题</span>');
            return false;
        }
     
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='/'", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#write_articleForm').ajaxSubmit(options);
        return false;
    },
  Delreward:function (dresid){//删除悬赏
  	//alert(dresid);
  	  $.ajax({
            url: "/trade_zone/delreward/",
            data: {dresid:dresid,ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (data) {
            	if(data.isok){
            		 alertMsg("<span style='color:red;'>" + data.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
            	}
            	},
            complete: function () {
            },
            error: function () {
            }
        });
          return false;
  },  
  Delpost:function (dresid){//删除悬赏
  	//alert(dresid);
  	  $.ajax({
            url: "/my_comment/delpost/",
            data: {dresid:dresid,ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (data) {
            	if(data.isok){
            		 alertMsg("<span style='color:red;'>" + data.data + "</span>");
                    setTimeout("window.location.reload()", 1000);
            	}
            	},
            complete: function () {
            },
            error: function () {
            }
        });
          return false;
  },  
  URpost:function (postid,title){//回复评论
  
//捕获页
layer.open({
    type: 1,
    shade: false,
    title: '回复'+title, //不显示标题
    area: '610px',
    content: $('#URpost'+postid), //捕获的元素
    cancel: function(index){
        layer.close(index);
        this.content.hide();
    }
});
    return false;
  },
  
  ////提现
  exchangeRmb: function () {
        var withdrawal =$('#withdrawal').val();
        var alitruename = $('#alitruename').val();
        var aliaccount = $('#aliaccount').val();
        var code = $('#code').val();
        var mobile = $('#mobile').val();  
        
         if (!mobile) {
            alertMsg('<span style="color:red;">手机号获取错误！</span>');
            return false;
        }
         if (!withdrawal) {
           alertMsg('<span style="color:red;">请输入提现金额</span>');
            return false;
        }
         var withdrawaltrue=this.isPositiveNum(withdrawal);
         if (!withdrawaltrue) {
           alertMsg('<span style="color:red;">提现金额请输入正整数</span>');
            return false;
         }
         if (!alitruename) {
         	//alert(sub2);
           alertMsg('<span style="color:red;">请输入支付宝真实姓名</span>');
            return false;
        }
        if (!aliaccount) {
           alertMsg('<span style="color:red;">请输入支付宝账号</span>');
            return false;
        }
        if (!code) {
           alertMsg('<span style="color:red;">请输入验证码</span>');
            return false;
        }
        $.ajax({
                url: "/ajax/userBasic/sendcode/",
                data: {ajaxdata: "chkcode", code: code, type: 'bdA', mobile: mobile,  ajax: Math.random()},
                async: false,
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok == true) {
                        code_isok = 1;
                    } else {
                        code_isok = 0;
                        alertMsg("<span style='color:red;'>验证码错误！</span>");
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
         if (!code_isok) {
            //alertMsg('<span style="color:red;">验证码错误/span>');
            return false;
        }
        var options = {
            beforeSubmit: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.info + "</span>");
                    setTimeout("window.location.href='/'", 1000);
                } else {
                    alertMsg("<span style='color:red;'>" + o.info + "</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            }
        };
        $('#exchangeRmbForm').ajaxSubmit(options);
        return false;
    },
  WantTheOriginal:function (vid){//呼叫下载
  	  $.ajax({
            url: "/everybody_watching/WantTheOriginal/",
            data: {article_id:vid,ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (data) {
            	if(data.isok){
            		alertMsg("操作成功..");
            		setTimeout("window.location.href='/everybody_watching?stype=file'", 1000);
            	}else{//呼叫不成功
            	
            	alertMsg("<span style='color:red;'>"+data.data+"</span>");
            }
            	},
            complete: function () {
            },
            error: function () {
            }
        });
  },
  WantTheSlide:function (vid){
  	  $.ajax({
            url: "/everybody_watching/WantTheSlide/",
            data: {article_id:vid,ajax: Math.random()},
            async: false,
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (data) {
            	if(data.isok){
            		alertMsg("操作成功..");
            		setTimeout("window.location.href='/everybody_watching?stype=file'", 1000);
            	}else{//呼叫不成功
            	
            	alertMsg("<span style='color:red;'>"+data.data+"</span>");
            }
            	},
            complete: function () {
            },
            error: function () {
            }
        });
  }
  
};