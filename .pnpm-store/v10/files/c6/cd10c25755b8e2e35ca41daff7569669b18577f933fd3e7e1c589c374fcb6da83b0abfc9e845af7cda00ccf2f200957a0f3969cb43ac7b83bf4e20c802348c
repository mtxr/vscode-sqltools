"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adjust = exports.registerAdjust = exports.getAdjust = void 0;
var tslib_1 = require("tslib");
var adjust_1 = require("./adjusts/adjust");
exports.Adjust = adjust_1.default;
var ADJUST_MAP = {};
/**
 * 根据类型获取 Adjust 类
 * @param type
 */
var getAdjust = function (type) {
    return ADJUST_MAP[type.toLowerCase()];
};
exports.getAdjust = getAdjust;
/**
 * 注册自定义 Adjust
 * @param type
 * @param ctor
 */
var registerAdjust = function (type, ctor) {
    // 注册的时候，需要校验 type 重名，不区分大小写
    if (getAdjust(type)) {
        throw new Error("Adjust type '" + type + "' existed.");
    }
    // 存储到 map 中
    ADJUST_MAP[type.toLowerCase()] = ctor;
};
exports.registerAdjust = registerAdjust;
tslib_1.__exportStar(require("./interface"), exports);
//# sourceMappingURL=factory.js.map