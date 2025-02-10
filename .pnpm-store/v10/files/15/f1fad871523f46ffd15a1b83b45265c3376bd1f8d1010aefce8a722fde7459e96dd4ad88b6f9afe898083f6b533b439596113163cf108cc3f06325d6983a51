"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInteractionCfg = void 0;
var g2_1 = require("@antv/g2");
var reset_button_1 = require("./actions/reset-button");
(0, g2_1.registerAction)('brush-reset-button', reset_button_1.ButtonAction, {
    name: 'brush-reset-button',
});
(0, g2_1.registerInteraction)('filter-action', {});
/**
 * G2 已经内置了 brush、brush-x、brush-y 等交互，其它：
 *
 * 1. element-range-highlight 是否可用重命名为 brush-highlight？(mask 可以移动)
 * 2. brush-visible 与 brush 的区别是？
 */
function isPointInView(context) {
    return context.isInPlot();
}
/**
 * 获取 交互 start 阶段的相关配置
 */
function getInteractionCfg(interactionType, brushType, options) {
    var _a = options || {}, mask = _a.mask, isStartEnable = _a.isStartEnable;
    var maskType = brushType || 'rect';
    switch (interactionType) {
        case 'brush':
            return {
                showEnable: [
                    { trigger: 'plot:mouseenter', action: 'cursor:crosshair', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'plot:mouseleave', action: 'cursor:default' },
                ],
                start: [
                    {
                        trigger: 'mousedown',
                        isEnable: isStartEnable || isPointInView,
                        action: ['brush:start', "".concat(maskType, "-mask:start"), "".concat(maskType, "-mask:show")],
                        // 对应第二个action的参数
                        arg: [null, { maskStyle: mask === null || mask === void 0 ? void 0 : mask.style }],
                    },
                ],
                processing: [
                    {
                        trigger: 'mousemove',
                        isEnable: isPointInView,
                        action: ["".concat(maskType, "-mask:resize")],
                    },
                ],
                end: [
                    {
                        trigger: 'mouseup',
                        isEnable: isPointInView,
                        action: [
                            'brush:filter',
                            'brush:end',
                            "".concat(maskType, "-mask:end"),
                            "".concat(maskType, "-mask:hide"),
                            'brush-reset-button:show',
                        ],
                    },
                ],
                rollback: [
                    {
                        trigger: 'brush-reset-button:click',
                        action: ['brush:reset', 'brush-reset-button:hide', 'cursor:crosshair'],
                    },
                ],
            };
        case 'brush-highlight':
            return {
                showEnable: [
                    { trigger: 'plot:mouseenter', action: 'cursor:crosshair', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'plot:mousemove', action: 'cursor:crosshair', isEnable: isStartEnable || (function () { return true; }) },
                    {
                        trigger: 'plot:mousemove',
                        action: 'cursor:default',
                        isEnable: function (context) { return (isStartEnable ? !isStartEnable(context) : false); },
                    },
                    { trigger: 'mask:mouseenter', action: 'cursor:move', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'plot:mouseleave', action: 'cursor:default' },
                    { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
                ],
                start: [
                    {
                        trigger: 'plot:mousedown',
                        isEnable: isStartEnable ||
                            (function (context) {
                                // 不要点击在 mask 上重新开始
                                return !context.isInShape('mask');
                            }),
                        action: ["".concat(maskType, "-mask:start"), "".concat(maskType, "-mask:show")],
                        // 对应第 1 个action的参数
                        arg: [{ maskStyle: mask === null || mask === void 0 ? void 0 : mask.style }],
                    },
                    {
                        trigger: 'mask:dragstart',
                        action: ["".concat(maskType, "-mask:moveStart")],
                    },
                ],
                processing: [
                    {
                        trigger: 'plot:mousemove',
                        action: ["".concat(maskType, "-mask:resize")],
                    },
                    {
                        trigger: 'mask:drag',
                        action: ["".concat(maskType, "-mask:move")],
                    },
                    {
                        trigger: 'mask:change',
                        action: ['element-range-highlight:highlight'],
                    },
                ],
                end: [
                    { trigger: 'plot:mouseup', action: ["".concat(maskType, "-mask:end")] },
                    { trigger: 'mask:dragend', action: ["".concat(maskType, "-mask:moveEnd")] },
                    {
                        trigger: 'document:mouseup',
                        isEnable: function (context) {
                            return !context.isInPlot();
                        },
                        action: ['element-range-highlight:clear', "".concat(maskType, "-mask:end"), "".concat(maskType, "-mask:hide")],
                    },
                ],
                rollback: [{ trigger: 'dblclick', action: ['element-range-highlight:clear', "".concat(maskType, "-mask:hide")] }],
            };
        case 'brush-x':
            return {
                showEnable: [
                    { trigger: 'plot:mouseenter', action: 'cursor:crosshair', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'plot:mouseleave', action: 'cursor:default' },
                ],
                start: [
                    {
                        trigger: 'mousedown',
                        isEnable: isStartEnable || isPointInView,
                        action: ['brush-x:start', "".concat(maskType, "-mask:start"), "".concat(maskType, "-mask:show")],
                        // 对应第二个action的参数
                        arg: [null, { maskStyle: mask === null || mask === void 0 ? void 0 : mask.style }],
                    },
                ],
                processing: [
                    {
                        trigger: 'mousemove',
                        isEnable: isPointInView,
                        action: ["".concat(maskType, "-mask:resize")],
                    },
                ],
                end: [
                    {
                        trigger: 'mouseup',
                        isEnable: isPointInView,
                        action: ['brush-x:filter', 'brush-x:end', "".concat(maskType, "-mask:end"), "".concat(maskType, "-mask:hide")],
                    },
                ],
                rollback: [{ trigger: 'dblclick', action: ['brush-x:reset'] }],
            };
        case 'brush-x-highlight':
            return {
                showEnable: [
                    { trigger: 'plot:mouseenter', action: 'cursor:crosshair', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'mask:mouseenter', action: 'cursor:move', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'plot:mouseleave', action: 'cursor:default' },
                    { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
                ],
                start: [
                    {
                        trigger: 'plot:mousedown',
                        isEnable: isStartEnable ||
                            (function (context) {
                                // 不要点击在 mask 上重新开始
                                return !context.isInShape('mask');
                            }),
                        action: ["".concat(maskType, "-mask:start"), "".concat(maskType, "-mask:show")],
                        // 对应第 1 个action的参数
                        arg: [{ maskStyle: mask === null || mask === void 0 ? void 0 : mask.style }],
                    },
                    {
                        trigger: 'mask:dragstart',
                        action: ["".concat(maskType, "-mask:moveStart")],
                    },
                ],
                processing: [
                    {
                        trigger: 'plot:mousemove',
                        action: ["".concat(maskType, "-mask:resize")],
                    },
                    {
                        trigger: 'mask:drag',
                        action: ["".concat(maskType, "-mask:move")],
                    },
                    {
                        trigger: 'mask:change',
                        action: ['element-range-highlight:highlight'],
                    },
                ],
                end: [
                    { trigger: 'plot:mouseup', action: ["".concat(maskType, "-mask:end")] },
                    { trigger: 'mask:dragend', action: ["".concat(maskType, "-mask:moveEnd")] },
                    {
                        trigger: 'document:mouseup',
                        isEnable: function (context) {
                            return !context.isInPlot();
                        },
                        action: ['element-range-highlight:clear', "".concat(maskType, "-mask:end"), "".concat(maskType, "-mask:hide")],
                    },
                ],
                rollback: [{ trigger: 'dblclick', action: ['element-range-highlight:clear', "".concat(maskType, "-mask:hide")] }],
            };
        case 'brush-y':
            return {
                showEnable: [
                    { trigger: 'plot:mouseenter', action: 'cursor:crosshair', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'plot:mouseleave', action: 'cursor:default' },
                ],
                start: [
                    {
                        trigger: 'mousedown',
                        isEnable: isStartEnable || isPointInView,
                        action: ['brush-y:start', "".concat(maskType, "-mask:start"), "".concat(maskType, "-mask:show")],
                        // 对应第二个action的参数
                        arg: [null, { maskStyle: mask === null || mask === void 0 ? void 0 : mask.style }],
                    },
                ],
                processing: [
                    {
                        trigger: 'mousemove',
                        isEnable: isPointInView,
                        action: ["".concat(maskType, "-mask:resize")],
                    },
                ],
                end: [
                    {
                        trigger: 'mouseup',
                        isEnable: isPointInView,
                        action: ['brush-y:filter', 'brush-y:end', "".concat(maskType, "-mask:end"), "".concat(maskType, "-mask:hide")],
                    },
                ],
                rollback: [{ trigger: 'dblclick', action: ['brush-y:reset'] }],
            };
        case 'brush-y-highlight':
            return {
                showEnable: [
                    { trigger: 'plot:mouseenter', action: 'cursor:crosshair', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'mask:mouseenter', action: 'cursor:move', isEnable: isStartEnable || (function () { return true; }) },
                    { trigger: 'plot:mouseleave', action: 'cursor:default' },
                    { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
                ],
                start: [
                    {
                        trigger: 'plot:mousedown',
                        isEnable: isStartEnable ||
                            (function (context) {
                                // 不要点击在 mask 上重新开始
                                return !context.isInShape('mask');
                            }),
                        action: ["".concat(maskType, "-mask:start"), "".concat(maskType, "-mask:show")],
                        // 对应第 1 个action的参数
                        arg: [{ maskStyle: mask === null || mask === void 0 ? void 0 : mask.style }],
                    },
                    {
                        trigger: 'mask:dragstart',
                        action: ["".concat(maskType, "-mask:moveStart")],
                    },
                ],
                processing: [
                    {
                        trigger: 'plot:mousemove',
                        action: ["".concat(maskType, "-mask:resize")],
                    },
                    {
                        trigger: 'mask:drag',
                        action: ["".concat(maskType, "-mask:move")],
                    },
                    {
                        trigger: 'mask:change',
                        action: ['element-range-highlight:highlight'],
                    },
                ],
                end: [
                    { trigger: 'plot:mouseup', action: ["".concat(maskType, "-mask:end")] },
                    { trigger: 'mask:dragend', action: ["".concat(maskType, "-mask:moveEnd")] },
                    {
                        trigger: 'document:mouseup',
                        isEnable: function (context) {
                            return !context.isInPlot();
                        },
                        action: ['element-range-highlight:clear', "".concat(maskType, "-mask:end"), "".concat(maskType, "-mask:hide")],
                    },
                ],
                rollback: [{ trigger: 'dblclick', action: ['element-range-highlight:clear', "".concat(maskType, "-mask:hide")] }],
            };
        default:
            return {};
    }
}
exports.getInteractionCfg = getInteractionCfg;
// 直接拷贝过来的
(0, g2_1.registerInteraction)('brush', getInteractionCfg('brush'));
// 复写 element-range-highlight interaction
(0, g2_1.registerInteraction)('brush-highlight', getInteractionCfg('brush-highlight'));
// 复写
(0, g2_1.registerInteraction)('brush-x', getInteractionCfg('brush-x', 'x-rect'));
// 复写
(0, g2_1.registerInteraction)('brush-y', getInteractionCfg('brush-y', 'y-rect'));
// 新增, x 框选高亮
(0, g2_1.registerInteraction)('brush-x-highlight', getInteractionCfg('brush-x-highlight', 'x-rect'));
// 新增, y 框选高亮
(0, g2_1.registerInteraction)('brush-y-highlight', getInteractionCfg('brush-y-highlight', 'y-rect'));
//# sourceMappingURL=brush.js.map