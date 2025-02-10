var ENGINES = {};
/**
 * 通过名字获取渲染 engine
 * @param name 渲染引擎名字
 * @returns G engine
 */
export function getEngine(name) {
    var G = ENGINES[name];
    if (!G) {
        throw new Error("G engine '".concat(name, "' is not exist, please register it at first."));
    }
    return G;
}
/**
 * 注册渲染引擎
 * @param name
 * @param engine
 */
export function registerEngine(name, engine) {
    ENGINES[name] = engine;
}
//# sourceMappingURL=index.js.map