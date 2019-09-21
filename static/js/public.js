//提示窗口
function alertMsg(msg, time, id, width) {
    art.dialog({
        id: id,
        content: msg,
        lock: true,
        fixed: true,
        width: width ? width : 250,
        time: (time ? time : 1.5)
    });
}

//进行中窗口
function showMsg(msg, id, width) {
    art.dialog({
        id: id,
        content: msg,
        lock: true,
        fixed: true,
        drag: false,
        cancel: false,
        noFn: false,
        esc: false,
        width: width ? width : 250,
        background: '#000',
        opacity: 0.5
    });
}
function DrawImage(ImgD, iwidth, iheight) {
    //alert(iwidth);
    //参数(图片,允许的宽度,允许的高度)
    var image = new Image();
    image.src = ImgD.src;
    if (image.width > 0 && image.height > 0) {
        if (image.width / image.height >= iwidth / iheight) {
            if (image.width > iwidth) {
                ImgD.width = iwidth;
                ImgD.height = (image.height * iwidth) / image.width;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
            //ImgD.alt=image.width+"×"+image.height;
        } else {
            if (image.height > iheight) {
                ImgD.height = iheight;
                ImgD.width = (image.width * iheight) / image.height;
            } else {
                ImgD.width = image.width;
                ImgD.height = image.height;
            }
            //ImgD.alt=image.width+"×"+image.height;
        }
    }
}

/** 加入收藏
 *  Surl    链接接地址
 *  Stitle  说明
 */
function AddFavorite(Surl, Stitle) {
    try {
        window.external.addFavorite(Surl, Stitle);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(Stitle, Surl, "");
        }
        catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}

//区域联动选项
function areasSelect(parentId, _target, cid, _g) {
    $.ajax({
        url: "/ajax/orderFront/",
        data: {ajaxdata: "area", parentId: parentId, ajax: Math.random()},
        async: false,
        timeout: 90000,
        beforeSend: function () {
            if (_g) {
                $("#" + _g).html("<option value=''>请选择</option>");
            }
        },
        dataType: 'json',
        success: function (o) {
            if (o) {
                setOption(o, _target, cid)
            } else {
                $("#" + _target).html("<option value=''>请选择</option>");
            }
        },
        complete: function () {
        },
        error: function () {
            $("#" + _target).html("<option value=''>请选择</option>");
        }
    });
}

//select option
function setOption(Datas, _target, cid) {

    var buildHtml = arr = '';
    buildHtml += "<option value=''>请选择</option>";
    for (var i = 0; i < Datas.length; i++) {
        arr = Datas[i]['areaid'] == cid ? "selected" : "";
        buildHtml += '<option value="' + Datas[i]['areaid'] + '" ' + arr + '>' + Datas[i]['name'] + '</option>';
    }

    $("#" + _target).html(buildHtml);

}
/*分类联动*/
//区域联动选项,得到当前父母id
function cateSelect(parentId, _target, cid, _g) {
    $.ajax({
        url: "/welcome/parentcate/",
        data: {ajaxdata: "cls", parentId: parentId, ajax: Math.random()},
        async: false,
        timeout: 90000,
        beforeSend: function () {
            if (_g) {
                $("#" + _g).html("<option value=''>请选择</option>");
            }
        },
        dataType: 'json',
        success: function (o) {
            if (o) {
                setcatecOption(o, _target, cid)
            } else {
                $("#" + _target).html("<option value=''>请选择</option>");
            }
        },
        complete: function () {
        },
        error: function () {
            $("#" + _target).html("<option value=''>请选择</option>");
        }
    });
}

//select option
function setcatecOption(Datas, _target, cid) {

    var buildHtml = arr = '';
    buildHtml += "<option value=''>请选择</option>";
    for (var i = 0; i < Datas.length; i++) {
        arr = Datas[i]['id'] == cid ? "selected" : "";
        buildHtml += '<option value="' + Datas[i]['id'] + '" ' + arr + '>' + Datas[i]['name'] + '</option>';
    }

    $("#" + _target).html(buildHtml);

}
//文件分类
/*分类联动*/
//区域联动选项,得到当前父母id
function filecateSelect(parentId, _target, cid, _g) {
    $.ajax({
        url: "/everybody_watching/parentcate/",
        data: {ajaxdata: "cls", parentId: parentId, ajax: Math.random()},
        async: false,
        timeout: 90000,
        beforeSend: function () {
            if (_g) {
                $("#" + _g).html("<option value=''>请选择</option>");
            }
        },
        dataType: 'json',
        success: function (o) {
            if (o) {
                filesetcatecOption(o, _target, cid)
            } else {
                $("#" + _target).html("<option value=''>请选择</option>");
            }
        },
        complete: function () {
        },
        error: function () {
            $("#" + _target).html("<option value=''>请选择</option>");
        }
    });
}

//select option
function filesetcatecOption(Datas, _target, cid) {

    var buildHtml = arr = '';
    buildHtml += "<option value=''>请选择</option>";
    for (var i = 0; i < Datas.length; i++) {
        arr = Datas[i]['id'] == cid ? "selected" : "";
        buildHtml += '<option value="' + Datas[i]['id'] + '" ' + arr + '>' + Datas[i]['name'] + '</option>';
    }

    $("#" + _target).html(buildHtml);

}
// check used
function getObj(id) {
    return document.getElementById(id);
}
// 检查 email 格式
function IsEmail(strg) {
    var patrn = new RegExp(
            '^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$');
    if (!patrn.test(strg))
        return false;
    return true;
}
// 验证电话
function IsTel(strg) {
    var patrn = new RegExp(
            '^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$');
    if (!patrn.test(strg))
        return false;
    return true;
}
// 验证手机
function IsMobile(strg) {
    var patrn = new RegExp('^(13|15|18)[0-9]{9}$');
    if (!patrn.test(strg))
        return false;
    return true;
}
// 验证邮编
function IsZip(strg) {
    var patrn = new RegExp('^\\d{6}$');
    if (!patrn.test(strg))
        return false;
    return true;
}
// 是否是用户名
function IsUserName(strg) {
    var patrn = new RegExp('^\\w+$');
    if (!patrn.test(strg))
        return false;
    return true;
}

// 注册
function getRegister() {

    getUser();
    var isusername = $('#isusername').val();
    if (isusername == 0) {
        return false;
    } else {
        $('#pwddiv').html('');
    }
    //alert(isusername);

    var password = $('#password').val();
    var pwd = $('#pwd').val();
    if (!password || !pwd) {
        $('#pwddiv').html('密码与确认密码不能为空！');
        return false;
    }
    if (password != pwd) {
        $('#pwddiv').html('二次输入的密码不一不致！');
        return false;
    }

    getCode();
    var iscode = $('#iscode').val();
    if (iscode == 0) {
        return false;
    } else {
        $('#pwddiv').html('');
    }

}

//找回密码
function getForgot() {

    var username = $.trim($('#username').val());
    if (!username) {
        $('#pwddiv').html('用户名不能为空！');
        return false;
    }
    var email = $.trim($('#email').val());
    if (!email) {
        $('#pwddiv').html('邮箱不能为空！');
        return false;
    }

    if (!IsEmail(email)) {
        $('#pwddiv').html('请输入正确的邮箱！');
        return false;
    }
}

//登陆
function getLogin() {

    var username = $.trim($('#username').val());
    if (!username) {
        $('#pwddiv').html('用户名不能为空！');
        return false;
    }
    var password = $.trim($('#password').val());
    if (!password) {
        $('#pwddiv').html('密码不能为空！');
        return false;
    }

}

//验证用户
function getUser() {

    var username = $.trim($('#username').val());
    if (username.length < 2 || username.length > 20) {
        $('#pwddiv').html('用户名不能小于2位或大于20位字符串');
        return false;
    } else {
        $.ajax({
            type: 'get',
            async: false,
            url: '/ajax/ajax/',
            data: {ajaxdata: "check_user", 'username': username, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o == 0) {
                    $('#pwddiv').html('该账号已经被注册');
                    $('#isusername').val(0);
                } else {
                    $('#pwddiv').html('');
                    $('#isusername').val(1);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });

    }

}

//验证用户
function getCode() {

    var code = $.trim($('#code').val());
    if (code.length < 0) {
        $('#pwddiv').html('用户名不能小于2位或大于20位字符串');
        return false;
    } else {

        $.ajax({
            type: 'get',
            async: false,
            url: '/ajax/ajax/',
            data: {ajaxdata: "check_code", 'code': code, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (!o) {
                    $('#pwddiv').html('请输入正确的验证码');
                    $('#iscode').val(0);
                } else {
                    $('#pwddiv').html('');
                    $('#iscode').val(1);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });

    }

}

//用户登陆
function userLogin() {

    var username = $('#username').val();
    var password = $('#password').val();

    if (!password || !username) {
        alert('用户名与不能为空');
        return false;
    }

    /*	if(!IsUserName(username)){
     alert('请输入正确的用户名');
     return false;
     }
     */
}

//倒计时函数
function GroupsEndTime() {
    var date = new Date();
    var time = date.getTime() / 1000;

    $(".timeleft_label").each(function (i) {
        var endTime = this.getAttribute("end"); //结束时间秒数
        var lag = (endTime - time) //当前时间和结束时间之间的秒数.attr("style","width:auto;float:right;")
        if (lag > 0) {
            var second = Math.floor(lag % 60);
            var minite = Math.floor((lag / 60) % 60);
            var hour = Math.floor((lag / 3600) % 24);
            var day = Math.floor((lag / 3600) / 24);
            $(this).html("距离结束时间：<span class=\"day\">" + day + "</span>天<span class=\"hour\">" + hour + "</span>小时<span class=\"minute\">" + minite + "</span>分<span class=\"second\">" + second + "</span>秒");
        } else {

            $(this).html("已经结束啦！").removeClass("timeleft_label");
            $(this).removeClass("timeleft_label");
        }
    });
    setTimeout("GroupsEndTime()", 1000);
}

function procomtent(uid) {

    if (!uid) {
        alert('请先登陆！');
        return false;
    }

    var email = $('#email').val();
    if (email == '' || !IsEmail(email)) {
        alert('请输入正确的Email');
        $('#email').focus();
        return false;
    }

    var content = $('#content').val();
    if (content == '') {
        alert('请输入留言内容');
        //$('#content').focus();
        return false;
    }

}

function membercollection(pid, mid, list) {
    if (mid) {
        $.ajax({
            type: 'get',
            url: "/ajax/member/",
            data: {ajaxdata: "collection", pid: pid, list: list},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o == '1') {
                    alert('找不到产品');
                } else if (o == '2') {
                    alert('请先登陆');
                } else if (o == '3') {
                    alert('恭喜您，收藏成功！');
                } else if (o == '4') {
                    alert('该产品您已收藏！');
                } else {
                    alert("添加失败");
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    } else {
        alert('请先登陆');
    }
}

function updateEndTime() {
    var date = new Date();
    var time = date.getTime() / 1000;
    $(".timeleft_label").each(function (i) {
        var endTime = this.getAttribute("end"); //结束时间秒数
        var start = this.getAttribute("start");
        var id = this.getAttribute("rel");
        var lag = (start - time) //当前时间和结束时间之间的秒数
        if (lag > 0) {
            var second = Math.floor(lag % 60);
            var minite = Math.floor((lag / 60) % 60);
            var hour = Math.floor((lag / 3600) % 24);
            var day = Math.floor((lag / 3600) / 24);
            $(this).find('.killtime').html("<span>" + hour + "</span>小时<span class=\"minute\">" + minite + "</span>分<span class=\"second\">" + second + "</span>秒");
            $(this).find('.killlinks').html('<img src="<?php echo WEBIMG;?>k_04.jpg" width="173" height="68" />');
        } else {
            if (time > endTime) {
                $(this).find('.killtime').html("已结束");
                $(this).find('.killlinks').html('已结束');
                $(this).removeClass("timeleft_label");
            } else {
                $(this).find('.killtime').html("已开始");
                $(this).find('.killlinks').html('<a href="/killorders?id=' + id + '"><img src="<?php echo WEBIMG;?>k_04.jpg" width="173" height="68"  onclick="this.blur();"/></a>');
            }
        }
    });
    setTimeout("updateEndTime()", 1000);
}

function getUserGoodsCate(htmlid, pid, gid) {
    if (htmlid && pid) {
        $.ajax({
            type: 'get',
            url: "/ajax/member/",
            data: {ajaxdata: "getUserGoodsCate", pid: pid, gid: gid},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o) {
                    $('#' + htmlid).html(o);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    }
}
//传输类型
function conGetCate(id, str, htmlid) {

    if (id) {
        $.ajax({
            type: 'get',
            url: "/ajax/member/",
            data: {ajaxdata: "conGetCate", id: id, str: str, htmlid: htmlid},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o) {
                    $('#' + htmlid).html(o).show();
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    }

}

//邀请好友
function copyToClipBoard(txt) {
    if (window.clipboardData) {
        window.clipboardData.clearData();
        window.clipboardData.setData("Text", txt);
    } else if (navigator.userAgent.indexOf("Opera") != -1) {
        //do nothing      
    } else if (window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
        }
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip)
            return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans)
            return;
        trans.addDataFlavor('text/unicode');
        var str = new Object();
        var len = new Object();
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        var copytext = txt;
        str.data = copytext;
        trans.setTransferData("text/unicode", str, copytext.length * 2);
        var clipid = Components.interfaces.nsIClipboard;
        if (!clip)
            return false;
        clip.setData(trans, null, clipid.kGlobalClipboard);
    }
}

//字符替换
function tpl_replace(str, obj) {
    if (!(Object.prototype.toString.call(str) === '[object String]')) {
        return '';
    }

    // {}, new Object(), new Class()
    // Object.prototype.toString.call(node=document.getElementById("xx")) : ie678 == '[object Object]', other =='[object HTMLElement]'
    // 'isPrototypeOf' in node : ie678 === false , other === true
    if (!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
        return str;
    }

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
    return str.replace(/\{([^{}]+)\}/g, function (match, key) {
        var value = obj[key];
        return (value !== undefined) ? '' + value : '';
    });
}

function checkChangePwd() {
    var oldpwd = $("input[name='edt_oldpwd']").val();
    var newpwd = $("input[name='edt_newpwd']").val();
    var copypwd = $("input[name='edt_copypwd']").val();

    if (!oldpwd) {
        alert('请输入原始密码！');
        return false;
    }
    if (!newpwd) {
        alert('请输入新的密码！');
        return false;
    }
    if (!copypwd) {
        alert('请再一次输入新密码！');
        return false
    }
    if (newpwd != copypwd) {
        alert('重置的两次密码不一致！');
        return false;
    }
}

function getEditClerkFrom() {

    getEmail();
    var iemail = $('#iemail').val();
    if (iemail == 0) {
        return false;
    } else {
        $('#pwddiv').html('');
    }

    getMobile();
    var iemobile = $('#iemobile').val();
    if (iemobile == 0) {
        return false;
    } else {
        $('#pwddiv').html('');
    }

    var pwd = $('#pwd').val();
    if (pwd) {
        var pwd2 = $('#pwd2').val();
        if (pwd != pwd2) {
            alert('密码与确认密码不能为空');
            return false;
        }
    }
}

function getAddClerkFrom() {

    getUser();
    var isusername = $('#isusername').val();
    if (isusername == 0) {
        return false;
    } else {
        $('#pwddiv').html('');
    }

    getEmail();
    var iemail = $('#iemail').val();
    if (iemail == 0) {
        return false;
    } else {
        $('#pwddiv').html('');
    }

    getMobile();
    var iemobile = $('#iemobile').val();
    if (iemobile == 0) {
        return false;
    } else {
        $('#pwddiv').html('');
    }

    var pwd = $('#pwd').val();
    var pwd2 = $('#pwd2').val();
    if (pwd != pwd2) {
        alert('密码与确认密码不能为空');
        return false;
    }

}

//验证Email
function getEmail() {

    var email = $('#email').val();
    if (email) {
        if (!IsMobile(email)) {
            $('#pwddiv').html('请输入正确的Email格式，也可以不填');
            $('#iemail').val(0);
            return false;
        }
        $.ajax({
            type: 'get',
            async: false,
            url: '/ajax/ajax/',
            data: {ajaxdata: "check_email", 'useremail': email, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o == 0) {
                    $('#pwddiv').html('该账号已经被注册');
                    $('#iemail').val(0);
                } else {
                    $('#pwddiv').html('');
                    $('#iemail').val(1);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    }
}

//验证Mobile
function getMobile() {
    var mobile = $('#mobile').val();
    if (mobile) {
        if (!IsMobile(mobile)) {
            $('#pwddiv').html('请输入正确的手机格式，也可以不填');
            $('#iemobile').val(0);
            return false;
        }
        $.ajax({
            type: 'get',
            async: false,
            url: '/ajax/ajax/',
            data: {ajaxdata: "check_mobile", 'useremail': email, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o == 0) {
                    $('#pwddiv').html('该手机号已经被注册');
                    $('#iemobile').val(0);
                } else {
                    $('#pwddiv').html('');
                    $('#iemobile').val(1);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    }
}



