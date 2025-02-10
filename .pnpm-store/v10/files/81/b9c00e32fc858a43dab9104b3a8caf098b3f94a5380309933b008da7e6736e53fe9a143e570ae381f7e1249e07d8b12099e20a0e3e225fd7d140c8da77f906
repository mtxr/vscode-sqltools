"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = exports.setPath = exports.hasPath = exports.deepClone = exports.getType = exports.clone = exports.isType = void 0;
/* eslint-disable no-restricted-syntax */
// 类型检测
var isType = function (value, type) {
    var toString = {}.toString;
    return toString.call(value) === "[object ".concat(type, "]");
};
exports.isType = isType;
var clone = function (source) {
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
exports.clone = clone;
var getType = function (n) {
    return Object.prototype.toString.call(n).slice(8, -1);
};
exports.getType = getType;
/**
 * 深克隆
 * @param source 要深克隆的目标对象
 */
var deepClone = function (source) {
    if (!source || typeof source !== 'object') {
        return source;
    }
    var target;
    if (Array.isArray(source)) {
        target = source.map(function (item) { return (0, exports.deepClone)(item); });
    }
    else {
        target = {};
        Object.keys(source).forEach(function (key) {
            return (target[key] = (0, exports.deepClone)(source[key]));
        });
    }
    return target;
};
exports.deepClone = deepClone;
/**
 * 存在时返回路径值，不存在时返回 undefined
 */
var hasPath = function (source, path) {
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
exports.hasPath = hasPath;
/**
 * 内部指定 params ，不考虑复杂情况
 */
var setPath = function (source, path, value) {
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
exports.setPath = setPath;
var uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.uuid = uuid;
