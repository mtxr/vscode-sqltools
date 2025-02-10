"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgressData = void 0;
var util_1 = require("@antv/util");
var number_1 = require("../../utils/number");
/**
 * 获取进度条数据
 */
function getProgressData(percent) {
    var clampPercent = (0, util_1.clamp)((0, number_1.isRealNumber)(percent) ? percent : 0, 0, 1);
    return [
        {
            // 用于 progressStyle 的回调方法
            current: "".concat(clampPercent),
            type: 'current',
            percent: clampPercent,
        },
        {
            current: "".concat(clampPercent),
            type: 'target',
            percent: 1,
        },
    ];
}
exports.getProgressData = getProgressData;
//# sourceMappingURL=utils.js.map