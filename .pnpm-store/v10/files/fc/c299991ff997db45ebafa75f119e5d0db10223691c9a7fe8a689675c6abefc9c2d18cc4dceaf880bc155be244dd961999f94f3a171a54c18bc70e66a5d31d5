"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideOverlap = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var collision_detect_1 = require("../../../util/collision-detect");
var util_2 = require("../util");
var createWorker_1 = require("../util/createWorker");
var hide_overlap_1 = require("./worker/hide-overlap");
var layout = function (items) {
    var boxes = items.slice();
    for (var i = 0; i < boxes.length; i++) {
        var box1 = boxes[i];
        if (box1.visible) {
            for (var j = i + 1; j < boxes.length; j++) {
                var box2 = boxes[j];
                if (box1 !== box2 && box2.visible) {
                    if ((0, collision_detect_1.intersect)(box1, box2)) {
                        box2.visible = false;
                    }
                }
            }
        }
    }
    return boxes;
};
var cache = new Map();
var worker = (0, createWorker_1.createWorker)(hide_overlap_1.code);
/**
 * label 防遮挡布局：在不改变 label 位置的情况下对相互重叠的 label 进行隐藏（非移除）
 * 不同于 'overlap' 类型的布局，该布局不会对 label 的位置进行偏移调整。
 * @param labels 参与布局调整的 label 数组集合
 */
function hideOverlap(labelItems, labels, shapes, region) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var boxes, memoKey, cb, params, res, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    boxes = labels.map(function (d, idx) { return (tslib_1.__assign(tslib_1.__assign({}, (0, util_2.getLabelBackgroundInfo)(d, labelItems[idx], (0, util_1.get)(labelItems[idx], 'background.padding'))), { visible: true })); });
                    memoKey = JSON.stringify(boxes);
                    cb = function (items) {
                        cache.set(memoKey, items);
                        (0, util_1.each)(items, function (_a, idx) {
                            var visible = _a.visible;
                            var labelShape = labels[idx];
                            if (visible) {
                                labelShape === null || labelShape === void 0 ? void 0 : labelShape.show();
                            }
                            else {
                                labelShape === null || labelShape === void 0 ? void 0 : labelShape.hide();
                            }
                        });
                        return items;
                    };
                    if (!cache.get(memoKey)) return [3 /*break*/, 1];
                    cb(cache.get(memoKey));
                    return [3 /*break*/, 7];
                case 1:
                    if (!worker) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    params = JSON.stringify({ type: 'hide-overlap', items: boxes });
                    return [4 /*yield*/, worker.post(params, function () { return cb(layout(boxes)); })];
                case 3:
                    res = _a.sent();
                    cb(Array.isArray(res.data) ? res.data : []);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error(e_1);
                    cb(layout(boxes));
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    // Normal layout in main thread.
                    cb(layout(boxes));
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.hideOverlap = hideOverlap;
//# sourceMappingURL=hide-overlap.js.map