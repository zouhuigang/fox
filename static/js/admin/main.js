/*
 *
 * 后台公用函数
 */
function CheckAll(form, type) {
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        if (e.type == "checkbox") {
            if (typeof (type) != 'undefined') {
                e.checked == true ? e.checked = false : e.checked = true;
            } else {
                e.checked = true;
            }
        }
    }
}
//删除确认
function delconfirm(txt) {
    var msg = txt ? txt : "确实要删除此记录吗？";
    return confirm(msg);
}
//隐藏子菜单
function cateopen(id) {
    try {
        var o = $('#cate_' + id);
        if (o == null)
            return;
        if (o.css('display') == 'none') {
            o.css('display', '');
            $('#bt_' + id).attr('class', 'expand expand_a');
        } else {
            o.css('display', 'none');
            $('#bt_' + id).attr('class', 'expand expand_b');
        }
    } catch (e) {
    }
}
function suggestKey(field, len)
{
    var key = 'abcdefhijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWYXZ~!@$^*()+-,.;[]{}|/';
    var i = 0;
    var suggestKey = '';
    if (!len)
        len = 16;
    while (i++ < len)
    {
        suggestKey += key.charAt(Math.random() * key.length);
    }
    $("#" + field).val(suggestKey);
}
/**
 * 含文字的模块
 */
function radioWithWords(self)
{
    var ele = self.getElementsByTagName('input')[0];
    var nm = ele.name;
    ele.click();
//ele.checked=true;
//取消其它单选框的选择
    var otherInputs = document.getElementsByName(nm);
    var l = otherInputs.length;
    for (var i = 0; i < l; i++)
        if (otherInputs[i].parentNode.className == 'current')
            otherInputs[i].parentNode.className = '';
    self.className = 'current';
}
//弹出窗口
function openDialog(url, width, height)
{
    var w = 1024;
    var h = 768;
    if (document.all || document.layers)
    {
        w = screen.availWidth;
        h = screen.availHeight;
    }
    var leftPos = (w / 2 - width / 2);
    var topPos = (h / 2.3 - height / 2.3);
    window.open(url, '', "width=" + width + ",height=" + height + ",top=" + topPos + ",left=" + leftPos + ",scrollbars=no,resizable=no,status=no");
}
function setTab(tab, container, cursel, n) {
    for (i = 1; i <= n; i++) {
        var menu = $("#" + tab + "_" + i);
        var con = $("#" + container + "_" + i);
        var className = i == cursel ? "current" : "";
        menu.attr('class', className);
        var display = i == cursel ? "block" : "none";
        con.css('display', display);
    }
}

//区域城市
var zone = {
    //上传二级区域
    getAreaSelect: function (subs, obj) {
        $.ajax({
            type: 'get',
            url: '/ajax/area.html&subs=' + subs,
            data: '',
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok) {
                    $("#" + obj).html(o.data);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    //读取场馆分类
    getVenueCateSelect: function (subs, obj) {
        $.ajax({
            type: 'get',
            url: '/ajax/venuecate.html&subs=' + subs,
            data: '',
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok) {
                    $("#" + obj).html(o.data);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    //读取商圈
    getBusdistrict: function (city, area, obj) {
        $.ajax({
            type: 'get',
            url: '/ajax/busdistrict.html&city=' + city + '&area=' + area,
            data: '',
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok) {
                    $("#" + obj).html(o.data);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    }

}

var _admin = {
    //设置场馆标题图
    defaultvenuepic: function (path, vid) {
        art.dialog.confirm('<span style="font-size:12px;color:red;">您确认此操作吗？</span>', function () {
            $.ajax({
                type: 'get',
                url: '/ajax/venue.html&act=defaultvenuepic&path=' + path + '&vid=' + vid,
                data: '',
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok) {
                        art.dialog.tips("<b style='font-size:12px;color:Green;z-index:10;'>恭喜您操作成功！</b>");
                        setTimeout("window.parent.default.location.reload()", 1000);
                        return false;
                    } else {
                        art.dialog.tips("<b style='font-size:12px;color:red;z-index:10;'>对不起，您要操作的记录不存在！</b>");
                        setTimeout("window.parent.default.location.reload()", 1000);
                        return false;
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    //删除场馆图片
    delvenuepic: function (path, vid) {
        art.dialog.confirm('<span style="font-size:12px;color:red;">您确认删除此照片吗？</span>', function () {
            $.ajax({
                type: 'get',
                url: '/ajax/venue.html&act=delvenuepic&path=' + path + '&vid=' + vid,
                data: '',
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok) {
                        art.dialog.tips("<b style='font-size:12px;color:Green;z-index:10;'>恭喜您操作成功！</b>");
                        setTimeout("window.parent.default.location.reload()", 1000);
                        return false;
                    } else {
                        art.dialog.tips("<b style='font-size:12px;color:red;z-index:10;'>对不起，您要操作的记录不存在！</b>");
                        setTimeout("window.parent.default.location.reload()", 1000);
                        return false;
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    }

}

function exprot(v){
    $('#exportid').val(v) ;
    $('#exportForm').submit()
}