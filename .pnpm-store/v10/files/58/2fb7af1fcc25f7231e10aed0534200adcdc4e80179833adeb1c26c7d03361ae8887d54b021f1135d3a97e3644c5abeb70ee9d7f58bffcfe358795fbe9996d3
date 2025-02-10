import { filter } from '@antv/util';
/** 先引入brush 交互 */
import '../interactions/brush';
import { getInteractionCfg } from '../interactions/brush';
import { deepAssign } from '../utils';
var BRUSH_TYPES = ['brush', 'brush-x', 'brush-y', 'brush-highlight', 'brush-x-highlight', 'brush-y-highlight'];
/**
 * brush 交互
 */
export function brushInteraction(params) {
    var options = params.options;
    var brush = options.brush;
    // 先过滤掉 brush 等交互
    var interactions = filter(options.interactions || [], function (i) { return BRUSH_TYPES.indexOf(i.type) === -1; });
    // 设置 brush 交互
    if (brush === null || brush === void 0 ? void 0 : brush.enabled) {
        BRUSH_TYPES.forEach(function (type) {
            var enable = false;
            switch (brush.type) {
                case 'x-rect':
                    enable = type === (brush.action === 'highlight' ? 'brush-x-highlight' : 'brush-x');
                    break;
                case 'y-rect':
                    enable = type === (brush.action === 'highlight' ? 'brush-y-highlight' : 'brush-y');
                    break;
                default:
                    enable = type === (brush.action === 'highlight' ? 'brush-highlight' : 'brush');
                    break;
            }
            var obj = { type: type, enable: enable };
            if (brush) {
                obj.cfg = getInteractionCfg(type, brush.type, brush);
            }
            interactions.push(obj);
        });
        // 塞入 button 配置 (G2Plot 的封装)
        if ((brush === null || brush === void 0 ? void 0 : brush.action) !== 'highlight') {
            interactions.push({
                type: 'filter-action',
                cfg: {
                    buttonConfig: brush.button,
                },
            });
        }
    }
    return deepAssign({}, params, { options: { interactions: interactions } });
}
//# sourceMappingURL=brush.js.map