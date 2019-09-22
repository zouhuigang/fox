// 运行代码
$.fn.runCode = function () {
	var getText = function(elems) {
		var ret = "", elem;

		for ( var i = 0; elems[i]; i++ ) {
			elem = elems[i];
			if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
				ret += elem.nodeValue;
			} else if ( elem.nodeType !== 8 ) {
				ret += getText( elem.childNodes );
			};
		};

		return ret;
	};
	
	var code = getText(this);
	new Function(code).call(window);
	
	return this;
};

$(function(){
	// 按钮触发代码运行
	$(document).bind('click', function(event){
		var target = event.target,
			$target = $(target);

		if ($target.hasClass('runCode')) {
			$('#' + target.name).runCode();
		};
	});
	
	// 跳转到头部
	var $footer = $('#footer');
	if ($footer[0]) $footer.bind('click', function () {
		window.scrollTo(0, 0);
		return false;
	}).css('cursor', 'pointer')[0].title = '回到页头';
});

var _tmpl = [
	'<table class="zebra" style="width:640px">\
	  <tbody>\
		<tr class="odd">\
		  <th style="width:12em"><a href="?demoSkin=default">default</a></th>\
		  <td>artDialog默认皮肤，简洁，纯CSS设计，无图片，采用css3渐进增强</td>\
		</tr>\
		<tr>\
		  <th><a href="?demoSkin=aero">aero</a></th>\
		  <td>artDialog 2+标志性的皮肤，windows7毛玻璃风格。提供PSD源文件 <a href="http://code.google.com/p/artdialog/downloads/detail?name=aero.psd&can=2&q=" target="_blank">下载</a></td>\
		</tr>\
		<tr class="odd">\
		  <th><a href="?demoSkin=chrome">chrome</a></th>\
		  <td>chrome浏览器(xp)风格</td>\
		</tr>\
		<tr>\
		  <th><a href="?demoSkin=gray">gray</a></th>\
		  <td>浅灰色风格</td>\
		</tr>\
		<tr class="odd">\
			<th><a href="?demoSkin=simple">simple</a></th>\
			<td>简单风格</td>\
		</tr>\
		<tr>\
		  <th><a href="?demoSkin=idialog">idialog</a></th>\
		  <td>苹果风格</td>\
		</tr>\
		<tr>\
		  <th><a href="?demoSkin=twitter">twitter</a></th>\
		  <td>twitter风格</td>\
		</tr>\
	  </tbody>\
	</table>'
].join('');

window._demoSkin = function () {
	art.dialog({
		id: 'demoSkin',
		icon: 'face-smile',
		fixed: true,
		padding: '8px',
		title: 'artDialog皮肤展示'
	})
	.content(_tmpl)
	.position('50%', 'goldenRatio');
};

$(function () {
	var $skin = $('#nav-skin');
	$skin[0] && $skin.bind('click', function () {
		_demoSkin();
		return false;
	});
});

// firebug
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://getfirebug.com/firebug-lite-beta.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// google-analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-19823759-2']);
_gaq.push(['_setDomainName', '.planeart.cn']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
