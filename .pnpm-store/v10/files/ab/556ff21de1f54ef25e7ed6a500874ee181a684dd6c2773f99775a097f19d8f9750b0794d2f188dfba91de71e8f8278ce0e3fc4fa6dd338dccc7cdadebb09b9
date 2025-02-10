"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var time_1 = require("../util/time");
function getYear(date) {
    return new Date(date).getFullYear();
}
function createYear(year) {
    return new Date(year, 0, 1).getTime();
}
function getMonth(date) {
    return new Date(date).getMonth();
}
function diffMonth(min, max) {
    var minYear = getYear(min);
    var maxYear = getYear(max);
    var minMonth = getMonth(min);
    var maxMonth = getMonth(max);
    return (maxYear - minYear) * 12 + ((maxMonth - minMonth) % 12);
}
function creatMonth(year, month) {
    return new Date(year, month, 1).getTime();
}
function diffDay(min, max) {
    return Math.ceil((max - min) / time_1.DAY);
}
function diffHour(min, max) {
    return Math.ceil((max - min) / time_1.HOUR);
}
function diffMinus(min, max) {
    return Math.ceil((max - min) / (60 * 1000));
}
/**
 * 计算 time 的 ticks，对 month, year 进行 pretty 处理
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
function timePretty(cfg) {
    var min = cfg.min, max = cfg.max, minTickInterval = cfg.minTickInterval, tickCount = cfg.tickCount;
    var tickInterval = cfg.tickInterval;
    var ticks = [];
    // 指定 tickInterval 后 tickCount 不生效，需要重新计算
    if (!tickInterval) {
        tickInterval = (max - min) / tickCount;
        // 如果设置了最小间距，则使用最小间距
        if (minTickInterval && tickInterval < minTickInterval) {
            tickInterval = minTickInterval;
        }
    }
    tickInterval = Math.max(Math.floor((max - min) / (Math.pow(2, 12) - 1)), tickInterval);
    var minYear = getYear(min);
    // 如果间距大于 1 年，则将开始日期从整年开始
    if (tickInterval > time_1.YEAR) {
        var maxYear = getYear(max);
        var yearInterval = Math.ceil(tickInterval / time_1.YEAR);
        for (var i = minYear; i <= maxYear + yearInterval; i = i + yearInterval) {
            ticks.push(createYear(i));
        }
    }
    else if (tickInterval > time_1.MONTH) {
        // 大于月时
        var monthInterval = Math.ceil(tickInterval / time_1.MONTH);
        var mmMoth = getMonth(min);
        var dMonths = diffMonth(min, max);
        for (var i = 0; i <= dMonths + monthInterval; i = i + monthInterval) {
            ticks.push(creatMonth(minYear, i + mmMoth));
        }
    }
    else if (tickInterval > time_1.DAY) {
        // 大于天
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var mday = date.getDate();
        var day = Math.ceil(tickInterval / time_1.DAY);
        var ddays = diffDay(min, max);
        for (var i = 0; i < ddays + day; i = i + day) {
            ticks.push(new Date(year, month, mday + i).getTime());
        }
    }
    else if (tickInterval > time_1.HOUR) {
        // 大于小时
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var hours = Math.ceil(tickInterval / time_1.HOUR);
        var dHours = diffHour(min, max);
        for (var i = 0; i <= dHours + hours; i = i + hours) {
            ticks.push(new Date(year, month, day, hour + i).getTime());
        }
    }
    else if (tickInterval > time_1.MINUTE) {
        // 大于分钟
        var dMinus = diffMinus(min, max);
        var minutes = Math.ceil(tickInterval / time_1.MINUTE);
        for (var i = 0; i <= dMinus + minutes; i = i + minutes) {
            ticks.push(min + i * time_1.MINUTE);
        }
    }
    else {
        // 小于分钟
        var interval = tickInterval;
        if (interval < time_1.SECOND) {
            interval = time_1.SECOND;
        }
        var minSecond = Math.floor(min / time_1.SECOND) * time_1.SECOND;
        var dSeconds = Math.ceil((max - min) / time_1.SECOND);
        var seconds = Math.ceil(interval / time_1.SECOND);
        for (var i = 0; i < dSeconds + seconds; i = i + seconds) {
            ticks.push(minSecond + i * time_1.SECOND);
        }
    }
    // 最好是能从算法能解决这个问题，但是如果指定了 tickInterval，计算 ticks，也只能这么算，所以
    // 打印警告提示
    if (ticks.length >= 512) {
        console.warn("Notice: current ticks length(" + ticks.length + ") >= 512, may cause performance issues, even out of memory. Because of the configure \"tickInterval\"(in milliseconds, current is " + tickInterval + ") is too small, increase the value to solve the problem!");
    }
    return ticks;
}
exports.default = timePretty;
//# sourceMappingURL=time-pretty.js.map