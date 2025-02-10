import Scale from './base';
var map = {};
function getClass(key) {
    return map[key];
}
function registerClass(key, cls) {
    if (getClass(key)) {
        throw new Error("type '" + key + "' existed.");
    }
    map[key] = cls;
}
export { Scale, getClass as getScale, registerClass as registerScale };
//# sourceMappingURL=factory.js.map