"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEngine = exports.getEngine = void 0;
var ENGINES = {};
/**
 * 通过名字获取渲染 engine
 * @param name 渲染引擎名字
 * @returns G engine
 */
function getEngine(name) {
    var G = ENGINES[name];
    if (!G) {
        throw new Error("G engine '".concat(name, "' is not exist, please register it at first."));
    }
    return G;
}
exports.getEngine = getEngine;
/**
 * 注册渲染引擎
 * @param name
 * @param engine
 */
function registerEngine(name, engine) {
    ENGINES[name] = engine;
}
exports.registerEngine = registerEngine;
//# sourceMappingURL=index.js.map