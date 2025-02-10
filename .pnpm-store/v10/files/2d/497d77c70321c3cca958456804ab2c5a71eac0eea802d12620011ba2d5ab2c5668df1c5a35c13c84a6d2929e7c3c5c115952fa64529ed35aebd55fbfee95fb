"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockData = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("./constant");
/**
 * @desc 股票图数据处理
 * @param data
 * @param yField
 */
function getStockData(data, yField) {
    return (0, util_1.map)(data, function (item) {
        var obj = item && tslib_1.__assign({}, item);
        if ((0, util_1.isArray)(yField) && obj) {
            var open_1 = yField[0], close_1 = yField[1], high = yField[2], low = yField[3];
            obj[constant_1.TREND_FIELD] = obj[open_1] <= obj[close_1] ? constant_1.TREND_UP : constant_1.TREND_DOWN;
            obj[constant_1.Y_FIELD] = [obj[open_1], obj[close_1], obj[high], obj[low]];
        }
        return obj;
    });
}
exports.getStockData = getStockData;
//# sourceMappingURL=utils.js.map