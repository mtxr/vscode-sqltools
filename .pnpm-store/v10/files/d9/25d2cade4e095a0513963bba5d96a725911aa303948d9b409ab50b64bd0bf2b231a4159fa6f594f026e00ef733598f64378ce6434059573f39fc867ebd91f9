"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var path_util_1 = require("@antv/path-util");
var utils_1 = require("../../utils");
var constant_1 = require("./constant");
/**
 * 获取填充属性
 * @param cfg 图形绘制数据
 */
function getFillAttrs(cfg) {
    // style.fill 优先级更高
    return (0, utils_1.deepAssign)({}, cfg.defaultStyle, { fill: cfg.color }, cfg.style);
}
(0, g2_1.registerShape)('schema', 'venn', {
    draw: function (cfg, container) {
        var data = cfg.data;
        var segments = (0, path_util_1.parsePathString)(data[constant_1.PATH_FIELD]);
        var fillAttrs = getFillAttrs(cfg);
        var group = container.addGroup({ name: 'venn-shape' });
        group.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, fillAttrs), { path: segments }),
            name: 'venn-path',
        });
        var _a = cfg.customInfo, offsetX = _a.offsetX, offsetY = _a.offsetY;
        var matrix = g2_1.Util.transform(null, [['t', offsetX, offsetY]]);
        group.setMatrix(matrix);
        return group;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: 'circle',
            style: {
                lineWidth: 0,
                stroke: color,
                fill: color,
                r: 4,
            },
        };
    },
});
//# sourceMappingURL=shape.js.map