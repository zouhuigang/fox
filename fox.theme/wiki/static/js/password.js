$(function () {
	
	$('form[name=register]').validate({
	errorElement : 'span',
	success : function (label) {
		label.addClass('success');
	},
	rules : {
		passwordold : {
			required : true,
			user : true,
			remote : {
				url : user/password,
				type : 'post',
				dataType : 'json',
				data : {
					passwordold : function () {
						return $('#passwordold').val();
					}
				}
			}
		}
	}
	
  });
});