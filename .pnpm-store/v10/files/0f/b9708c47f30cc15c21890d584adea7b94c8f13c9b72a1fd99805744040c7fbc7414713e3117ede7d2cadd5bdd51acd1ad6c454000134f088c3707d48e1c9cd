"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ellipsisMiddle = exports.ellipsisTail = exports.ellipsisHead = exports.getDefault = void 0;
var util_1 = require("@antv/util");
var label_1 = require("../../util/label");
function ellipseLabels(isVertical, labelGroup, limitLength, position) {
    var children = labelGroup.getChildren();
    var ellipsisFlag = false;
    util_1.each(children, function (label) {
        var rst = label_1.ellipsisLabel(isVertical, label, limitLength, position);
        ellipsisFlag = ellipsisFlag || rst;
    });
    return ellipsisFlag;
}
function getDefault() {
    return ellipsisTail;
}
exports.getDefault = getDefault;
function ellipsisHead(isVertical, labelGroup, limitLength) {
    return ellipseLabels(isVertical, labelGroup, limitLength, 'head');
}
exports.ellipsisHead = ellipsisHead;
function ellipsisTail(isVertical, labelGroup, limitLength) {
    return ellipseLabels(isVertical, labelGroup, limitLength, 'tail');
}
exports.ellipsisTail = ellipsisTail;
function ellipsisMiddle(isVertical, labelGroup, limitLength) {
    return ellipseLabels(isVertical, labelGroup, limitLength, 'middle');
}
exports.ellipsisMiddle = ellipsisMiddle;
//# sourceMappingURL=auto-ellipsis.js.map