import { fixedBase } from '@antv/util';
function snapMultiple(v, base, snapType) {
    var div;
    if (snapType === 'ceil') {
        div = Math.ceil(v / base);
    }
    else if (snapType === 'floor') {
        div = Math.floor(v / base);
    }
    else {
        div = Math.round(v / base);
    }
    return div * base;
}
export default function intervalTicks(min, max, interval) {
    // 变成 interval 的倍数
    var minTick = snapMultiple(min, interval, 'floor');
    var maxTick = snapMultiple(max, interval, 'ceil');
    // 统一小数位数
    minTick = fixedBase(minTick, interval);
    maxTick = fixedBase(maxTick, interval);
    var ticks = [];
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Invalid_array_length
    var availableInterval = Math.max((maxTick - minTick) / (Math.pow(2, 12) - 1), interval);
    for (var i = minTick; i <= maxTick; i = i + availableInterval) {
        var tickValue = fixedBase(i, availableInterval); // 防止浮点数加法出现问题
        ticks.push(tickValue);
    }
    return {
        min: minTick,
        max: maxTick,
        ticks: ticks
    };
}
//# sourceMappingURL=interval.js.map