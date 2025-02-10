import { __assign } from "tslib";
import { assign, memoize } from '@antv/util';
import { LEVEL, log } from '../../utils';
import { blend } from '../../utils/color/blend';
import { ID_FIELD, PATH_FIELD } from './constant';
import { computeTextCentres, intersectionAreaPath } from './layout/diagram';
import { scaleSolution, venn } from './layout/layout';
/**
 * 获取 颜色映射
 * @usage colorMap.get(id) => color
 *
 * @returns Map<string, string>
 */
export var getColorMap = memoize((function (colorPalette, data, blendMode, setsField) {
    var colorMap = new Map();
    var colorPaletteLen = colorPalette.length;
    data.forEach(function (d, idx) {
        if (d[setsField].length === 1) {
            colorMap.set(d[ID_FIELD], colorPalette[(idx + colorPaletteLen) % colorPaletteLen]);
        }
        else {
            /** 一般都是可以获取到颜色的，如果不正确 就是输入了非法数据 */
            var colorArr = d[setsField].map(function (id) { return colorMap.get(id); });
            colorMap.set(d[ID_FIELD], colorArr.slice(1).reduce(function (a, b) { return blend(a, b, blendMode); }, colorArr[0]));
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
export function layoutVennData(options, width, height, padding) {
    if (padding === void 0) { padding = 0; }
    var data = options.data, setsField = options.setsField, sizeField = options.sizeField;
    // 处理空数据的情况
    if (data.length === 0) {
        log(LEVEL.WARN, false, 'warn: %s', '数据不能为空');
        return [];
    }
    var vennData = data.map(function (d) {
        var _a;
        return (__assign(__assign({}, d), (_a = { sets: d[setsField] || [], size: d[sizeField] }, _a[PATH_FIELD] = '', _a[ID_FIELD] = '', _a)));
    });
    // 1. 进行排序，避免图形元素遮挡
    vennData.sort(function (a, b) { return a.sets.length - b.sets.length; });
    // todo 2. 可以在这里处理下非法数据输入，避免直接 crash
    var solution = venn(vennData);
    var circles = scaleSolution(solution, width, height, padding);
    var textCenters = computeTextCentres(circles, vennData);
    vennData.forEach(function (row) {
        var sets = row.sets;
        var id = sets.join(',');
        row[ID_FIELD] = id;
        // 保留 vennText 布局方法
        var setCircles = sets.map(function (set) { return circles[set]; });
        var path = intersectionAreaPath(setCircles);
        if (!/[zZ]$/.test(path)) {
            path += ' Z';
        }
        row[PATH_FIELD] = path;
        var center = textCenters[id] || { x: 0, y: 0 };
        assign(row, center);
    });
    return vennData;
}
/**
 * 检查是否存在 非法元素
 * @param legalArr 合法集合：['A', 'B']
 * @param testArr 检查集合：['A', 'B', 'C'] or ['A', 'C']（存在非法 'C'）
 * @return boolean
 */
export function islegalSets(legalArr, testArr) {
    for (var i = 0; i < testArr.length; i++) {
        if (!legalArr.includes(testArr[i])) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=utils.js.map