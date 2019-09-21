/**
 * 配送地址验证
 */ 
 function checkProvince(){
	 var province = $("#province_apartment").val();	
	 if(province == -1){
		 y_checkok = false;				 
		 alert('请选择省');
		 $("#province_apartment").focus();
		 return;
	 }
	 y_checkok = true;
 }
 
 function checkCity(){
	 var city = $("#city_apartment").val();
	 if(city == -1){
		 y_checkok = false;			 
		 alert('请选择市');
		 $("#city_apartment").focus();
		 return;
	 }
	 y_checkok = true;
 }
 
 function checkArea(){
	 var area = $("#area_apartment").val();
	 if(area == -1){
		 y_checkok = false;		
		 alert('请选择区域');
		 $("#area_apartment").focus();
		 return;
	 }
	 y_checkok = true;
 }
 
 function checkAddress(){
	var address = $("#address").val();
	if($.trim(address) == ''){
		y_checkok = false;		
		alert('请输入详细地址');
		$("#address").focus();
		return;
	}
	y_checkok = true;
 }
 
 function checkName(){
	 var name = $("#name").val();
	 if($.trim(name) == ''){
			y_checkok = false;
			alert('请输入真实姓名');
			$("#name").focus();		
			return;
	  }	
	 y_checkok = true;
 }
 
function checkZip(){
	 var zip = $("#zip").val();	
	 if($.trim(zip) == ''){
			y_checkok = false;
			alert('请输入邮编');
			$("#zip").focus();			
			return;
	 }	
	 
	if(!IsZip(zip)){
		y_checkok = false;
		alert('邮编格式不正确');
		$("#zip").focus();
		return;
	}
	
	y_checkok = true;
 }
 
 function checkEmail(){
	 var email = $("#email").val();
	 if($.trim(email) == ''){
			y_checkok = false;
			alert('请输入邮箱地址');		
			$("#email").focus();
			return;
	 }		 
	 if(!IsEmail(email)){
		 y_checkok = false;
		 alert('邮箱格式不正确');
		 $("#email").focus();
		 return;
		 
	 }
	 y_checkok = true;
 }
 
 function checkMobile(){
	
		 var mobile = $("#mobile").val();
		 if($.trim(mobile) == ''){
				y_checkok = false;
				//alert('请输入手机号');
				$("#mobile").focus();
				return false;
				
		 }	
		 if(!IsMobile(mobile)){
			 y_checkok = false;
			 alert('手机格式不正确');
			 $("#mobile").focus()			
			 return false; 
		 }	
	   y_checkok = true;	
	 
 }
 
 function checkTel(){ 
	 var tel = $("#tel").val();
	 if($.trim(tel) == ''){
			y_checkok = false;		
			//alert('请输入电话');
		    $("#tel").focus();		   
			return false;
	 }	
	 if(!IsTel(tel)){
		 y_checkok = false;
		 alert('电话格式不正确');
		 $("#tel").focus();
		 return false; 
	 } 
	 y_checkok = true;
 }