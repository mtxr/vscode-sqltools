import { deepMix, get, map } from '@antv/util';
/**
 * @ignore
 * get the grid theme by type, will mix the common cfg of axis
 * @param theme
 * @param direction
 * @returns theme object
 */
export function getGridThemeCfg(theme, direction) {
    var axisTheme = deepMix({}, get(theme, ['components', 'axis', 'common']), get(theme, ['components', 'axis', direction]));
    return get(axisTheme, ['grid'], {});
}
/**
 * @ignore
 * get axis grid items
 * @param coordinate
 * @param scale
 * @param dim
 * @return items
 */
export function getLineGridItems(coordinate, scale, dim, alignTick) {
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
/**
 * @ignore
 * get
 * @param coordinate
 * @param xScale
 * @param yScale
 * @param dim
 * @returns items
 */
export function getCircleGridItems(coordinate, xScale, yScale, alignTick, dim) {
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
                points: map(Array(count + 1), function (__, idx) {
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
/**
 * @ignore
 * show grid or not
 * @param axisTheme
 * @param axisOption
 */
export function showGrid(axisTheme, axisOption) {
    var userGrid = get(axisOption, 'grid');
    if (userGrid === null) {
        return false;
    }
    var themeGrid = get(axisTheme, 'grid');
    return !(userGrid === undefined && themeGrid === null);
}
//# sourceMappingURL=grid.js.map