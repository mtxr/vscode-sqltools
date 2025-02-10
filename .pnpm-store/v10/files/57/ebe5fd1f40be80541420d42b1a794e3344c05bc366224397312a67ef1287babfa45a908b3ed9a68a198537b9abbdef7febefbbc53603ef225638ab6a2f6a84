"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncViewPadding = exports.isHorizontal = exports.transformData = void 0;
var util_1 = require("@antv/util");
/**
 * bidirectional-bar 处理数据, 通过 SERIES_FIELD_KEY 字段分成左右数据
 * @param xField
 * @param yField
 * @param data
 */
function transformData(xField, yField, seriesField, data, reverse) {
    var hopeData = [];
    yField.forEach(function (d) {
        data.forEach(function (k) {
            var _a;
            var obj = (_a = {},
                _a[xField] = k[xField],
                _a[seriesField] = d,
                _a[d] = k[d],
                _a);
            hopeData.push(obj);
        });
    });
    var groupData = Object.values((0, util_1.groupBy)(hopeData, seriesField));
    var _a = groupData[0], data1 = _a === void 0 ? [] : _a, _b = groupData[1], data2 = _b === void 0 ? [] : _b;
    return reverse ? [data1.reverse(), data2.reverse()] : [data1, data2];
}
exports.transformData = transformData;
/**
 * 是否横向，默认空为横向
 * @param layout
 */
function isHorizontal(layout) {
    return layout !== 'vertical';
}
exports.isHorizontal = isHorizontal;
/**
 * 多 view 进行同步 padding 的自定义逻辑
 * @param chart
 * @param views
 * @param p
 */
function syncViewPadding(chart, views, p) {
    var v1 = views[0], v2 = views[1];
    var p1 = v1.autoPadding;
    var p2 = v2.autoPadding;
    var _a = chart.__axisPosition, layout = _a.layout, position = _a.position;
    // 目前只能根据布局的比例来判断 layout
    if (isHorizontal(layout) && position === 'top') {
        /**
         * 保证 v1 的 left 和 v2 right 的间隔相等，因为 v1 有轴
         * position top 即为 v1 左边，中间间距设置就为 0
         */
        v1.autoPadding = p.instance(p1.top, 0, p1.bottom, p1.left);
        v2.autoPadding = p.instance(p2.top, p1.left, p2.bottom, 0);
    }
    if (isHorizontal(layout) && position === 'bottom') {
        /**
         * 保证 v1 的 left 和 v2 right 的间隔相等，因为 v1 有轴
         * position bottom 即为 v1 的右边，v1 right = right / 2  v2 left = right / 2
         * + 5 是为了 让那个轴不要太贴近了，更好看
         */
        v1.autoPadding = p.instance(p1.top, p1.right / 2 + 5, p1.bottom, p1.left);
        v2.autoPadding = p.instance(p2.top, p2.right, p2.bottom, p1.right / 2 + 5);
    }
    if (!isHorizontal(layout) && position === 'bottom') {
        /**
         * 保证 v1 的 left 和 v2 left 的间隔相等 left 取最大值
         * position bottom 即为 v1 下边，v1 bottom = bottom / 2  v2 top = bottom / 2
         * + 5 是为了 让那个轴不要太贴近了，更好看
         */
        var left = p1.left >= p2.left ? p1.left : p2.left;
        v1.autoPadding = p.instance(p1.top, p1.right, p1.bottom / 2 + 5, left);
        v2.autoPadding = p.instance(p1.bottom / 2 + 5, p2.right, p2.bottom, left);
    }
    // 垂直状态，不建议设置position 为 top， 还是做个兼容处理
    if (!isHorizontal(layout) && position === 'top') {
        var left = p1.left >= p2.left ? p1.left : p2.left;
        v1.autoPadding = p.instance(p1.top, p1.right, 0, left);
        v2.autoPadding = p.instance(0, p2.right, p1.top, left);
    }
}
exports.syncViewPadding = syncViewPadding;
//# sourceMappingURL=utils.js.map