import { __extends } from "tslib";
import { last } from '@antv/util';
import { distance } from '../util';
import MaskBase from './base';
export function getMaskAttrs(points) {
    var currentPoint = last(points);
    var r = 0;
    var x = 0;
    var y = 0;
    if (points.length) {
        var first = points[0];
        r = distance(first, currentPoint) / 2;
        x = (currentPoint.x + first.x) / 2;
        y = (currentPoint.y + first.y) / 2;
    }
    return {
        x: x,
        y: y,
        r: r,
    };
}
/**
 * @ignore
 * 圆形辅助框 Action
 */
var CircleMask = /** @class */ (function (_super) {
    __extends(CircleMask, _super);
    function CircleMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shapeType = 'circle';
        return _this;
    }
    CircleMask.prototype.getMaskAttrs = function () {
        return getMaskAttrs(this.points);
    };
    return CircleMask;
}(MaskBase));
export default CircleMask;
//# sourceMappingURL=circle.js.map