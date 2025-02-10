/**
 * 类似 lodash.pick 的方法
 * @param obj
 * @param keys
 */
export function pick(obj, keys) {
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
//# sourceMappingURL=pick.js.map