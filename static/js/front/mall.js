var _mall = {
    //加入购物车操作
    addCart: function () {
        var goods_id = $("#goods_id").val();
        var product_id = $("#products_id").val();
        var nums = $("#goods_num").val();
        $.ajax({
            url: "/ajax/goodsFront/",
            data: {ajaxdata: "addCart", gid: goods_id, pid: product_id, nums: nums, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>成功加入购物车……</span>");
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
    //加入购物车
    addCartList: function (val) {
        var tmp = $(val).prop('rel');
        var nums = parseInt($("#" + tmp).html());
        tmp = tmp.split('_');
        var goods_id = tmp[0];
        var product_id = tmp[1];
        $.ajax({
            url: "/ajax/goodsFront/",
            data: {ajaxdata: "addCart", gid: goods_id, pid: product_id, nums: nums, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $(val).parent().hide().siblings().show().parents('.clearfix').addClass('cur');
                    _mall.getCartGoods();
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
            url: "/ajax/goodsFront/",
            data: {ajaxdata: "delCart", pk: product_id, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    $(val).parent().hide().siblings().show().parents('.clearfix').removeClass('cur');
                    _mall.getCartGoods();
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
    addMemo: function (key) {
        var memo = $("#" + key).val();
        $.ajax({
            url: "/ajax/goodsFront/",
            data: {ajaxdata: "addMemo", key: key, memo: memo, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    _mall.getCart();
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
    getCart: function () {
        $.ajax({
            url: "/ajax/goodsFront/",
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
    addTpl: function () {
        var name = $("#name_tpl").val();
        if (!name) {
            alertMsg('请设置模版名称，方便记忆！');
            return false;
        }
        $.ajax({
            url: "/ajax/goodsFront/",
            data: {ajaxdata: "addTpl", name: name, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
                art.dialog.list['addTemp_box'].close();
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    },
    //删除购物车中的商品
    deleteCarts: function (arrkey) {
        if (arrkey) {
            art.dialog.confirm('确定要删除选中的商品吗！', function () {
                $.ajax({
                    url: "/ajax/goodsFront/",
                    data: {ajaxdata: "delCart", pk: arrkey, ajax: Math.random()},
                    timeout: 90000,
                    beforeSend: function () {
                    },
                    dataType: 'json',
                    success: function (o) {
                        if (o.isok == true) {
                            _mall.getCart();
                        } else {
                            alertMsg("操作失败！");
                            setTimeout("window.location.reload()", 1000);
                        }
                    },
                    complete: function () {
                    },
                    error: function () {
                    }
                });
            });
        } else {
            alertMsg("请选择您要删除的商品！");
            return false;
        }
    },
    //删除购物车中的商品
    clearCarts: function () {
        art.dialog.confirm('确定要清空购物车里所有的商品吗！', function () {
            $.ajax({
                url: "/ajax/goodsFront/",
                data: {ajaxdata: "clearCarts", ajax: Math.random()},
                timeout: 90000,
                beforeSend: function () {
                },
                dataType: 'json',
                success: function (o) {
                    if (o.isok == true) {
                        _mall.getCart();
                    } else {
                        alertMsg("操作失败！");
                        setTimeout("window.location.reload()", 1000);
                    }
                },
                complete: function () {
                },
                error: function () {
                }
            });
        });
    },
    //更改购物车中产品的购买数量
    eidtCartGoodsNum: function (key, num) {
        $.ajax({
            url: "/ajax/goodsFront/",
            data: {ajaxdata: "changeCartGoodsNum", key: key, num: num, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    _mall.getCart();
                } else {
                    alertMsg(o.data);
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
            url: "/ajax/goodsFront/",
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
    //购买数量
    checkBuyCount: function (type) {
        var number = parseInt($("#goods_num").val());
        var store = $("#product_store").val();
        if (type == 1) {
            number = number + 1;
        } else {
            number = number - 1;
        }
        if (number >= 1 && number <= store) {
            $("#goods_num").val(number);
        } else if (number < 1) {
            alertMsg("<span style='color:red;'>购买数量必须大于 0！</span>");
            $("#goods_num").val(1);
        } else if (number > store) {
            alertMsg("<span style='color:red;'>对不起，库存不足，无法购买！</span>");
            if (store >= 1) {
                $("#goods_num").val(store);
            } else {
                $("#goods_num").val(1);
            }
        }
        return false;
    },
    //收藏商品
    addFav: function (n) {
        $.ajax({
            url: "/ajax/goodsFront/",
            data: {ajaxdata: "addFav", gid: n, ajax: Math.random()},
            timeout: 90000,
            beforeSend: function () {
            },
            dataType: 'json',
            success: function (o) {
                if (o.isok == true) {
                    alertMsg("<span style='color:green;'>" + o.data + "</span>");
                } else {
                    alertMsg("<span style='color:red;'>" + o.data + "</span>");
                }
            },
            complete: function () {
            },
            error: function () {
            }
        });
    }

};