var MAX_MIX_LEVEL = 5; // 最大比对层级
var toString = {}.toString;
// 类型检测
var isType = function (value, type) { return toString.call(value) === '[object ' + type + ']'; };
var isArray = function (value) {
    return isType(value, 'Array');
};
var isObjectLike = function (value) {
    /**
     * isObjectLike({}) => true
     * isObjectLike([1, 2, 3]) => true
     * isObjectLike(Function) => false
     */
    return typeof value === 'object' && value !== null;
};
var isPlainObject = function (value) {
    /**
     * isObjectLike(new Foo) => false
     * isObjectLike([1, 2, 3]) => false
     * isObjectLike({ x: 0, y: 0 }) => true
     */
    if (!isObjectLike(value) || !isType(value, 'Object')) {
        return false;
    }
    var proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
};
/***
 * @param {any} dist
 * @param {any} src
 * @param {number} level 当前层级
 * @param {number} maxLevel 最大层级
 */
var deep = function (dist, src, level, maxLevel) {
    level = level || 0;
    maxLevel = maxLevel || MAX_MIX_LEVEL;
    for (var key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
            var value = src[key];
            if (!value) {
                // null 、 undefined 等情况直接赋值
                dist[key] = value;
            }
            else {
                if (isPlainObject(value)) {
                    if (!isPlainObject(dist[key])) {
                        dist[key] = {};
                    }
                    if (level < maxLevel) {
                        deep(dist[key], value, level + 1, maxLevel);
                    }
                    else {
                        // 层级过深直接赋值，性能问题
                        dist[key] = src[key];
                    }
                }
                else if (isArray(value)) {
                    dist[key] = [];
                    dist[key] = dist[key].concat(value);
                }
                else {
                    dist[key] = value;
                }
            }
        }
    }
};
/**
 * deepAssign 功能类似 deepMix
 * 不同点在于 deepAssign 会将 null undefined 等类型直接覆盖给 source
 * 详细参考： __tests__/unit/utils/deep-assign-spec.ts
 */
export var deepAssign = function (rst) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < args.length; i += 1) {
        deep(rst, args[i]);
    }
    return rst;
};
//# sourceMappingURL=deep-assign.js.map