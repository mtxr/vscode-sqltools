"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
var util_2 = require("./util");
var helper_1 = require("../../../util/helper");
// 根据数据点生成 Line 的两个关键点
function getLinePoints(pointInfo) {
    var x = pointInfo.x, y = pointInfo.y, y0 = pointInfo.y0;
    if ((0, util_1.isArray)(y)) {
        return y.map(function (yItem, idx) {
            return {
                x: (0, util_1.isArray)(x) ? x[idx] : x,
                y: yItem,
            };
        });
    }
    // 起始点从 y0 开始
    return [
        { x: x, y: y0 },
        { x: x, y: y },
    ];
}
(0, base_1.registerShape)('interval', 'line', {
    getPoints: function (shapePoint) {
        return getLinePoints(shapePoint);
    },
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, true, false, 'lineWidth');
        var newStyle = (0, helper_1.omit)(tslib_1.__assign({}, style), ['fill']);
        var path = this.parsePath((0, util_2.getRectPath)(cfg.points, false));
        var shape = container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, newStyle), { path: path }),
            name: 'interval',
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                return [
                    ['M', x, y - r],
                    ['L', x, y + r],
                ];
            },
            style: {
                r: 5,
                stroke: color,
            },
        };
    },
});
//# sourceMappingURL=line.js.map