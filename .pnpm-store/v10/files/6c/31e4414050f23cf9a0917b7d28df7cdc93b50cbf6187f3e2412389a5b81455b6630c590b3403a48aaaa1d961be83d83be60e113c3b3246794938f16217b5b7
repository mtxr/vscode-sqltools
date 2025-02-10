"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brushInteraction = void 0;
var util_1 = require("@antv/util");
/** 先引入brush 交互 */
require("../interactions/brush");
var brush_1 = require("../interactions/brush");
var utils_1 = require("../utils");
var BRUSH_TYPES = ['brush', 'brush-x', 'brush-y', 'brush-highlight', 'brush-x-highlight', 'brush-y-highlight'];
/**
 * brush 交互
 */
function brushInteraction(params) {
    var options = params.options;
    var brush = options.brush;
    // 先过滤掉 brush 等交互
    var interactions = (0, util_1.filter)(options.interactions || [], function (i) { return BRUSH_TYPES.indexOf(i.type) === -1; });
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
                obj.cfg = (0, brush_1.getInteractionCfg)(type, brush.type, brush);
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
    return (0, utils_1.deepAssign)({}, params, { options: { interactions: interactions } });
}
exports.brushInteraction = brushInteraction;
//# sourceMappingURL=brush.js.map