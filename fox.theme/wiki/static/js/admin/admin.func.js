// JavaScript Document

//登录验证
function admin_login() {
    if ($('#username').val() == '') {
        alert("请输入用户名!");
        return false;
    }
    if ($('#password').val() == '') {
        alert("请输入密码!");
        return false;
    }
    if ($('#checkcode').val() == '') {
        alert("请输入正确的验证码!");
        return false;
    }
}

//后台管理菜单验证
function chkMenu() {
    var name = $("#name").val();
    var mkey = $("#mkey").val();
    if (name == "") {
        alert("请填写菜单名称！");
        return false;
    }
    if (mkey == "") {
        alert("请填写文件名称！");
        return false;
    }
}

//管理员编辑添加验证
function checkAdmin(type) {
    var username = $("#username").val();
    var pwd = $("#pwd").val();
    var pwd2 = $("#pwd2").val();
    if (username == "") {
        alert("请输入管理员用户名！");
        return false;
    }
    if (!type) {
        if (pwd == "") {
            alert("请输入登录密码！");
            return false;
        }
        if (pwd != pwd2) {
            alert("对不起，您两次输入的密码不一致，请重新输入！");
            return false;
        }
    } else {
        if (pwd && pwd != pwd2) {
            alert("对不起，您两次输入的密码不一致，请重新输入！");
            return false;
        }
    }
}

//后台添加编辑用户验证
function chkUser(type) {
    //验证用户名
    var mails = /^[0-9a-zA-Z_\-\.]+@[0-9a-zA-Z_\-]+(\.[0-9a-zA-Z_\-]+)*$/;
    var mailExp = new RegExp(mails);
    var mobileExp = new RegExp("^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$");

    var cid = $("#cid").val();
    var username = $("#username").val();
    var usernamedo = $("#usernamedo").val();
    var emaildo = $("#emaildo").val();
    var password = $("#password").val();
    var repass = $("#repass").val();
    var realname = $("#realname").val();
    var mobile = $("#mobile").val();
    var email = $("#email").val();

    if (username == "") {
        alert("请填写用户名！");
        $("#username").focus();
        return false;
    }
    if (usernamedo == 1) {
        alert("对不起，您填写的用户名已存在，请重新输入！");
        $("#username").focus();
        return false;
    }
    if (!type) {
        if (password == "") {
            alert("请输入登录密码！");
            $("#password").focus();
            return false;
        }
        if (repass && password != repass) {
            alert("对不起，您两次输入的密码不一致，请重新输入！");
            $("#repass").focus();
            return false;
        }
    }
    if (realname == "") {
        alert("请输入真实姓名！");
        $("#realname").focus();
        return false;
    }
    if (mobile == "" || !mobileExp.test(mobile)) {
        alert("请输入的正确的手机号码！");
        $("#mobile").focus();
        return false;
    }
    if (mobiledo == 1) {
        alert("对不起，您填写的手机号码已存在，请重新输入！");
        $("#mobile").focus();
        return false;
    }
    if (email == "" || !mailExp.test(email)) {
        alert("请输入的正确的邮件地址！");
        $("#email").focus();
        return false;
    }
    if (emaildo == 1) {
        alert("对不起，您填写的邮件地址已存在，请重新输入！");
        $("#email").focus();
        return false;
    }
}

function getCid(o) {
    var cid = $(o).attr("id");
    var company = $(o).html();
    $("#companyListBoxs").html('').hide();
    $("#company").val(company)
    $("#cid").val(cid);
}