"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearHighlight = exports.getElementValue = void 0;
var util_1 = require("@antv/util");
var utils_1 = require("../../../utils");
/**
 * 获取图表元素对应字段的值
 * @param element 图表元素
 * @param field 字段名
 * @ignore
 */
function getElementValue(element, field) {
    var model = element.getModel();
    var record = model.data;
    var value;
    if ((0, util_1.isArray)(record)) {
        value = record[0][field];
    }
    else {
        value = record[field];
    }
    return value;
}
exports.getElementValue = getElementValue;
/**
 * @ignore
 * 清理 highlight 效果
 * @param view View 或者 Chart
 */
function clearHighlight(view) {
    var elements = (0, utils_1.getAllElements)(view);
    (0, util_1.each)(elements, function (el) {
        if (el.hasState('active')) {
            el.setState('active', false);
        }
        if (el.hasState('selected')) {
            el.setState('selected', false);
        }
        if (el.hasState('inactive')) {
            el.setState('inactive', false);
        }
    });
}
exports.clearHighlight = clearHighlight;
//# sourceMappingURL=utils.js.map