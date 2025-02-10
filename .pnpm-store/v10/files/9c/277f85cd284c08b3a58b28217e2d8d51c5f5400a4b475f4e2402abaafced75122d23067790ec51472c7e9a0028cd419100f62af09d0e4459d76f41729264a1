import { DAY, HOUR, MINUTE, MONTH, SECOND, YEAR } from '../util/time';
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
    return Math.ceil((max - min) / DAY);
}
function diffHour(min, max) {
    return Math.ceil((max - min) / HOUR);
}
function diffMinus(min, max) {
    return Math.ceil((max - min) / (60 * 1000));
}
/**
 * 计算 time 的 ticks，对 month, year 进行 pretty 处理
 * @param cfg 度量的配置项
 * @returns 计算后的 ticks
 */
export default function timePretty(cfg) {
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
    if (tickInterval > YEAR) {
        var maxYear = getYear(max);
        var yearInterval = Math.ceil(tickInterval / YEAR);
        for (var i = minYear; i <= maxYear + yearInterval; i = i + yearInterval) {
            ticks.push(createYear(i));
        }
    }
    else if (tickInterval > MONTH) {
        // 大于月时
        var monthInterval = Math.ceil(tickInterval / MONTH);
        var mmMoth = getMonth(min);
        var dMonths = diffMonth(min, max);
        for (var i = 0; i <= dMonths + monthInterval; i = i + monthInterval) {
            ticks.push(creatMonth(minYear, i + mmMoth));
        }
    }
    else if (tickInterval > DAY) {
        // 大于天
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var mday = date.getDate();
        var day = Math.ceil(tickInterval / DAY);
        var ddays = diffDay(min, max);
        for (var i = 0; i < ddays + day; i = i + day) {
            ticks.push(new Date(year, month, mday + i).getTime());
        }
    }
    else if (tickInterval > HOUR) {
        // 大于小时
        var date = new Date(min);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = date.getHours();
        var hours = Math.ceil(tickInterval / HOUR);
        var dHours = diffHour(min, max);
        for (var i = 0; i <= dHours + hours; i = i + hours) {
            ticks.push(new Date(year, month, day, hour + i).getTime());
        }
    }
    else if (tickInterval > MINUTE) {
        // 大于分钟
        var dMinus = diffMinus(min, max);
        var minutes = Math.ceil(tickInterval / MINUTE);
        for (var i = 0; i <= dMinus + minutes; i = i + minutes) {
            ticks.push(min + i * MINUTE);
        }
    }
    else {
        // 小于分钟
        var interval = tickInterval;
        if (interval < SECOND) {
            interval = SECOND;
        }
        var minSecond = Math.floor(min / SECOND) * SECOND;
        var dSeconds = Math.ceil((max - min) / SECOND);
        var seconds = Math.ceil(interval / SECOND);
        for (var i = 0; i < dSeconds + seconds; i = i + seconds) {
            ticks.push(minSecond + i * SECOND);
        }
    }
    // 最好是能从算法能解决这个问题，但是如果指定了 tickInterval，计算 ticks，也只能这么算，所以
    // 打印警告提示
    if (ticks.length >= 512) {
        console.warn("Notice: current ticks length(" + ticks.length + ") >= 512, may cause performance issues, even out of memory. Because of the configure \"tickInterval\"(in milliseconds, current is " + tickInterval + ") is too small, increase the value to solve the problem!");
    }
    return ticks;
}
//# sourceMappingURL=time-pretty.js.map