(function (jq) {
    var _unbindInit = function () { 
        jq('#btnUnbind').unbind('click').bind('click', function (e) {
            e.preventDefault();
            var bindEvent = function () {
                if (!jq('#unbindMsg').val()) {
                    mcAlert("请输入解绑原因~");
                    return false;
                }

                if (jq('#unbindMsg').val().length > 100) {
                    mcAlert("解绑原因最多可以输入30个字哦~ <br>请精简语句");
                    return false;
                }

                jq.ajax({
                    type: "post",
                    url: "/edu/api/user_unbind_handler",
                    dataType: "json",
                    data: {
                        "unbindMsg": jq('#unbindMsg').val()
                    },
                    timeout: 20000,
                    beforeSend: function (x) {
                        mLoading();
                    },
                    success: function (dataObj, textStatus) {
                       		   if (dataObj.status=="200") {
                                    mcAlert(dataObj.info);
                                    location.href = '/edu/student-check';
                                }
                                else {
                                    mError(dataObj.info);
                                }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        mError(status + textStatus + "；" + errorThrown);
                    }
                });
            }

            mConfirm('确定要解绑吗？', bindEvent);
        });
    };

    _unbindInit();
})(jQuery)
