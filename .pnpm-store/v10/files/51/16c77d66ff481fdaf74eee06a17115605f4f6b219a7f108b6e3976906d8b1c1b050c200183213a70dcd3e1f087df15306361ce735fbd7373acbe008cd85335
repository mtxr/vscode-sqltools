"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = exports.registerAttribute = exports.getAttribute = void 0;
var tslib_1 = require("tslib");
var base_1 = require("./attributes/base");
exports.Attribute = base_1.default;
// 所有的 attribute map
var ATTRIBUTE_MAP = {};
/**
 * 通过类型获得 Attribute 类
 * @param type
 */
var getAttribute = function (type) {
    return ATTRIBUTE_MAP[type.toLowerCase()];
};
exports.getAttribute = getAttribute;
var registerAttribute = function (type, ctor) {
    // 注册的时候，需要校验 type 重名，不区分大小写
    if (getAttribute(type)) {
        throw new Error("Attribute type '".concat(type, "' existed."));
    }
    // 存储到 map 中
    ATTRIBUTE_MAP[type.toLowerCase()] = ctor;
};
exports.registerAttribute = registerAttribute;
tslib_1.__exportStar(require("./interface"), exports);
//# sourceMappingURL=factory.js.map