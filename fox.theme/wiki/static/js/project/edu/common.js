function loginout() {
   // alert('sdf');
    $.ajax({
        type: "post",
        url: "../function/loginout.ashx",
        success: (function (data) {
            var items = data.split("-");
            if (items[0] == "succ") {
                window.location.href = items[1];
            } else {
                alert("退出出错！");
            }
        })
    });
}


(function ($) {
    /**
    * 扩展String方法
    */
    $.extend(String.prototype, {
        /**
        * 类似c#的format格式化输出
        * 例如:
        * var template1="我是{0}，今年{1}了"; 
        * var result1=template1.format("loogn",22); 
        * var template2="我是{name}，今年{age}了"; 
        * var result2=template1.format({name:"loogn",age:22}); 
        * 两个结果都是"我是loogn，今年22了"
        */
        format: function (args) {

            if (arguments.length > 0) {
                var result = this;
                var reg = null;

                //result = result.replace(/(?![^>]*(?=<))(?=data-latex)\b[^\s]+=["']?[^"']*["']?(?=\s|>)/gi, '');

                if (arguments.length == 1 && typeof (args) == "object") {
                    for (var key in args) {

                        //reg = new RegExp("({" + key + "})", "g");//20141106
                        reg = new RegExp("\{(" + key + ")\}", "g");
                        result = result.replace(reg, args[key]);
                    }
                } else {
                    for (var i = 0; i < arguments.length; i++) {

                        //if (typeof arguments[i] != 'undefined' && arguments[i] != null) {

                        if (arguments[i]) {
                            //replace(/data-latex="[\s\S]*"/gi, '');
                            arguments[i] = arguments[i].toString().replace(/\{(\d+)\}/gi, '');
                        }

                        reg = new RegExp("\{(" + i + ")\}", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
                return result;
            } else {
                return this;
            }
        }
    });

})(jQuery);



//上一周下一周日期显示
//初始化日期加载
var currDT;
var lastDay; //页面显示的最后一天
var firstDay; //页面显示的第一天

//初始化日期加载
function initDate() {
    currDT = new Date();
    var dw = currDT.getDay(); //从Date对象返回一周中的某一天(0~6)
    var tdDT; //日期  
    tdDT = getDays()[0];
    //weekStartDate = tdDT.getMonth() + 1 + "-" + tdDT.getDate();
    weekStartDate = tdDT.toLocaleDateString().replace(/\//g, "-");

    //重新赋值
    lastDay = getDays()[6]; //本周的最后一天
    firstDay = getDays()[0]; //本周的第一天

}

//取得当前日期一周内的某一天
function getWeek(i) {
    var now = new Date();
    var n = now.getDay();
    var start = new Date();
    start.setDate(now.getDate() - n + i); //取得一周内的第一天、第二天、第三天...
    return start;
}

//取得当前日期一周内的七天
function getDays() {
    var days = new Array();
    for (var i = 1; i <= 7; i++) {
        days[i - 1] = getWeek(i);
    }
    return days;
}

//取得下一周的日期数(共七天)
function getNextWeekDatas(ndt) {
    var days = new Array();
    for (var i = 1; i <= 7; i++) {
        var dt = new Date(ndt);
        days[i - 1] = getNextWeek(dt, i);
    }
    return days;
}

//指定日期的下一周(后七天)
function getNextWeek(dt, i) {
    var today = dt;
    today.setDate(today.getDate() + i);
    return today;
}


//取得上一周的日期数(共七天)
function getPreviousWeekDatas(ndt) {
    var days = new Array();
    for (var i = -7; i <= -1; i++) {
        var dt = new Date(ndt);
        days[7 + i] = getPreviousWeek(dt, i);
    }
    return days;
}

//指定日期的上一周(前七天)
function getPreviousWeek(dt, i) {
    var today = dt;
    today.setDate(today.getDate() + i);
    return today;
}

//下一周
function nextWeek() {
    setCurrDTAfter(); //重设时间 

    //在表格中显示一周的日期  
    var dw = currDT.getDay(); //从Date对象返回一周中的某一天(0~6)
    var tdDT; //日期
    tdDT = getNextWeekDatas(lastDay)[0];


    var cMonth = tdDT.getMonth() < 10 ?
	("0" + (tdDT.getMonth() + 1)) : (tdDT.getMonth() + 1);

    var cDay = tdDT.getDate() < 10 ?
	("0" + (tdDT.getDate())) : (tdDT.getDate());


    //重新赋值
    firstDay = getNextWeekDatas(lastDay)[0]; //注意赋值顺序1
    lastDay = getNextWeekDatas(lastDay)[6]; //注意赋值顺序2

    var x = tdDT.getFullYear() + "-" + cMonth + "-" + cDay;
    return x;
}

//上一周
function previousWeek() {
    settCurrDTBefore();

    //在表格中显示一周的日期  
    var dw = currDT.getDay(); //从Date对象返回一周中的某一天(0~6)
    var tdDT; //日期
    tdDT = getPreviousWeekDatas(firstDay)[0];

    var x = document.getElementById("datetest");
    var cMonth = tdDT.getMonth() < 10 ? ("0" + (tdDT.getMonth() + 1)) : (tdDT.getMonth() + 1);

    var cDay = tdDT.getDate() < 10 ?
	("0" + (tdDT.getDate())) : (tdDT.getDate());

    //重新赋值
    lastDay = getPreviousWeekDatas(firstDay)[6]; //注意赋值顺序1
    firstDay = getPreviousWeekDatas(firstDay)[0]; //注意赋值顺序2

    var x = tdDT.getFullYear() + "-" + cMonth + "-" + cDay;
    return x;
}

//当前日期后第七天
function setCurrDTAfter() {
    currDT.setDate(currDT.getDate() + 7);
}

//当前日期前第七天
function settCurrDTBefore() {
    currDT.setDate(currDT.getDate() - 7);
}