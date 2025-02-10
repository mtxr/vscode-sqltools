"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerScale = exports.getScale = exports.Scale = void 0;
var base_1 = require("./base");
exports.Scale = base_1.default;
var map = {};
function getClass(key) {
    return map[key];
}
exports.getScale = getClass;
function registerClass(key, cls) {
    if (getClass(key)) {
        throw new Error("type '" + key + "' existed.");
    }
    map[key] = cls;
}
exports.registerScale = registerClass;
//# sourceMappingURL=factory.js.map