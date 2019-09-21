$(function($) {
users= {
	     _change_email: function ($o){
			 var email=$.trim($o.val());
			if (email == '') {
				layer.msg('请填写邮箱');
				$o.focus();
				return false;
			}
			
			if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email) == false) {
					layer.msg('邮箱格式错误');
					$o.select();
					return false;
				} else {
					users._ajax('/emailexit',{
						email : email
					}, function(rs) {
						if (rs.status == 'success') {
							layer.msg(rs.msg,{icon: 1,time: 2000}, function() {
								window.location.reload();
							});
						} else {
							layer.msg(rs.msg,{icon: 1,time: 2000});
						}
					}, 'json');
					return true;
				}
	    	
	     },
		 _ajax:function (page,parameters,callback,method){
			parameters.rand=Math.round(Math.random()*100000);
			return jQuery.get(page,parameters,callback,method);
		},
		 _register: function (){
		 		$('.submit').attr('disabled', true);
				$('.t').removeClass('err').removeClass('focus');
				$.post("/register", $("#registerForm").serializeArray(), function(rs) {
					$('.submit').removeAttr('disabled');
					if (rs.status == "200") {
						layer.msg(rs.info,{icon: 1,time: 2000}, function() {
							window.top.location.href = "/";
						});   
						
					} else{
						//window.top.location.href = rs.href;
						layer.msg(rs.info,{icon: 1,time: 2000});
					}
				}, 'json')
				return false
		 },
		  _login: function (){
		 		$('.submit').attr('disabled', true);
				$('.t').removeClass('err').removeClass('focus');
				$.post("/login", $("#loginForm").serializeArray(), function(rs) {
					$('.submit').removeAttr('disabled');
					if (rs.status == "200") {
						layer.msg(rs.info,{icon: 1,time: 2000}, function() {
							window.top.location.href = "/";
						});   
						
					} else{
						//window.top.location.href = rs.href;
						layer.msg(rs.info,{icon: 1,time: 2000});
					}
				}, 'json')
				return false
		 },
		 _share: function(){
		 	   $.post("/shareform", $("#shareForm").serializeArray(), function(rs) {
					if (rs.status == "200") {
						window.location.reload();
					} else{
						//window.top.location.href = rs.href;
						layer.msg(rs.info);
					}
				}, 'json')
				return false
		 }
		 
	
}
//end user
$('#reg-email-bf').focus(
			function() {
			$("#reg-email-t").remove();
			$(this).after("<div class=\"t\" id=\"reg-email-t\">请填写邮箱</div>");
			//$(this).next().css("background-color","#ff0000");
		    // $(this).parent().find('.t').removeClass('err').removeClass('ok').addClass('focus').html('请填写邮箱');
			}).blur(
			function() {
				$this = $(this);
				$t = $this.parent().find('.t');
				if ($.trim($this.val()) == '') {
					$t.removeClass('focus').removeClass('ok').addClass('err')
							.html('请填写邮箱');
				} else {
					if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($(
							this).val()) == false) {
						$t.removeClass('focus').removeClass('ok').addClass(
								'err').html('邮箱格式错误');
					} else {
						$this.attr('disabled', true).next('.placeholder')
								.hide();
						$t.removeClass('focus').removeClass('ok').removeClass(
								'err').html('正在检测用户名……');
						$.ajax({
							type : 'get',
							url : "/register",
							data : 'm=user&c=check_email&email='
									+ $.trim($this.val()),
							success : function(html) {
								$this.removeAttr('disabled');
								if (html == 'success') {
									$t.removeClass('err').removeClass('focus')
											.addClass('ok').html('&nbsp;');
								} else {
									$t.removeClass('focus').removeClass('ok')
											.addClass('err').html(html);
								}
							}
						});
					}
				}
			});


			$(window).scroll(_scroll);
  			$(".back-top").click(function() {
                $(window).scrollTop(0)
            });
//end jquery

});

function _scroll() {
            var t = $(this), 
				e = t.scrollTop(),
				h = $(window).height();
			//document.documentElement.clientHeigh==$(window).height()

			if(e > 344){
				 $(".back-top").show()
			}else{
				$(".back-top").hide()
			}
};





