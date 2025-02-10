import { isDate, isString, last } from '@antv/util';
import fecha from 'fecha';
import * as fecha1 from 'fecha';
import bisector from './bisector';
var FORMAT_METHOD = 'format';
export function timeFormat(time, mask) {
    var method = fecha1[FORMAT_METHOD] || fecha[FORMAT_METHOD];
    return method(time, mask);
}
/**
 * 转换成时间戳
 * @param value 时间值
 */
export function toTimeStamp(value) {
    if (isString(value)) {
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
    if (isDate(value)) {
        value = value.getTime();
    }
    return value;
}
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var MONTH = DAY * 31;
var YEAR = DAY * 365;
export { SECOND, MINUTE, HOUR, DAY, MONTH, YEAR };
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
export function getTickInterval(min, max, tickCount) {
    var target = (max - min) / tickCount;
    var idx = bisector(function (o) { return o[1]; })(intervals, target) - 1;
    var interval = intervals[idx];
    if (idx < 0) {
        interval = intervals[0];
    }
    else if (idx >= intervals.length) {
        interval = last(intervals);
    }
    return interval;
}
//# sourceMappingURL=time.js.map