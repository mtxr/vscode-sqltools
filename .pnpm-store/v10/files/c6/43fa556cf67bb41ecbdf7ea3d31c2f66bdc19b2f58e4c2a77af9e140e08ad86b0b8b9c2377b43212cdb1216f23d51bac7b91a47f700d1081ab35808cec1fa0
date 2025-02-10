"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var graphics_1 = require("../../../util/graphics");
var base_1 = require("../base");
var get_style_1 = require("../util/get-style");
var util_1 = require("./util");
function getArcShapePath(from, to, center) {
    var sub = (0, util_1.getQPath)(to, center);
    var path = [['M', from.x, from.y]];
    path.push(sub);
    return path;
}
function getArcShapeWeightPath(points, center) {
    var arc1 = (0, util_1.getQPath)(points[1], center);
    var arc2 = (0, util_1.getQPath)(points[3], center);
    var path = [['M', points[0].x, points[0].y]];
    path.push(arc2);
    path.push(['L', points[3].x, points[3].y]);
    path.push(['L', points[2].x, points[2].y]);
    path.push(arc1);
    path.push(['L', points[1].x, points[1].y]);
    path.push(['L', points[0].x, points[0].y]);
    path.push(['Z']);
    return path;
}
// 弧线包括笛卡尔坐标系下的半圆弧线、极坐标系下以圆心为控制点的二阶曲线、笛卡尔坐标系下带权重的三阶曲线、极坐标系下带权重的以圆心为控制点的二阶曲线
(0, base_1.registerShape)('edge', 'arc', {
    draw: function (cfg, container) {
        var style = (0, get_style_1.getStyle)(cfg, true, false, 'lineWidth');
        var points = cfg.points;
        var type = points.length > 2 ? 'weight' : 'normal';
        var path;
        if (cfg.isInCircle) {
            var center = { x: 0, y: 1 };
            if (type === 'normal') {
                path = getArcShapePath(points[0], points[1], center);
            }
            else {
                style.fill = style.stroke;
                path = getArcShapeWeightPath(points, center);
            }
            path = this.parsePath(path);
            return container.addShape('path', {
                attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
            });
        }
        else {
            if (type === 'normal') {
                points = this.parsePoints(points);
                path = (0, graphics_1.getArcPath)((points[1].x + points[0].x) / 2, points[0].y, Math.abs(points[1].x - points[0].x) / 2, Math.PI, Math.PI * 2);
                return container.addShape('path', {
                    attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
                });
            }
            else {
                var c1 = (0, util_1.getCPath)(points[1], points[3]);
                var c2 = (0, util_1.getCPath)(points[2], points[0]);
                path = [
                    ['M', points[0].x, points[0].y],
                    ['L', points[1].x, points[1].y],
                    c1,
                    ['L', points[3].x, points[3].y],
                    ['L', points[2].x, points[2].y],
                    c2,
                    ['Z'],
                ];
                path = this.parsePath(path);
                style.fill = style.stroke;
                return container.addShape('path', {
                    attrs: tslib_1.__assign(tslib_1.__assign({}, style), { path: path }),
                });
            }
        }
    },
    getMarker: function (markerCfg) {
        return {
            symbol: 'circle',
            style: {
                r: 4.5,
                fill: markerCfg.color,
            },
        };
    },
});
//# sourceMappingURL=arc.js.map