
function timeFormat(seconds) {
    if (["", null, undefined].includes(seconds)) {
        return "时间未知";
    }
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds - hour * 3600) / 60);
    var second = seconds - hour * 3600 - minute * 60;
    if (second >= 30) {
        minute += 1;
    }

    let result = ""
    if (hour) {
        result += hour + "小时";
    }
    if (minute) {
        result += minute + "分钟";
    }
    if (result.length == 0) {
        result += second + "秒";
    }
    return result;
}

export default timeFormat;