"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
/**
 * 类似 lodash.pick 的方法
 * @param obj
 * @param keys
 */
function pick(obj, keys) {
    var r = {};
    if (obj !== null && typeof obj === 'object') {
        keys.forEach(function (key) {
            var v = obj[key];
            if (v !== undefined) {
                r[key] = v;
            }
        });
    }
    return r;
}
exports.pick = pick;
//# sourceMappingURL=pick.js.map