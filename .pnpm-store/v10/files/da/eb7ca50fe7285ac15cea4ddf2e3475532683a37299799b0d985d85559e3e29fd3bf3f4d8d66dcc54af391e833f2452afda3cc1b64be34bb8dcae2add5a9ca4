"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipsisTime = void 0;
var util_1 = require("@antv/util");
var fecha_1 = require("fecha");
var label_1 = require("../../util/label");
var text_1 = require("../../util/text");
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var MONTH = 31 * DAY;
var YEAR = 365 * DAY;
/** 时间周期显示 */
function dateTimeAbbrevaite(label, labels, index, timeDuration, limitLength) {
    var text = label.attr('text');
    var labelLength = label.getBBox().width;
    var codeLength = text_1.strLen(text);
    var reseveLength = Math.floor((limitLength / labelLength) * codeLength);
    var ellipsised = false;
    var campareText;
    if (index === labels.length - 1) {
        campareText = labels[index - 1].attr('text');
    }
    else {
        campareText = labels[index + 1].attr('text');
    }
    var compare = new Date(campareText);
    var current = new Date(label.attr('text'));
    // time frequency
    var timeCycle = getDateTimeMode(current, compare);
    // 如果duration和frequency在同一区间
    if (timeDuration === timeCycle) {
        if (index !== 0 && index !== labels.length - 1) {
            var formatter = sameSectionFormatter(current, timeDuration, reseveLength);
            label.attr('text', fecha_1.default.format(current, formatter));
            ellipsised = true;
        }
        return;
    }
    if (index !== 0) {
        var previousText = labels[index - 1].attr('text');
        var previous = new Date(previousText);
        var isAbbreviate = needAbbrevaite(timeDuration, current, previous);
        if (isAbbreviate) {
            var formatter = getAbbrevaiteFormatter(timeDuration, timeCycle);
            label.attr('text', fecha_1.default.format(current, formatter));
            ellipsised = true;
        }
    }
    if (ellipsised) {
        label.set('tip', text);
    }
    else {
        label.set('tip', null);
    }
}
/** 工具方法： 获取时间周期 */
function getTimeDuration(labels) {
    var start = new Date(labels[0].attr('text'));
    var end = new Date(labels[labels.length - 1].attr('text'));
    return getDateTimeMode(start, end);
}
/** 工具方法： 获取连个时间戳之间差值的时间粒度 */
function getDateTimeMode(a, b) {
    var mode;
    var dist = Math.abs(a - b);
    var mapper = {
        minute: [MINUTE, HOUR],
        hour: [HOUR, DAY],
        day: [DAY, MONTH],
        month: [MONTH, YEAR],
        year: [YEAR, Infinity],
    };
    util_1.each(mapper, function (range, key) {
        if (dist >= range[0] && dist < range[1]) {
            mode = key;
        }
    });
    return mode.toString();
}
/** 判断是否要进行时间周期显示 */
function needAbbrevaite(mode, current, previous) {
    var currentStamp = getTime(current, mode);
    var previousStamp = getTime(previous, mode);
    if (currentStamp !== previousStamp) {
        return false;
    }
    return true;
}
function getTime(date, mode) {
    if (mode.toString() === 'year') {
        return date.getFullYear();
    }
    if (mode.toString() === 'month') {
        return date.getMonth() + 1;
    }
    if (mode.toString() === 'day') {
        return date.getDay() + 1;
    }
    if (mode.toString() === 'hour') {
        return date.getHours() + 1;
    }
    if (mode.toString() === 'minute') {
        return date.getMinutes() + 1;
    }
}
/** 获取时间周期显示的formatter */
function getAbbrevaiteFormatter(duration, cycle) {
    var times = ['year', 'month', 'day', 'hour', 'minute'];
    var formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    var startIndex = times.indexOf(duration.toString()) + 1;
    var endIndex = times.indexOf(cycle.toString());
    var formatter = '';
    for (var i = startIndex; i <= endIndex; i++) {
        formatter += formatters[i];
        if (i < endIndex) {
            formatter += '-';
        }
    }
    return formatter;
}
/** 逐级显示逻辑 */
function sameSectionFormatter(time, mode, reseveLength) {
    var times = ['year', 'month', 'day', 'hour', 'minute'];
    var formatters = ['YYYY', 'MM', 'DD', 'HH', 'MM'];
    var index = times.indexOf(mode);
    var formatter = formatters[index];
    /*
    * 格式补完、逐级显示逻辑：
    * YYYY、MM、DD、HH、mm、ss 为时间格式字段，DD左边的字段为高位字段，右边的字段为低位字段。
    * 如果空间允许，DD及之前向高位补一位，HH及之后向低位补一位
    */
    if (index !== 0 && index !== times.length) {
        var extendIndex = index <= 2 ? index - 1 : index + 1;
        var extendFormatter = index <= 2 ? formatters[extendIndex] + "-" + formatter : formatter + "-" + formatters[extendIndex];
        if (text_1.strLen(fecha_1.default.format(time, extendFormatter)) <= reseveLength) {
            return extendFormatter;
        }
    }
    return formatter;
}
function ellipsisTime(labelGroup, limitLength) {
    var children = labelGroup.getChildren();
    var needEllipsis = false;
    var ellipsised = false;
    util_1.each(children, function (label) {
        var rst = label_1.testLabel(label, limitLength);
        needEllipsis = needEllipsis || rst;
    });
    if (needEllipsis) {
        var timeDuration_1 = getTimeDuration(children);
        util_1.each(children, function (label, index) {
            dateTimeAbbrevaite(label, children, index, timeDuration_1, limitLength);
        });
        ellipsised = true;
    }
    return ellipsised;
}
exports.ellipsisTime = ellipsisTime;
//# sourceMappingURL=auto-ellipsis-time.js.map