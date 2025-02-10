import { __extends } from "tslib";
import { head, last } from '@antv/util';
import MaskBase from './base';
export function getRegion(points) {
    return {
        start: head(points),
        end: last(points),
    };
}
/**
 * 添加图形
 * @param points
 * @returns
 */
export function getMaskAttrs(start, end) {
    var x = Math.min(start.x, end.x);
    var y = Math.min(start.y, end.y);
    var width = Math.abs(end.x - start.x);
    var height = Math.abs(end.y - start.y);
    return {
        x: x,
        y: y,
        width: width,
        height: height,
    };
}
/**
 * @ignore
 * 矩形的辅助框 Action
 */
var RectMask = /** @class */ (function (_super) {
    __extends(RectMask, _super);
    function RectMask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shapeType = 'rect';
        return _this;
    }
    RectMask.prototype.getRegion = function () {
        return getRegion(this.points);
    };
    RectMask.prototype.getMaskAttrs = function () {
        var _a = this.getRegion(), start = _a.start, end = _a.end;
        return getMaskAttrs(start, end);
    };
    return RectMask;
}(MaskBase));
export default RectMask;
//# sourceMappingURL=rect.js.map