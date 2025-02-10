import { __assign, __extends } from "tslib";
import { Cubic as CubicUtil } from '@antv/g-math';
import { each, isNil } from '@antv/util';
import ShapeBase from './base';
import { path2Absolute, path2Segments } from '@antv/path-util';
import { drawPath } from '../util/draw';
import isPointInPath from '../util/in-path/point-in-path';
import isInPolygon from '../util/in-path/polygon';
import PathUtil from '../util/path';
import * as ArrowUtil from '../util/arrow';
// 是否在多个多边形内部
function isInPolygons(polygons, x, y) {
    var isHit = false;
    for (var i = 0; i < polygons.length; i++) {
        var points = polygons[i];
        isHit = isInPolygon(points, x, y);
        if (isHit) {
            break;
        }
    }
    return isHit;
}
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Path.prototype.getDefaultAttrs = function () {
        var attrs = _super.prototype.getDefaultAttrs.call(this);
        return __assign(__assign({}, attrs), { startArrow: false, endArrow: false });
    };
    Path.prototype.initAttrs = function (attrs) {
        this._setPathArr(attrs.path);
        this.setArrow();
    };
    // 更新属性时，检测是否更改了 path
    Path.prototype.onAttrChange = function (name, value, originValue) {
        _super.prototype.onAttrChange.call(this, name, value, originValue);
        if (name === 'path') {
            this._setPathArr(value);
        }
        // 由于箭头的绘制依赖于 line 的诸多 attrs，因此这里不再对每个 attr 进行判断，attr 每次变化都会影响箭头的更新
        this.setArrow();
    };
    // 将 path 转换成绝对路径
    Path.prototype._setPathArr = function (path) {
        // 转换 path 的格式
        this.attrs.path = path2Absolute(path);
        var hasArc = PathUtil.hasArc(path);
        // 为了加速 path 的绘制、拾取和计算，这个地方可以缓存很多东西
        // 这些缓存都是第一次需要时计算和存储，虽然增加了复杂度，但是频繁调用的方法，性能有很大提升
        this.set('hasArc', hasArc);
        this.set('paramsCache', {}); // 清理缓存
        this.set('segments', null); // 延迟生成 path，在动画场景下可能不会有拾取
        this.set('curve', null);
        this.set('tCache', null);
        this.set('totalLength', null);
    };
    Path.prototype.getSegments = function () {
        var segments = this.get('segements');
        if (!segments) {
            segments = path2Segments(this.attr('path'));
            this.set('segments', segments);
        }
        return segments;
    };
    Path.prototype.setArrow = function () {
        var attrs = this.attr();
        var startArrow = attrs.startArrow, endArrow = attrs.endArrow;
        if (startArrow) {
            var tangent = this.getStartTangent();
            ArrowUtil.addStartArrow(this, attrs, tangent[0][0], tangent[0][1], tangent[1][0], tangent[1][1]);
        }
        if (endArrow) {
            var tangent = this.getEndTangent();
            ArrowUtil.addEndArrow(this, attrs, tangent[0][0], tangent[0][1], tangent[1][0], tangent[1][1]);
        }
    };
    Path.prototype.isInStrokeOrPath = function (x, y, isStroke, isFill, lineWidth) {
        var segments = this.getSegments();
        var hasArc = this.get('hasArc');
        var isHit = false;
        if (isStroke) {
            var length_1 = this.getTotalLength();
            isHit = PathUtil.isPointInStroke(segments, lineWidth, x, y, length_1);
        }
        if (!isHit && isFill) {
            if (hasArc) {
                // 存在曲线时，暂时使用 canvas 的 api 计算，后续可以进行多边形切割
                isHit = isPointInPath(this, x, y);
            }
            else {
                var path = this.attr('path');
                var extractResutl = PathUtil.extractPolygons(path);
                // 提取出来的多边形包含闭合的和非闭合的，在这里统一按照多边形处理
                isHit = isInPolygons(extractResutl.polygons, x, y) || isInPolygons(extractResutl.polylines, x, y);
            }
        }
        return isHit;
    };
    Path.prototype.createPath = function (context) {
        var attrs = this.attr();
        var paramsCache = this.get('paramsCache'); // 由于计算圆弧的参数成本很大，所以要缓存
        drawPath(this, context, attrs, paramsCache);
    };
    Path.prototype.afterDrawPath = function (context) {
        var startArrowShape = this.get('startArrowShape');
        var endArrowShape = this.get('endArrowShape');
        if (startArrowShape) {
            startArrowShape.draw(context);
        }
        if (endArrowShape) {
            endArrowShape.draw(context);
        }
    };
    /**
     * Get total length of path
     * @return {number} length
     */
    Path.prototype.getTotalLength = function () {
        var totalLength = this.get('totalLength');
        if (!isNil(totalLength)) {
            return totalLength;
        }
        this._calculateCurve();
        this._setTcache();
        return this.get('totalLength');
    };
    /**
     * Get point according to ratio
     * @param {number} ratio
     * @return {Point} point
     */
    Path.prototype.getPoint = function (ratio) {
        var tCache = this.get('tCache');
        if (!tCache) {
            this._calculateCurve();
            this._setTcache();
            tCache = this.get('tCache');
        }
        var subt;
        var index;
        var curve = this.get('curve');
        if (!tCache || tCache.length === 0) {
            if (curve) {
                return {
                    x: curve[0][1],
                    y: curve[0][2],
                };
            }
            return null;
        }
        each(tCache, function (v, i) {
            if (ratio >= v[0] && ratio <= v[1]) {
                subt = (ratio - v[0]) / (v[1] - v[0]);
                index = i;
            }
        });
        var seg = curve[index];
        if (isNil(seg) || isNil(index)) {
            return null;
        }
        var l = seg.length;
        var nextSeg = curve[index + 1];
        return CubicUtil.pointAt(seg[l - 2], seg[l - 1], nextSeg[1], nextSeg[2], nextSeg[3], nextSeg[4], nextSeg[5], nextSeg[6], subt);
    };
    Path.prototype._calculateCurve = function () {
        var path = this.attr().path;
        this.set('curve', PathUtil.pathToCurve(path));
    };
    Path.prototype._setTcache = function () {
        var totalLength = 0;
        var tempLength = 0;
        // 每段 curve 对应起止点的长度比例列表，形如: [[0, 0.25], [0.25, 0.6]. [0.6, 0.9], [0.9, 1]]
        var tCache = [];
        var segmentT;
        var segmentL;
        var segmentN;
        var l;
        var curve = this.get('curve');
        if (!curve) {
            return;
        }
        each(curve, function (segment, i) {
            segmentN = curve[i + 1];
            l = segment.length;
            if (segmentN) {
                totalLength +=
                    CubicUtil.length(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]) || 0;
            }
        });
        this.set('totalLength', totalLength);
        if (totalLength === 0) {
            this.set('tCache', []);
            return;
        }
        each(curve, function (segment, i) {
            segmentN = curve[i + 1];
            l = segment.length;
            if (segmentN) {
                segmentT = [];
                segmentT[0] = tempLength / totalLength;
                segmentL = CubicUtil.length(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]);
                // 当 path 不连续时，segmentL 可能为空，为空时需要作为 0 处理
                tempLength += segmentL || 0;
                segmentT[1] = tempLength / totalLength;
                tCache.push(segmentT);
            }
        });
        this.set('tCache', tCache);
    };
    /**
     * Get start tangent vector
     * @return {Array}
     */
    Path.prototype.getStartTangent = function () {
        var segments = this.getSegments();
        var result;
        if (segments.length > 1) {
            var startPoint = segments[0].currentPoint;
            var endPoint = segments[1].currentPoint;
            var tangent = segments[1].startTangent;
            result = [];
            if (tangent) {
                result.push([startPoint[0] - tangent[0], startPoint[1] - tangent[1]]);
                result.push([startPoint[0], startPoint[1]]);
            }
            else {
                result.push([endPoint[0], endPoint[1]]);
                result.push([startPoint[0], startPoint[1]]);
            }
        }
        return result;
    };
    /**
     * Get end tangent vector
     * @return {Array}
     */
    Path.prototype.getEndTangent = function () {
        var segments = this.getSegments();
        var length = segments.length;
        var result;
        if (length > 1) {
            var startPoint = segments[length - 2].currentPoint;
            var endPoint = segments[length - 1].currentPoint;
            var tangent = segments[length - 1].endTangent;
            result = [];
            if (tangent) {
                result.push([endPoint[0] - tangent[0], endPoint[1] - tangent[1]]);
                result.push([endPoint[0], endPoint[1]]);
            }
            else {
                result.push([startPoint[0], startPoint[1]]);
                result.push([endPoint[0], endPoint[1]]);
            }
        }
        return result;
    };
    return Path;
}(ShapeBase));
export default Path;
//# sourceMappingURL=path.js.map