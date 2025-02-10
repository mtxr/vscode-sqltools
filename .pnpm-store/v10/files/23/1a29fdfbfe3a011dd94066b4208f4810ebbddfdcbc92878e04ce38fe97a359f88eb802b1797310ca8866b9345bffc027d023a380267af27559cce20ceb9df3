"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@antv/util");
var base_1 = require("../base");
var util_2 = require("./util");
var AreaShapeFactory = (0, base_1.registerShapeFactory)('area', {
    defaultShapeType: 'area',
    getDefaultPoints: function (pointInfo) {
        // area 基本标记的绘制需要获取上下两边的顶点
        var x = pointInfo.x, y0 = pointInfo.y0;
        var y = (0, util_1.isArray)(pointInfo.y) ? pointInfo.y : [y0, pointInfo.y];
        return y.map(function (yItem) {
            return {
                x: x,
                y: yItem,
            };
        });
    },
});
// Area 几何标记默认的 shape：填充的区域图
(0, base_1.registerShape)('area', 'area', {
    draw: function (cfg, container) {
        var attrs = (0, util_2.getShapeAttrs)(cfg, false, false, this);
        var shape = container.addShape({
            type: 'path',
            attrs: attrs,
            name: 'area',
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                if (r === void 0) { r = 5.5; }
                return [['M', x - r, y - 4], ['L', x + r, y - 4], ['L', x + r, y + 4], ['L', x - r, y + 4], ['Z']];
            },
            style: {
                r: 5,
                fill: color,
                fillOpacity: 1,
            },
        };
    },
});
exports.default = AreaShapeFactory;
//# sourceMappingURL=index.js.map