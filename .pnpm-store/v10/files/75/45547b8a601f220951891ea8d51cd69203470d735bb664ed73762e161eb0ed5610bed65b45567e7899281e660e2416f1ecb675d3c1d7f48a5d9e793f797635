"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equidistanceWithReverseBoth = exports.equidistance = exports.reserveBoth = exports.reserveLast = exports.reserveFirst = exports.getDefault = void 0;
var label_1 = require("../../util/label");
var matrix_1 = require("../../util/matrix");
var util_1 = require("../../util/util");
// 文本是否旋转
function isRotate(label) {
    var matrix = label.attr('matrix');
    return matrix && matrix[0] !== 1; // 仅在这个场景下判定
}
function getRotateAngle(label) {
    var angle = isRotate(label) ? matrix_1.getAngleByMatrix(label.attr('matrix')) : 0;
    return angle % 360;
}
// autohide 不再考虑超出限制
// function isOutLimit(isVertical: boolean, label: IElement, limitLength: number) {
//   if (!limitLength) {
//     // 如果没限制 limitLength 则直接返回 false
//     return false;
//   }
//   const canvasBBox = label.getCanvasBBox();
//   let isOut = false;
//   if (isVertical) {
//     isOut = canvasBBox.width > limitLength;
//   } else {
//     isOut = canvasBBox.height > limitLength;
//   }
//   return isOut;
// }
// 是否重叠
function isOverlap(isVertical, first, second, minGap) {
    var overlap = false;
    var angle = getRotateAngle(first);
    var distance = isVertical
        ? Math.abs(second.attr('y') - first.attr('y'))
        : Math.abs(second.attr('x') - first.attr('x'));
    var prevBBox = (isVertical
        ? second.attr('y') > first.attr('y')
        : second.attr('x') > first.attr('x'))
        ? first.getBBox()
        : second.getBBox();
    if (isVertical) {
        var ratio = Math.abs(Math.cos(angle));
        if (util_1.near(ratio, 0, Math.PI / 180)) {
            overlap = prevBBox.width + minGap > distance;
        }
        else {
            overlap = prevBBox.height / ratio + minGap > distance;
        }
    }
    else {
        var ratio = Math.abs(Math.sin(angle));
        if (util_1.near(ratio, 0, Math.PI / 180)) {
            overlap = prevBBox.width + minGap > distance;
        }
        else {
            overlap = prevBBox.height / ratio + minGap > distance;
        }
    }
    return overlap;
}
// 保留第一个或者最后一个
function reserveOne(isVertical, labelsGroup, reversed, autoHideCfg) {
    var minGap = (autoHideCfg === null || autoHideCfg === void 0 ? void 0 : autoHideCfg.minGap) || 0;
    var labels = labelsGroup
        .getChildren()
        .slice() // 复制数组
        .filter(function (item) { return item.get('visible'); });
    if (!labels.length) {
        return false;
    }
    var hasHide = false;
    if (reversed) {
        // 翻转
        labels.reverse();
    }
    var count = labels.length;
    var first = labels[0];
    var prev = first;
    for (var i = 1; i < count; i++) {
        var label = labels[i];
        var curBBox = label.getBBox();
        // 不再考虑超出限制，而仅仅根据是否重叠进行隐藏 isOutLimit(isVertical, label, limitLength) ||
        var isHide = isOverlap(isVertical, prev, label, minGap);
        if (isHide) {
            label.hide();
            hasHide = true;
        }
        else {
            prev = label;
        }
    }
    return hasHide;
}
// 均匀抽样隐藏标签，注意这里假设 label/tick 是均匀的
function parityHide(isVertical, labelsGroup, autoHideCfg) {
    var minGap = (autoHideCfg === null || autoHideCfg === void 0 ? void 0 : autoHideCfg.minGap) || 0;
    var labels = labelsGroup.getChildren().slice(); // 复制数组
    if (labels.length < 2) {
        // 如果数量小于 2 则直接返回，等于 2 时可能也会重合
        return false;
    }
    var hasHide = false;
    var first = labels[0];
    var firstBBox = first.getBBox();
    var second = labels[1];
    var count = labels.length;
    var angle = getRotateAngle(first);
    var distance = isVertical
        ? Math.abs(second.attr('y') - first.attr('y'))
        : Math.abs(second.attr('x') - first.attr('x'));
    var interval = 0; // 不重叠的坐标文本间距个数
    if (isVertical) {
        // 垂直的坐标轴计算垂直方向的间距
        var ratio = Math.abs(Math.cos(angle));
        if (util_1.near(ratio, 0, Math.PI / 180)) {
            var maxWidth = label_1.getMaxLabelWidth(labels);
            interval = (maxWidth + minGap) / distance;
        }
        else {
            interval = (firstBBox.height / ratio + minGap) / distance;
        }
    }
    else {
        // 水平坐标轴
        var ratio = Math.abs(Math.sin(angle));
        if (util_1.near(ratio, 0, Math.PI / 180)) {
            var maxWidth = label_1.getMaxLabelWidth(labels);
            interval = (maxWidth + minGap) / distance;
        }
        else {
            interval = (firstBBox.height / ratio + minGap) / distance;
        }
    }
    // interval > 1 时需要对 label 进行隐藏
    if (interval > 1) {
        interval = Math.ceil(interval);
        for (var i = 0; i < count; i++) {
            if (i % interval !== 0) {
                // 仅保留被整除的 label
                labels[i].hide();
                hasHide = true;
            }
        }
    }
    return hasHide;
}
function getDefault() {
    return equidistance;
}
exports.getDefault = getDefault;
/**
 * 保证首个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
function reserveFirst(isVertical, labelsGroup, limitLength, autoHideCfg) {
    return reserveOne(isVertical, labelsGroup, false, autoHideCfg);
}
exports.reserveFirst = reserveFirst;
/**
 * 保证最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
function reserveLast(isVertical, labelsGroup, limitLength, autoHideCfg) {
    return reserveOne(isVertical, labelsGroup, true, autoHideCfg);
}
exports.reserveLast = reserveLast;
/**
 * 保证第一个最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
function reserveBoth(isVertical, labelsGroup, limitLength, autoHideCfg) {
    var minGap = (autoHideCfg === null || autoHideCfg === void 0 ? void 0 : autoHideCfg.minGap) || 0;
    var labels = labelsGroup.getChildren().slice(); // 复制数组
    if (labels.length <= 2) {
        // 如果数量小于或等于 2 则直接返回
        return false;
    }
    var hasHide = false;
    var count = labels.length;
    var first = labels[0];
    var last = labels[count - 1];
    var preLabel = first;
    // 按照先保存第一个的逻辑循环一遍，最后一个不参与循环
    for (var i = 1; i < count - 1; i++) {
        var label = labels[i];
        var curBBox = label.getBBox();
        // 废弃 isOutLimit(isVertical, label, limitLength) ||
        var isHide = isOverlap(isVertical, preLabel, label, minGap);
        if (isHide) {
            label.hide();
            hasHide = true;
        }
        else {
            preLabel = label;
        }
    }
    var overlap = isOverlap(isVertical, preLabel, last, minGap);
    if (overlap) {
        // 发生冲突，则隐藏前一个保留后一个
        preLabel.hide();
        hasHide = true;
    }
    return hasHide;
}
exports.reserveBoth = reserveBoth;
/**
 * 保证 label 均匀显示 和 不出现重叠，主要解决文本层叠的问题，对于 limitLength 不处理
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
function equidistance(isVertical, labelsGroup, limitLength, autoHideCfg) {
    var hasHide = parityHide(isVertical, labelsGroup, autoHideCfg);
    // 处理  timeCat 类型的 tick，在均匀的基础上，再次检查出现重叠的进行隐藏
    if (reserveOne(isVertical, labelsGroup, false)) {
        hasHide = true;
    }
    return hasHide;
}
exports.equidistance = equidistance;
/**
 * 同 equidistance， 首先会保证 labels 均匀显示，然后会保留首尾
 * @param isVertical
 * @param labelsGroup
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
function equidistanceWithReverseBoth(isVertical, labelsGroup, limitLength, autoHideCfg) {
    var labels = labelsGroup.getChildren().slice(); // 复制数组
    var hasHide = parityHide(isVertical, labelsGroup, autoHideCfg);
    if (labels.length > 2) {
        var first = labels[0];
        var last = labels[labels.length - 1];
        // 如果第一个被隐藏了
        if (!first.get('visible')) {
            first.show();
            if (reserveOne(isVertical, labelsGroup, false, autoHideCfg)) {
                hasHide = true;
            }
        }
        // 如果最后一个被隐藏了
        if (!last.get('visible')) {
            last.show();
            if (reserveOne(isVertical, labelsGroup, true, autoHideCfg)) {
                hasHide = true;
            }
        }
    }
    return hasHide;
}
exports.equidistanceWithReverseBoth = equidistanceWithReverseBoth;
//# sourceMappingURL=auto-hide.js.map