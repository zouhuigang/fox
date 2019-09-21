var _order = {
    getAddress: function (n) {
        $.ajax({
            url: "/ajax/orderFront/",
            data: {ajaxdata: "getAddress", id: n, ajax: Math.random()},
            async: false,
            beforeSend: function () {
                showMsg("正在为您加载收获地址……！", 'loadaddr');
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $("#order_address").html(o.htmlcode);
                } else {
                    alertMsg(o.data);
                }
            },
            complete: function () {
                art.dialog.list['loadaddr'].close();
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
                    setTimeout("window.location.href='/order/success/orderid/" + o.orderId + "/'", 500);
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
            }
        };
        $('#orderForm').ajaxSubmit(options);
        return false;
    }

};