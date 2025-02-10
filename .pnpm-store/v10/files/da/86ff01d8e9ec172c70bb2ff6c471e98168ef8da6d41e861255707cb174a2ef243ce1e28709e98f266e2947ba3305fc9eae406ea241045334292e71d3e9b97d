"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
// 根据数据点生成 tick shape 的 6 个关键点
function getTickPoints(pointInfo) {
    var _a;
    var x = pointInfo.x, y = pointInfo.y, y0 = pointInfo.y0, size = pointInfo.size;
    var yMin;
    var yMax;
    if ((0, util_1.isArray)(y)) {
        _a = tslib_1.__read(y, 2), yMin = _a[0], yMax = _a[1];
    }
    else {
        yMin = y0;
        yMax = y;
    }
    var xMax = x + size / 2;
    var xMin = x - size / 2;
    // tick 关键点顺序
    // 4 - 1 - 5
    //     |
    // 2 - 0 - 3
    return [
        { x: x, y: yMin },
        { x: x, y: yMax },
        { x: xMin, y: yMin },
        { x: xMax, y: yMin },
        { x: xMin, y: yMax },
        { x: xMax, y: yMax },
    ];
}
// 根据 tick 关键点绘制 path
function getTickPath(points) {
    return [
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y],
        ['M', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
        ['M', points[4].x, points[4].y],
        ['L', points[5].x, points[5].y],
    ];
}
/** I 形状柱状图，常用于 error bar chart */
(0, base_1.registerShape)('interval', 'tick', {
    getPoints: function (shapePoint) {
        return getTickPoints(shapePoint);
    },
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, true, false);
        var path = this.parsePath(getTickPath(cfg.points));
        var shape = container.addShape('path', {
            attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
            name: 'interval',
        });
        return shape;
    },
    getMarker: function (markerCfg) {
        var color = markerCfg.color;
        return {
            symbol: function (x, y, r) {
                return [
                    ['M', x - r / 2, y - r],
                    ['L', x + r / 2, y - r],
                    ['M', x, y - r],
                    ['L', x, y + r],
                    ['M', x - r / 2, y + r],
                    ['L', x + r / 2, y + r],
                ];
            },
            style: {
                r: 5,
                stroke: color,
            },
        };
    },
});
//# sourceMappingURL=tick.js.map