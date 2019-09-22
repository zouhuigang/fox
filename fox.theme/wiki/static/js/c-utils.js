var cutils={
	
	dateFormatM: function(m) {//秒
	   var mt=this.dateFormat(m+"000");
	    return mt
    },
	
	dateFormat: function(e) {
        var t = new Date;
        t.setHours(0),
        t.setMinutes(0),
        t.setSeconds(0),
        t.setMilliseconds(0);
        var n = 864e5,
        r = new Date(t - n),
        i = new Date(r - n),
        o = new Date(e - 0),
        s = new Date,
        a = (s.valueOf() - o.valueOf()) / 1e3,
        f = "";
        return o.valueOf() <= i.valueOf() ? this.dateTranslate(o, "MM-dd hh:mm") : r.valueOf() >= o.valueOf() && o.valueOf() >= i.valueOf() ? this.dateTranslate(o, "MM-dd hh:mm") : t.valueOf() >= o.valueOf() && o.valueOf() >= r.valueOf() ? this.dateTranslate(o, "MM-dd hh:mm") : a >= 3600 && o.valueOf() >= t.valueOf() ? Math.round(a / 60 / 60) + "小时前": a >= 60 && 3600 > a ? Math.round(a / 60) + "分钟前": 60 > a ? "刚刚": f
    },
	dateTranslate: function(e, t) {
        var n = {
            "M+": e.getMonth() + 1,
            "d+": e.getDate(),
            "h+": e.getHours(),
            "m+": e.getMinutes(),
            "s+": e.getSeconds(),
            "q+": Math.floor((e.getMonth() + 3) / 3),
            S: e.getMilliseconds()
        };
        /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var r in n) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? n[r] : ("00" + n[r]).substr(("" + n[r]).length)));
        return t
    }
	
}
