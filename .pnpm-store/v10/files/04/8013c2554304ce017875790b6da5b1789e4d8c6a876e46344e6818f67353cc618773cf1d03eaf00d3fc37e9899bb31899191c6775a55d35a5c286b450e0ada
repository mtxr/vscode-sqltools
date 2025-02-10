import { __assign, __extends } from "tslib";
import { each } from '@antv/util';
import GridBase from './base';
function distance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Circle.prototype.getDefaultCfg = function () {
        var cfg = _super.prototype.getDefaultCfg.call(this);
        return __assign(__assign({}, cfg), { type: 'circle', 
            /**
             * 中心点
             * @type {object}
             */
            center: null, 
            /**
             * 栅格线是否封闭
             * @type {true}
             */
            closed: true });
    };
    Circle.prototype.getGridPath = function (points, reversed) {
        var lineType = this.getLineType();
        var closed = this.get('closed');
        var path = [];
        if (points.length) {
            // 防止出错
            if (lineType === 'circle') {
                var center = this.get('center');
                var firstPoint = points[0];
                var radius_1 = distance(center.x, center.y, firstPoint.x, firstPoint.y);
                var sweepFlag_1 = reversed ? 0 : 1; // 顺时针还是逆时针
                if (closed) {
                    // 封闭时，绘制整个圆
                    path.push(['M', center.x, center.y - radius_1]);
                    path.push(['A', radius_1, radius_1, 0, 0, sweepFlag_1, center.x, center.y + radius_1]);
                    path.push(['A', radius_1, radius_1, 0, 0, sweepFlag_1, center.x, center.y - radius_1]);
                    path.push(['Z']);
                }
                else {
                    each(points, function (point, index) {
                        if (index === 0) {
                            path.push(['M', point.x, point.y]);
                        }
                        else {
                            path.push(['A', radius_1, radius_1, 0, 0, sweepFlag_1, point.x, point.y]);
                        }
                    });
                }
            }
            else {
                each(points, function (point, index) {
                    if (index === 0) {
                        path.push(['M', point.x, point.y]);
                    }
                    else {
                        path.push(['L', point.x, point.y]);
                    }
                });
                if (closed) {
                    path.push(['Z']);
                }
            }
        }
        return path;
    };
    return Circle;
}(GridBase));
export default Circle;
//# sourceMappingURL=circle.js.map