"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_es_1 = require("lodash-es");
function getMinDiff(del, add, modify) {
    var type = null;
    var min = modify;
    if (add < min) {
        min = add;
        type = 'add';
    }
    if (del < min) {
        min = del;
        type = 'del';
    }
    return {
        type: type,
        min: min,
    };
}
/*
 * https://en.wikipedia.org/wiki/Levenshtein_distance
 * 计算两条path的编辑距离
 */
var levenshteinDistance = function (source, target) {
    var sourceLen = source.length;
    var targetLen = target.length;
    var sourceSegment, targetSegment;
    var temp = 0;
    if (sourceLen === 0 || targetLen === 0) {
        return null;
    }
    var dist = [];
    for (var i = 0; i <= sourceLen; i++) {
        dist[i] = [];
        dist[i][0] = { min: i };
    }
    for (var j = 0; j <= targetLen; j++) {
        dist[0][j] = { min: j };
    }
    for (var i = 1; i <= sourceLen; i++) {
        sourceSegment = source[i - 1];
        for (var j = 1; j <= targetLen; j++) {
            targetSegment = target[j - 1];
            if (lodash_es_1.isEqual(sourceSegment, targetSegment)) {
                temp = 0;
            }
            else {
                temp = 1;
            }
            var del = dist[i - 1][j].min + 1;
            var add = dist[i][j - 1].min + 1;
            var modify = dist[i - 1][j - 1].min + temp;
            dist[i][j] = getMinDiff(del, add, modify);
        }
    }
    return dist;
};
function fillPathByDiff(source, target) {
    var diffMatrix = levenshteinDistance(source, target);
    var sourceLen = source.length;
    var targetLen = target.length;
    var changes = [];
    var index = 1;
    var minPos = 1;
    // 如果source和target不是完全不相等
    // @ts-ignore
    if (diffMatrix[sourceLen][targetLen] !== sourceLen) {
        // 获取从source到target所需改动
        for (var i = 1; i <= sourceLen; i++) {
            var min = diffMatrix[i][i].min;
            minPos = i;
            for (var j = index; j <= targetLen; j++) {
                if (diffMatrix[i][j].min < min) {
                    min = diffMatrix[i][j].min;
                    minPos = j;
                }
            }
            index = minPos;
            if (diffMatrix[i][index].type) {
                changes.push({ index: i - 1, type: diffMatrix[i][index].type });
            }
        }
        // 对source进行增删path
        for (var i = changes.length - 1; i >= 0; i--) {
            index = changes[i].index;
            if (changes[i].type === 'add') {
                // @ts-ignore
                source.splice(index, 0, [].concat(source[index]));
            }
            else {
                // @ts-ignore
                source.splice(index, 1);
            }
        }
    }
    // source尾部补齐
    sourceLen = source.length;
    if (sourceLen < targetLen) {
        for (var i = 0; i < targetLen - sourceLen; i++) {
            if (source[sourceLen - 1][0] === 'z' || source[sourceLen - 1][0] === 'Z') {
                // @ts-ignore
                source.splice(sourceLen - 2, 0, source[sourceLen - 2]);
            }
            else {
                // @ts-ignore
                source.push(source[sourceLen - 1]);
            }
        }
    }
    return source;
}
exports.default = fillPathByDiff;
//# sourceMappingURL=fill-path-by-diff.js.map