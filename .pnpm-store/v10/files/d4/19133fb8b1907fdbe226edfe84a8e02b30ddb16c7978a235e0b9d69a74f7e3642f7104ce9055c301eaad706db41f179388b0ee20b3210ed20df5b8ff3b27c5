import { each, get, isArray } from '@antv/util';
import { doAnimate } from '../animate';
import { getReplaceAttrs } from '../util/graphics';
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
export function updateLabel(fromShape, toShape, cfg) {
    var data = cfg.data, origin = cfg.origin, animateCfg = cfg.animateCfg, coordinate = cfg.coordinate;
    var updateAnimateCfg = get(animateCfg, 'update');
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
            var newAttrs = getReplaceAttrs(fromChild, toChild);
            if (updateAnimateCfg) {
                doAnimate(fromChild, updateAnimateCfg, {
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
    each(toShape.getChildren(), function (child, idx) {
        if (isArray(fromShape.getChildren()) && idx >= fromShape.getCount()) {
            if (!child.destroyed) {
                fromShape.add(child);
            }
        }
    });
}
//# sourceMappingURL=update-label.js.map