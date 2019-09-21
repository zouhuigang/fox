var _fastorder = {
    //加入购物车
    addCartList: function (val) {
        var tmp = $(val).prop('rel');
        var nums = parseInt($("#" + tmp).html());
        tmp = tmp.split('_');
        var goods_id = tmp[0];
        var product_id = tmp[1];
        $.ajax({
            url: "/ajax/fastFront/",
            data: {ajaxdata: "addCart", gid: goods_id, pid: product_id, nums: nums, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $(val).parent().hide().siblings().show().parents('.clearfix').addClass('cur');
                    _fastorder.getCartGoods();
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
    delCartList: function (val) {
        var tmp = $(val).prop('rel');
        var nums = parseInt($("#" + tmp).html());
        tmp = tmp.split('_');
        var goods_id = tmp[0];
        var product_id = tmp[1];
        $.ajax({
            url: "/ajax/fastFront/",
            data: {ajaxdata: "delCart", pk: product_id, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $(val).parent().hide().siblings().show().parents('.clearfix').removeClass('cur');
                    _fastorder.getCartGoods();
                } else {
                    alertMsg("操作失败！");
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    getCart: function () {
        $.ajax({
            url: "/ajax/fastFront/",
            data: {ajaxdata: "getCart", ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $("#shopping_cart").html(o.htmlcode);
                } else {
                    alertMsg("<span style='color:red;'>操作失败……！</span>");
                    setTimeout("window.location.reload()", 1000);
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    //获取购物车
    getCartGoods: function () {
        $.ajax({
            url: "/ajax/fastFront/",
            data: {ajaxdata: "getCartGoods", ajax: Math.random()},
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
    sendOrder: function () {

        var paymenttype = parseInt($("#paymenttype").val());
        var payment = $("input[name='payment']:checked").val();
        var addr_id = $("#addr_id").val();

        if (paymenttype == 2) {
            if (!payment) {
                alertMsg("<span style='color:red;'>请选择支付方式</span>");
                return false;
            }
        }
        if (!addr_id) {
            alertMsg("<span style='color:red;'>请选择收货人信息</span>");
            return false;
        }
        var options = {
            beforeSend: function () {
                showMsg('正在为您提交订单信息……', 'order');
            },
            dataType: 'json',
            success: function (o) {
                art.dialog.list['order'].close();
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                    setTimeout("window.location.href='/fastorder/success/orderid/" + o.orderId + "/'", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
            }
        };
        $('#orderForm').ajaxSubmit(options);
        return false;
    }

};