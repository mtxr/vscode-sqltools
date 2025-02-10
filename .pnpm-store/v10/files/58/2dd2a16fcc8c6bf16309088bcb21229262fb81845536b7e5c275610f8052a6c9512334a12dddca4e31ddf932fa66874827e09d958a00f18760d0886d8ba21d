"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCoordinate = exports.getCoordinate = void 0;
var tslib_1 = require("tslib");
// 所有的 Coordinate map
var COORDINATE_MAP = {};
/**
 * 通过类型获得 coordinate 类
 * @param type
 */
var getCoordinate = function (type) {
    return COORDINATE_MAP[type.toLowerCase()];
};
exports.getCoordinate = getCoordinate;
/**
 * 注册 coordinate 类
 * @param type
 * @param ctor
 */
var registerCoordinate = function (type, ctor) {
    // 存储到 map 中
    COORDINATE_MAP[type.toLowerCase()] = ctor;
};
exports.registerCoordinate = registerCoordinate;
tslib_1.__exportStar(require("./interface"), exports);
//# sourceMappingURL=factory.js.map