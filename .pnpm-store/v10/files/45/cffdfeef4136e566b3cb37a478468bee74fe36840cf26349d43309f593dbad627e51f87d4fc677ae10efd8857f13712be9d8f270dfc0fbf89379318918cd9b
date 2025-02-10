"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickInterval = exports.YEAR = exports.MONTH = exports.DAY = exports.HOUR = exports.MINUTE = exports.SECOND = exports.toTimeStamp = exports.timeFormat = void 0;
var util_1 = require("@antv/util");
var fecha_1 = require("fecha");
var fecha1 = require("fecha");
var bisector_1 = require("./bisector");
var FORMAT_METHOD = 'format';
function timeFormat(time, mask) {
    var method = fecha1[FORMAT_METHOD] || fecha_1.default[FORMAT_METHOD];
    return method(time, mask);
}
exports.timeFormat = timeFormat;
/**
 * 转换成时间戳
 * @param value 时间值
 */
function toTimeStamp(value) {
    if (util_1.isString(value)) {
        if (value.indexOf('T') > 0) {
            value = new Date(value).getTime();
        }
        else {
            // new Date('2010/01/10') 和 new Date('2010-01-10') 的差别在于:
            // 如果仅有年月日时，前者是带有时区的: Fri Jan 10 2020 02:40:13 GMT+0800 (中国标准时间)
            // 后者会格式化成 Sun Jan 10 2010 08:00:00 GMT+0800 (中国标准时间)
            value = new Date(value.replace(/-/gi, '/')).getTime();
        }
    }
    if (util_1.isDate(value)) {
        value = value.getTime();
    }
    return value;
}
exports.toTimeStamp = toTimeStamp;
var SECOND = 1000;
exports.SECOND = SECOND;
var MINUTE = 60 * SECOND;
exports.MINUTE = MINUTE;
var HOUR = 60 * MINUTE;
exports.HOUR = HOUR;
var DAY = 24 * HOUR;
exports.DAY = DAY;
var MONTH = DAY * 31;
exports.MONTH = MONTH;
var YEAR = DAY * 365;
exports.YEAR = YEAR;
var intervals = [
    ['HH:mm:ss', SECOND],
    ['HH:mm:ss', SECOND * 10],
    ['HH:mm:ss', SECOND * 30],
    ['HH:mm', MINUTE],
    ['HH:mm', MINUTE * 10],
    ['HH:mm', MINUTE * 30],
    ['HH', HOUR],
    ['HH', HOUR * 6],
    ['HH', HOUR * 12],
    ['YYYY-MM-DD', DAY],
    ['YYYY-MM-DD', DAY * 4],
    ['YYYY-WW', DAY * 7],
    ['YYYY-MM', MONTH],
    ['YYYY-MM', MONTH * 4],
    ['YYYY-MM', MONTH * 6],
    ['YYYY', DAY * 380],
];
function getTickInterval(min, max, tickCount) {
    var target = (max - min) / tickCount;
    var idx = bisector_1.default(function (o) { return o[1]; })(intervals, target) - 1;
    var interval = intervals[idx];
    if (idx < 0) {
        interval = intervals[0];
    }
    else if (idx >= intervals.length) {
        interval = util_1.last(intervals);
    }
    return interval;
}
exports.getTickInterval = getTickInterval;
//# sourceMappingURL=time.js.map