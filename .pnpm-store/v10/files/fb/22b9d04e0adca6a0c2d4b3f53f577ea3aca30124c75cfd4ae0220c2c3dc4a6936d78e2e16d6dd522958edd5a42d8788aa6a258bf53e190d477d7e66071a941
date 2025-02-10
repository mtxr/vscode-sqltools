import { __assign } from "tslib";
export function getScaleMax(maxAngle, yField, data) {
    var yData = data.map(function (item) { return item[yField]; }).filter(function (v) { return v !== undefined; });
    var maxValue = yData.length > 0 ? Math.max.apply(Math, yData) : 0;
    var formatRadian = Math.abs(maxAngle) % 360;
    if (!formatRadian) {
        return maxValue;
    }
    return (maxValue * 360) / formatRadian;
}
/**
 * 获取堆叠之后的数据
 */
export function getStackedData(data, xField, yField) {
    var stackedData = [];
    data.forEach(function (item) {
        var valueItem = stackedData.find(function (v) { return v[xField] === item[xField]; });
        if (valueItem) {
            valueItem[yField] += item[yField] || null;
        }
        else {
            stackedData.push(__assign({}, item));
        }
    });
    return stackedData;
}
//# sourceMappingURL=utils.js.map