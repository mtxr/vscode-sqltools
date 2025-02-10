"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLabel = void 0;
var util_1 = require("@antv/util");
var animate_1 = require("../animate");
var graphics_1 = require("../util/graphics");
/**
 * @desc 更新 label (目前没有根据 id 索引，还是会存在一点小问题的，只能根据 idx 索引)
 * @done shape 属性更新
 * @done shape delete
 * @done shape append
 *
 * @param fromShape old labelShape
 * @param toShape new labelShape
 * @param cfg
 */
function updateLabel(fromShape, toShape, cfg) {
    var data = cfg.data, origin = cfg.origin, animateCfg = cfg.animateCfg, coordinate = cfg.coordinate;
    var updateAnimateCfg = (0, util_1.get)(animateCfg, 'update');
    fromShape.set('data', data);
    fromShape.set('origin', origin);
    fromShape.set('animateCfg', animateCfg);
    fromShape.set('coordinate', coordinate);
    fromShape.set('visible', toShape.get('visible'));
    (fromShape.getChildren() || []).forEach(function (fromChild, idx) {
        var toChild = toShape.getChildByIndex(idx);
        if (!toChild) {
            fromShape.removeChild(fromChild);
            fromChild.remove(true);
        }
        else {
            fromChild.set('data', data);
            fromChild.set('origin', origin);
            fromChild.set('animateCfg', animateCfg);
            fromChild.set('coordinate', coordinate);
            var newAttrs = (0, graphics_1.getReplaceAttrs)(fromChild, toChild);
            if (updateAnimateCfg) {
                (0, animate_1.doAnimate)(fromChild, updateAnimateCfg, {
                    toAttrs: newAttrs,
                    coordinate: coordinate,
                });
            }
            else {
                fromChild.attr(newAttrs);
            }
            if (toChild.isGroup()) {
                updateLabel(fromChild, toChild, cfg);
            }
        }
    });
    // append
    (0, util_1.each)(toShape.getChildren(), function (child, idx) {
        if ((0, util_1.isArray)(fromShape.getChildren()) && idx >= fromShape.getCount()) {
            if (!child.destroyed) {
                fromShape.add(child);
            }
        }
    });
}
exports.updateLabel = updateLabel;
//# sourceMappingURL=update-label.js.map