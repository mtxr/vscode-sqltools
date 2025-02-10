import { __assign } from "tslib";
import { isArray, map } from '@antv/util';
import { TREND_DOWN, TREND_FIELD, TREND_UP, Y_FIELD } from './constant';
/**
 * @desc 股票图数据处理
 * @param data
 * @param yField
 */
export function getStockData(data, yField) {
    return map(data, function (item) {
        var obj = item && __assign({}, item);
        if (isArray(yField) && obj) {
            var open_1 = yField[0], close_1 = yField[1], high = yField[2], low = yField[3];
            obj[TREND_FIELD] = obj[open_1] <= obj[close_1] ? TREND_UP : TREND_DOWN;
            obj[Y_FIELD] = [obj[open_1], obj[close_1], obj[high], obj[low]];
        }
        return obj;
    });
}
//# sourceMappingURL=utils.js.map