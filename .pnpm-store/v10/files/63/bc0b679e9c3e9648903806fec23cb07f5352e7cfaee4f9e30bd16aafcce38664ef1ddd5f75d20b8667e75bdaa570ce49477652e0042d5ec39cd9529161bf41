"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathAdjustPosition = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var util_2 = require("../../util");
/**
 * 对同一组(相同 xField )的 Label 进行排序：第一个、最后一个、其他...
 * @param geometry
 * @param labels
 */
function sortLabels(geometry, labels) {
    var yField = geometry.getXYFields()[1];
    var result = [];
    var sortedLabels = labels.sort(function (left, right) { return left.get('data')[yField] - left.get('data')[yField]; });
    if (sortedLabels.length > 0) {
        result.push(sortedLabels.shift());
    }
    if (sortedLabels.length > 0) {
        result.push(sortedLabels.pop());
    }
    result.push.apply(result, tslib_1.__spreadArray([], tslib_1.__read(sortedLabels), false));
    return result;
}
function hasSome(dones, current, compare) {
    return dones.some(function (done) { return compare(done, current); });
}
/**
 * 计算两个矩形之间的堆叠区域面积
 */
function getOverlapArea(a, b, margin) {
    if (margin === void 0) { margin = 0; }
    var xOverlap = Math.max(0, Math.min(a.x + a.width + margin, b.x + b.width + margin) - Math.max(a.x - margin, b.x - margin));
    var yOverlap = Math.max(0, Math.min(a.y + a.height + margin, b.y + b.height + margin) - Math.max(a.y - margin, b.y - margin));
    return xOverlap * yOverlap;
}
/**
 * 判断新添加的 Label 是否和已存在的发生重叠
 * @param dones
 * @param current
 */
function checkShapeOverlap(dones, current) {
    return hasSome(dones, current, function (left, right) {
        var leftText = (0, util_2.findLabelTextShape)(left);
        var rightText = (0, util_2.findLabelTextShape)(right);
        return getOverlapArea(leftText.getCanvasBBox(), rightText.getCanvasBBox(), 2) > 0;
    });
}
/**
 * 适用于 point geometry 的数据标签位置自动调整布局方法
 * @param items
 * @param labels
 * @param shapes
 * @param region
 * @param cfg
 */
function pathAdjustPosition(items, labels, shapes, region, cfg) {
    var _a, _b;
    if (shapes.length === 0) {
        return;
    }
    var element = (_a = shapes[0]) === null || _a === void 0 ? void 0 : _a.get('element');
    var geometry = element === null || element === void 0 ? void 0 : element.geometry;
    if (!geometry || ['path', 'line', 'area'].indexOf(geometry.type) < 0) {
        return;
    }
    var _c = tslib_1.__read(geometry.getXYFields(), 2), xField = _c[0], yField = _c[1];
    var groupedLabels = (0, util_1.groupBy)(labels, function (label) { return label.get('data')[xField]; });
    var dones = [];
    var offset = (cfg && cfg.offset) || ((_b = items[0]) === null || _b === void 0 ? void 0 : _b.offset) || 12;
    (0, util_1.map)((0, util_1.keys)(groupedLabels).reverse(), function (xValue) {
        var sortedCollections = sortLabels(geometry, groupedLabels[xValue]);
        while (sortedCollections.length) {
            var current = sortedCollections.shift();
            var textShape = (0, util_2.findLabelTextShape)(current);
            if (hasSome(dones, current, function (left, right) {
                return left.get('data')[xField] === right.get('data')[xField] &&
                    left.get('data')[yField] === right.get('data')[yField];
            })) {
                // 重复位置，直接隐藏
                textShape.set('visible', false);
                continue;
            }
            var upFail = checkShapeOverlap(dones, current);
            var downFail = false;
            if (upFail) {
                textShape.attr('y', textShape.attr('y') + 2 * offset);
                downFail = checkShapeOverlap(dones, current);
            }
            if (downFail) {
                textShape.set('visible', false);
                continue;
            }
            dones.push(current);
        }
    });
}
exports.pathAdjustPosition = pathAdjustPosition;
//# sourceMappingURL=adjust-position.js.map