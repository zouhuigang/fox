//消息提示
function altTip(txt, icon, ok, no, time) {
    art.dialog.through({
        content: txt,
        icon: icon,
        time: time,
        lock: true,
        yesFn: ok,
        noFn: no
    });
}
//提示窗口
function alertMsg(msg, time, id, width) {
    art.dialog({
        id: id,
        content: msg,
        lock: true,
        fixed: true,
        time: (time ? time : 2),
        width: width ? width : 250
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