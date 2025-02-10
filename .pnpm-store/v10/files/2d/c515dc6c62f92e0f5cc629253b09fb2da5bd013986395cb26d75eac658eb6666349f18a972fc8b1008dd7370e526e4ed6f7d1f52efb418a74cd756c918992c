"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModelChange = void 0;
var util_1 = require("@antv/util");
/**
 * @ignore
 * Determines whether model is change
 * @param currentModel
 * @param preModel
 * @returns
 */
function isModelChange(currentModel, preModel) {
    return (0, util_1.some)(['color', 'shape', 'size', 'x', 'y', 'isInCircle', 'data', 'style', 'defaultStyle', 'points', 'mappingData'], function (key) {
        return !(0, util_1.isEqual)(currentModel[key], preModel[key]);
    });
}
exports.isModelChange = isModelChange;
//# sourceMappingURL=is-model-change.js.map