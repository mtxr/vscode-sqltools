"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showGrid = exports.getCircleGridItems = exports.getLineGridItems = exports.getGridThemeCfg = void 0;
var util_1 = require("@antv/util");
/**
 * @ignore
 * get the grid theme by type, will mix the common cfg of axis
 * @param theme
 * @param direction
 * @returns theme object
 */
function getGridThemeCfg(theme, direction) {
    var axisTheme = (0, util_1.deepMix)({}, (0, util_1.get)(theme, ['components', 'axis', 'common']), (0, util_1.get)(theme, ['components', 'axis', direction]));
    return (0, util_1.get)(axisTheme, ['grid'], {});
}
exports.getGridThemeCfg = getGridThemeCfg;
/**
 * @ignore
 * get axis grid items
 * @param coordinate
 * @param scale
 * @param dim
 * @return items
 */
function getLineGridItems(coordinate, scale, dim, alignTick) {
    var items = [];
    var ticks = scale.getTicks();
    if (coordinate.isPolar) {
        // 补全 ticks
        ticks.push({
            value: 1,
            text: '',
            tickValue: '',
        });
    }
    ticks.reduce(function (preTick, currentTick, currentIndex) {
        var currentValue = currentTick.value;
        if (alignTick) {
            items.push({
                points: [
                    coordinate.convert(dim === 'y' ? { x: 0, y: currentValue } : { x: currentValue, y: 0 }),
                    coordinate.convert(dim === 'y' ? { x: 1, y: currentValue } : { x: currentValue, y: 1 }),
                ],
            });
        }
        else {
            if (currentIndex) {
                var preValue = preTick.value;
                var middleValue = (preValue + currentValue) / 2;
                items.push({
                    points: [
                        coordinate.convert(dim === 'y' ? { x: 0, y: middleValue } : { x: middleValue, y: 0 }),
                        coordinate.convert(dim === 'y' ? { x: 1, y: middleValue } : { x: middleValue, y: 1 }),
                    ],
                });
            }
        }
        return currentTick;
    }, ticks[0]);
    return items;
}
exports.getLineGridItems = getLineGridItems;
/**
 * @ignore
 * get
 * @param coordinate
 * @param xScale
 * @param yScale
 * @param dim
 * @returns items
 */
function getCircleGridItems(coordinate, xScale, yScale, alignTick, dim) {
    var count = xScale.values.length;
    var items = [];
    var ticks = yScale.getTicks();
    ticks.reduce(function (preTick, currentTick) {
        var preValue = preTick ? preTick.value : currentTick.value; // 只有一项数据时取当前值
        var currentValue = currentTick.value;
        var middleValue = (preValue + currentValue) / 2;
        if (dim === 'x') {
            // 如果是 x 轴作为半径轴，那么只需要取圆弧收尾两个即可
            items.push({
                points: [
                    coordinate.convert({
                        x: alignTick ? currentValue : middleValue,
                        y: 0,
                    }),
                    coordinate.convert({
                        x: alignTick ? currentValue : middleValue,
                        y: 1,
                    }),
                ],
            });
        }
        else {
            items.push({
                points: (0, util_1.map)(Array(count + 1), function (__, idx) {
                    return coordinate.convert({
                        x: idx / count,
                        y: alignTick ? currentValue : middleValue,
                    });
                }),
            });
        }
        return currentTick;
    }, ticks[0]);
    return items;
}
exports.getCircleGridItems = getCircleGridItems;
/**
 * @ignore
 * show grid or not
 * @param axisTheme
 * @param axisOption
 */
function showGrid(axisTheme, axisOption) {
    var userGrid = (0, util_1.get)(axisOption, 'grid');
    if (userGrid === null) {
        return false;
    }
    var themeGrid = (0, util_1.get)(axisTheme, 'grid');
    return !(userGrid === undefined && themeGrid === null);
}
exports.showGrid = showGrid;
//# sourceMappingURL=grid.js.map