import { __assign } from "tslib";
import { isFunction } from '@antv/util';
import { getCoordinateClipCfg } from '../../util/coordinate';
/**
 * @ignore
 * 整体动画
 * 划入入场动画效果
 * @todo 放两张直角坐标系和极坐标系的图
 * @param element 参与动画的图形元素
 * @param animateCfg 动画配置
 * @param cfg 额外信息
 */
export function waveIn(element, animateCfg, cfg) {
    var _a = getCoordinateClipCfg(cfg.coordinate, 20), type = _a.type, startState = _a.startState, endState = _a.endState; // 根据坐标系类型获取整体的剪切区域配置信息
    var clipShape = element.setClip({
        type: type,
        attrs: startState,
    }); // 为 shape 设置剪切区域
    // 更新 动画 获取了 toAttrs 需要重新更新上去
    if (cfg.toAttrs) {
        element.attr(cfg.toAttrs);
    }
    // 对剪切图形做动画
    clipShape.animate(endState, __assign(__assign({}, animateCfg), { callback: function () {
            if (element && !element.get('destroyed')) {
                element.set('clipShape', null);
            }
            clipShape.remove(true); // 动画结束需要将剪切图形销毁
            isFunction(animateCfg.callback) && animateCfg.callback();
        } }));
}
//# sourceMappingURL=wave-in.js.map