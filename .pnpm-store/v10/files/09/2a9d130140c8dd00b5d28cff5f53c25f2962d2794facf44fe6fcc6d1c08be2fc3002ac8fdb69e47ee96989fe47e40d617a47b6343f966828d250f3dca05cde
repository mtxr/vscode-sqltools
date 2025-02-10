"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformLabel = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
/**
 * 兼容 v1 label formatter
 * @param labelOptions
 */
function transformLabel(labelOptions) {
    if (!(0, util_1.isType)(labelOptions, 'Object')) {
        return labelOptions;
    }
    var label = tslib_1.__assign({}, labelOptions);
    if (label.formatter && !label.content) {
        label.content = label.formatter;
    }
    return label;
}
exports.transformLabel = transformLabel;
//# sourceMappingURL=label.js.map