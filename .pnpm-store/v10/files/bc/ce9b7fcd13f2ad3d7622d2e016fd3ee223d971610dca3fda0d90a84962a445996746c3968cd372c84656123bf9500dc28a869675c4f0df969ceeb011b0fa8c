"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTooltipMapping = void 0;
var util_1 = require("@antv/util");
/**
 * 获得 tooltip 的映射信息
 * @param tooltip
 * @param defaultFields
 */
function getTooltipMapping(tooltip, defaultFields) {
    if (tooltip === false) {
        return {
            fields: false, // 关闭 tooltip
        };
    }
    var fields = (0, util_1.get)(tooltip, 'fields');
    var formatter = (0, util_1.get)(tooltip, 'formatter');
    if (formatter && !fields) {
        fields = defaultFields;
    }
    return {
        fields: fields,
        formatter: formatter,
    };
}
exports.getTooltipMapping = getTooltipMapping;
//# sourceMappingURL=tooltip.js.map