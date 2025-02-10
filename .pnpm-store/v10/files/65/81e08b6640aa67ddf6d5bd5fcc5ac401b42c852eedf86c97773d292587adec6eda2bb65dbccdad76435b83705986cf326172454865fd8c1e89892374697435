/* eslint-disable no-restricted-syntax */
// 类型检测
export var isType = function (value, type) {
    var toString = {}.toString;
    return toString.call(value) === "[object ".concat(type, "]");
};
export var clone = function (source) {
    if (!source) {
        return source;
    }
    var target = {};
    // eslint-disable-next-line guard-for-in
    for (var k in source) {
        target[k] = source[k];
    }
    return target;
};
export var getType = function (n) {
    return Object.prototype.toString.call(n).slice(8, -1);
};
/**
 * 深克隆
 * @param source 要深克隆的目标对象
 */
export var deepClone = function (source) {
    if (!source || typeof source !== 'object') {
        return source;
    }
    var target;
    if (Array.isArray(source)) {
        target = source.map(function (item) { return deepClone(item); });
    }
    else {
        target = {};
        Object.keys(source).forEach(function (key) {
            return (target[key] = deepClone(source[key]));
        });
    }
    return target;
};
/**
 * 存在时返回路径值，不存在时返回 undefined
 */
export var hasPath = function (source, path) {
    var current = source;
    for (var i = 0; i < path.length; i += 1) {
        if (current === null || current === void 0 ? void 0 : current[path[i]]) {
            current = current[path[i]];
        }
        else {
            current = undefined;
            break;
        }
    }
    return current;
};
/**
 * 内部指定 params ，不考虑复杂情况
 */
export var setPath = function (source, path, value) {
    if (!source) {
        return source;
    }
    var o = source;
    path.forEach(function (key, idx) {
        // 不是最后一个
        if (idx < path.length - 1) {
            o = o[key];
        }
        else {
            o[key] = value;
        }
    });
    return source;
};
export var uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
