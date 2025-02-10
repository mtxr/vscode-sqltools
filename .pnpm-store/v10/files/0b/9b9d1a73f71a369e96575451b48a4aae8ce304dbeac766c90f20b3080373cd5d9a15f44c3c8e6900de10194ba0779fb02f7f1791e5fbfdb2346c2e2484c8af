"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processIllegalData = exports.transformDataToNodeLinkData = exports.adjustYMetaByZero = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var invariant_1 = require("./invariant");
var pick_1 = require("./pick");
/**
 * 查看数据是否是全负数、或者全正数
 * @param data
 * @param field
 */
function adjustYMetaByZero(data, field) {
    if (!data)
        return {};
    // 过滤出数字数据
    var numberData = data.filter(function (datum) {
        var v = (0, util_1.get)(datum, [field]);
        return (0, util_1.isNumber)(v) && !isNaN(v);
    });
    var gtZero = numberData.every(function (datum) { return (0, util_1.get)(datum, [field]) >= 0; });
    var ltZero = numberData.every(function (datum) { return (0, util_1.get)(datum, [field]) <= 0; });
    // 目前是增量更新，对 { min: 0, max: undefined } 进行 update({ max: 0 }) 会得到 { min: 0, max: 0 }
    if (gtZero) {
        return { min: 0 };
    }
    if (ltZero) {
        return { max: 0 };
    }
    return {};
}
exports.adjustYMetaByZero = adjustYMetaByZero;
/**
 * 转换数据格式为带有节点与边的数据格式
 * @param data
 * @param sourceField
 * @param targetField
 * @param weightField
 * @param rawFields 存放一些原数据
 */
function transformDataToNodeLinkData(data, sourceField, targetField, weightField, rawFields) {
    if (rawFields === void 0) { rawFields = []; }
    if (!Array.isArray(data)) {
        return {
            nodes: [],
            links: [],
        };
    }
    //   const nodes = [];
    var links = [];
    // 先使用对象方式存储
    var nodesMap = {};
    var nodesIndex = -1;
    // 数组变换成 chord layout 的数据结构
    data.forEach(function (datum) {
        var source = datum[sourceField];
        var target = datum[targetField];
        var weight = datum[weightField];
        var rawData = (0, pick_1.pick)(datum, rawFields);
        // source node
        if (!nodesMap[source]) {
            nodesMap[source] = tslib_1.__assign({ id: ++nodesIndex, name: source }, rawData);
        }
        if (!nodesMap[target]) {
            nodesMap[target] = tslib_1.__assign({ id: ++nodesIndex, name: target }, rawData);
        }
        // links
        links.push(tslib_1.__assign({ source: nodesMap[source].id, target: nodesMap[target].id, 
            // sourceName: source,
            // targetName: target,
            value: weight }, rawData));
    });
    return {
        // 需要按照 id 的顺序
        nodes: Object.values(nodesMap).sort(function (a, b) { return a.id - b.id; }),
        links: links,
    };
}
exports.transformDataToNodeLinkData = transformDataToNodeLinkData;
/**
 * 处理不合法的数据(过滤 非数值型 和 NaN，保留 null)
 * @param data
 * @param angleField
 */
function processIllegalData(data, field) {
    var processData = (0, util_1.filter)(data, function (d) {
        var v = d[field];
        return v === null || (typeof v === 'number' && !isNaN(v));
    });
    // 打印异常数据情况
    (0, invariant_1.log)(invariant_1.LEVEL.WARN, processData.length === data.length, 'illegal data existed in chart data.');
    return processData;
}
exports.processIllegalData = processIllegalData;
//# sourceMappingURL=data.js.map