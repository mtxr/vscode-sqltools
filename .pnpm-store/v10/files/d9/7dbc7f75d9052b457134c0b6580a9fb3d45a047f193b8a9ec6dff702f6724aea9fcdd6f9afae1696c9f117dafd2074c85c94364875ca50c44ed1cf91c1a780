"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.islegalSets = exports.layoutVennData = exports.getColorMap = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
var blend_1 = require("../../utils/color/blend");
var constant_1 = require("./constant");
var diagram_1 = require("./layout/diagram");
var layout_1 = require("./layout/layout");
/**
 * 获取 颜色映射
 * @usage colorMap.get(id) => color
 *
 * @returns Map<string, string>
 */
exports.getColorMap = (0, util_1.memoize)((function (colorPalette, data, blendMode, setsField) {
    var colorMap = new Map();
    var colorPaletteLen = colorPalette.length;
    data.forEach(function (d, idx) {
        if (d[setsField].length === 1) {
            colorMap.set(d[constant_1.ID_FIELD], colorPalette[(idx + colorPaletteLen) % colorPaletteLen]);
        }
        else {
            /** 一般都是可以获取到颜色的，如果不正确 就是输入了非法数据 */
            var colorArr = d[setsField].map(function (id) { return colorMap.get(id); });
            colorMap.set(d[constant_1.ID_FIELD], colorArr.slice(1).reduce(function (a, b) { return (0, blend_1.blend)(a, b, blendMode); }, colorArr[0]));
        }
    });
    return colorMap;
}), function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    return JSON.stringify(params);
});
/**
 * 给韦恩图数据进行布局
 *
 * @param data
 * @param width
 * @param height
 * @param padding
 * @returns 韦恩图数据
 */
function layoutVennData(options, width, height, padding) {
    if (padding === void 0) { padding = 0; }
    var data = options.data, setsField = options.setsField, sizeField = options.sizeField;
    // 处理空数据的情况
    if (data.length === 0) {
        (0, utils_1.log)(utils_1.LEVEL.WARN, false, 'warn: %s', '数据不能为空');
        return [];
    }
    var vennData = data.map(function (d) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, d), (_a = { sets: d[setsField] || [], size: d[sizeField] }, _a[constant_1.PATH_FIELD] = '', _a[constant_1.ID_FIELD] = '', _a)));
    });
    // 1. 进行排序，避免图形元素遮挡
    vennData.sort(function (a, b) { return a.sets.length - b.sets.length; });
    // todo 2. 可以在这里处理下非法数据输入，避免直接 crash
    var solution = (0, layout_1.venn)(vennData);
    var circles = (0, layout_1.scaleSolution)(solution, width, height, padding);
    var textCenters = (0, diagram_1.computeTextCentres)(circles, vennData);
    vennData.forEach(function (row) {
        var sets = row.sets;
        var id = sets.join(',');
        row[constant_1.ID_FIELD] = id;
        // 保留 vennText 布局方法
        var setCircles = sets.map(function (set) { return circles[set]; });
        var path = (0, diagram_1.intersectionAreaPath)(setCircles);
        if (!/[zZ]$/.test(path)) {
            path += ' Z';
        }
        row[constant_1.PATH_FIELD] = path;
        var center = textCenters[id] || { x: 0, y: 0 };
        (0, util_1.assign)(row, center);
    });
    return vennData;
}
exports.layoutVennData = layoutVennData;
/**
 * 检查是否存在 非法元素
 * @param legalArr 合法集合：['A', 'B']
 * @param testArr 检查集合：['A', 'B', 'C'] or ['A', 'C']（存在非法 'C'）
 * @return boolean
 */
function islegalSets(legalArr, testArr) {
    for (var i = 0; i < testArr.length; i++) {
        if (!legalArr.includes(testArr[i])) {
            return false;
        }
    }
    return true;
}
exports.islegalSets = islegalSets;
//# sourceMappingURL=utils.js.map