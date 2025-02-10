"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervalHideOverlap = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var util_2 = require("../../util");
function filterLabel(labels) {
    var MAX_CNT = 500; // 最多显示 500 个数据标签
    var filteredLabels = [];
    var pages = Math.max(Math.floor(labels.length / MAX_CNT), 1);
    (0, util_1.each)(labels, function (label, idx) {
        if (idx % pages === 0) {
            filteredLabels.push(label);
        }
        else {
            label.set('visible', false);
        }
    });
    return filteredLabels;
}
/**
 * 为 interval geometry 定制的数据标签重叠自动隐藏布局方法
 * @param items
 * @param labels
 * @param shapes
 */
function intervalHideOverlap(items, labels, shapes) {
    var _a;
    if (shapes.length === 0) {
        return;
    }
    var element = (_a = shapes[0]) === null || _a === void 0 ? void 0 : _a.get('element');
    var geometry = element === null || element === void 0 ? void 0 : element.geometry;
    if (!geometry || geometry.type !== 'interval') {
        return;
    }
    var filteredLabels = filterLabel(labels);
    var _b = tslib_1.__read(geometry.getXYFields(), 1), xField = _b[0];
    var dones = [];
    var todo = [];
    var groupedLabels = (0, util_1.groupBy)(filteredLabels, function (label) { return label.get('data')[xField]; });
    var xValues = (0, util_1.uniq)((0, util_1.map)(filteredLabels, function (label) { return label.get('data')[xField]; }));
    var xValue;
    filteredLabels.forEach(function (label) {
        label.set('visible', true);
    });
    var addCurrentGroup = function (curItems) {
        if (curItems) {
            if (curItems.length) {
                // 最后一个
                todo.push(curItems.pop());
            }
            todo.push.apply(todo, tslib_1.__spreadArray([], tslib_1.__read(curItems), false));
        }
    };
    if ((0, util_1.size)(xValues) > 0) {
        // 第一组
        xValue = xValues.shift();
        addCurrentGroup(groupedLabels[xValue]);
    }
    if ((0, util_1.size)(xValues) > 0) {
        // 最后一组
        xValue = xValues.pop();
        addCurrentGroup(groupedLabels[xValue]);
    }
    (0, util_1.each)(xValues.reverse(), function (val) {
        // 其他组
        addCurrentGroup(groupedLabels[val]);
    });
    while (todo.length > 0) {
        var cur = todo.shift();
        if (cur.get('visible')) {
            if ((0, util_2.checkShapeOverlap)(cur, dones)) {
                cur.set('visible', false);
            }
            else {
                dones.push(cur);
            }
        }
    }
}
exports.intervalHideOverlap = intervalHideOverlap;
//# sourceMappingURL=hide-overlap.js.map