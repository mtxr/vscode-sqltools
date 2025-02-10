"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShapeType = void 0;
var util_1 = require("util");
/**
 * @ignore
 * 从图形数据中获取 shape 类型
 * @param shapeCfg
 * @param defaultShapeType
 * @returns
 */
function getShapeType(shapeCfg, defaultShapeType) {
    var shapeType = defaultShapeType;
    if (shapeCfg.shape) {
        shapeType = (0, util_1.isArray)(shapeCfg.shape) ? shapeCfg.shape[0] : shapeCfg.shape;
    }
    return shapeType;
}
exports.getShapeType = getShapeType;
//# sourceMappingURL=get-shape-type.js.map