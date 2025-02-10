import { __assign, __extends } from "tslib";
import { get, deepMix, isArray } from '@antv/util';
import GeometryLabel from './base';
/**
 * 柱状图 label
 */
var IntervalLabel = /** @class */ (function (_super) {
    __extends(IntervalLabel, _super);
    function IntervalLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 获取 interval label 的方向，取决于 value 的值是正还是负
     * @param labelCfg
     */
    IntervalLabel.prototype.getLabelValueDir = function (mappingData) {
        // points 中的 x/y 和 transpose 无关
        var dim = 'y';
        var points = mappingData.points;
        return points[0][dim] <= points[2][dim] ? 1 : -1;
    };
    /**
     * 重载：根据 interval 值的正负来调整 label 偏移量
     * @param labelCfg
     * @param index
     * @param total
     */
    IntervalLabel.prototype.getLabelOffsetPoint = function (labelCfg, index, total, position) {
        var _a;
        var point = _super.prototype.getLabelOffsetPoint.call(this, labelCfg, index, total);
        var coordinate = this.getCoordinate();
        var transposed = coordinate.isTransposed;
        var dim = transposed ? 'x' : 'y';
        var dir = this.getLabelValueDir(labelCfg.mappingData);
        point = __assign(__assign({}, point), (_a = {}, _a[dim] = point[dim] * dir, _a));
        if (coordinate.isReflect('x')) {
            point = __assign(__assign({}, point), { x: point.x * -1 });
        }
        if (coordinate.isReflect('y')) {
            point = __assign(__assign({}, point), { y: point.y * -1 });
        }
        return point;
    };
    /**
     * 重载：定制 interval label 的默认主题配置
     * @param labelCfg
     */
    IntervalLabel.prototype.getThemedLabelCfg = function (labelCfg) {
        var geometry = this.geometry;
        var defaultLabelCfg = this.getDefaultLabelCfg();
        var theme = geometry.theme;
        // 如果 interval label position 设置为 middle，则将主题中的 offset 覆盖为 0
        return deepMix({}, defaultLabelCfg, theme.labels, labelCfg.position === 'middle' ? { offset: 0 } : {}, labelCfg);
    };
    IntervalLabel.prototype.setLabelPosition = function (labelPointCfg, mappingData, index, position) {
        var coordinate = this.getCoordinate();
        var transposed = coordinate.isTransposed;
        var shapePoints = mappingData.points;
        var point0 = coordinate.convert(shapePoints[0]);
        var point2 = coordinate.convert(shapePoints[2]);
        var dir = this.getLabelValueDir(mappingData);
        var top;
        var right;
        var bottom;
        var left;
        var shape = isArray(mappingData.shape) ? mappingData.shape[0] : mappingData.shape;
        if (shape === 'funnel' || shape === 'pyramid') {
            // 处理漏斗图
            var nextPoints = get(mappingData, 'nextPoints');
            var points = get(mappingData, 'points');
            if (nextPoints) {
                // 非漏斗图底部
                var p0 = coordinate.convert(points[0]);
                var p1 = coordinate.convert(points[1]);
                var nextP0 = coordinate.convert(nextPoints[0]);
                var nextP1 = coordinate.convert(nextPoints[1]);
                // TODO: 使用包围盒的计算方法
                if (transposed) {
                    top = Math.min(nextP0.y, p0.y);
                    bottom = Math.max(nextP0.y, p0.y);
                    right = (p1.x + nextP1.x) / 2;
                    left = (p0.x + nextP0.x) / 2;
                }
                else {
                    top = Math.min((p1.y + nextP1.y) / 2, (p0.y + nextP0.y) / 2);
                    bottom = Math.max((p1.y + nextP1.y) / 2, (p0.y + nextP0.y) / 2);
                    right = nextP1.x;
                    left = p0.x;
                }
            }
            else {
                top = Math.min(point2.y, point0.y);
                bottom = Math.max(point2.y, point0.y);
                right = point2.x;
                left = point0.x;
            }
        }
        else {
            top = Math.min(point2.y, point0.y);
            bottom = Math.max(point2.y, point0.y);
            right = point2.x;
            left = point0.x;
        }
        switch (position) {
            case 'right':
                labelPointCfg.x = right;
                labelPointCfg.y = (top + bottom) / 2;
                labelPointCfg.textAlign = get(labelPointCfg, 'textAlign', dir > 0 ? 'left' : 'right');
                break;
            case 'left':
                labelPointCfg.x = left;
                labelPointCfg.y = (top + bottom) / 2;
                labelPointCfg.textAlign = get(labelPointCfg, 'textAlign', dir > 0 ? 'left' : 'right');
                break;
            case 'bottom':
                if (transposed) {
                    labelPointCfg.x = (right + left) / 2;
                }
                labelPointCfg.y = bottom;
                labelPointCfg.textAlign = get(labelPointCfg, 'textAlign', 'center');
                labelPointCfg.textBaseline = get(labelPointCfg, 'textBaseline', dir > 0 ? 'bottom' : 'top');
                break;
            case 'middle':
                if (transposed) {
                    labelPointCfg.x = (right + left) / 2;
                }
                labelPointCfg.y = (top + bottom) / 2;
                labelPointCfg.textAlign = get(labelPointCfg, 'textAlign', 'center');
                labelPointCfg.textBaseline = get(labelPointCfg, 'textBaseline', 'middle');
                break;
            case 'top':
                if (transposed) {
                    labelPointCfg.x = (right + left) / 2;
                }
                labelPointCfg.y = top;
                labelPointCfg.textAlign = get(labelPointCfg, 'textAlign', 'center');
                labelPointCfg.textBaseline = get(labelPointCfg, 'textBaseline', dir > 0 ? 'bottom' : 'top');
                break;
            default:
                break;
        }
    };
    return IntervalLabel;
}(GeometryLabel));
export default IntervalLabel;
//# sourceMappingURL=interval.js.map