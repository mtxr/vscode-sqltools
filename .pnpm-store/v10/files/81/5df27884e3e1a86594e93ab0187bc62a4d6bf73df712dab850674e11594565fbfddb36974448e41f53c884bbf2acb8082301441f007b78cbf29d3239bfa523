import { __extends, __read } from "tslib";
import { Event } from '../../../chart';
import Action from '../base';
import { isMask } from '../util';
// 获取对应的 scale
function getFilter(scale, dim, point1, point2) {
    var min = Math.min(point1[dim], point2[dim]);
    var max = Math.max(point1[dim], point2[dim]);
    var _a = __read(scale.range, 2), rangeMin = _a[0], rangeMax = _a[1];
    // 约束值在 scale 的 range 之间
    if (min < rangeMin) {
        min = rangeMin;
    }
    if (max > rangeMax) {
        max = rangeMax;
    }
    // 范围大于整个 view 的范围，则返回 null
    if (min === rangeMax && max === rangeMax) {
        return null;
    }
    var minValue = scale.invert(min);
    var maxValue = scale.invert(max);
    if (scale.isCategory) {
        var minIndex = scale.values.indexOf(minValue);
        var maxIndex = scale.values.indexOf(maxValue);
        var arr_1 = scale.values.slice(minIndex, maxIndex + 1);
        return function (value) {
            return arr_1.includes(value);
        };
    }
    else {
        return function (value) {
            return value >= minValue && value <= maxValue;
        };
    }
}
/** range-filter 只用于：brush-filter, brush-x-filter, brush-y-filter */
var EVENTS;
(function (EVENTS) {
    EVENTS["FILTER"] = "brush-filter-processing";
    EVENTS["RESET"] = "brush-filter-reset";
    EVENTS["BEFORE_FILTER"] = "brush-filter:beforefilter";
    EVENTS["AFTER_FILTER"] = "brush-filter:afterfilter";
    EVENTS["BEFORE_RESET"] = "brush-filter:beforereset";
    EVENTS["AFTER_RESET"] = "brush-filter:afterreset";
})(EVENTS || (EVENTS = {}));
export { EVENTS as BRUSH_FILTER_EVENTS };
/**
 * 范围过滤的 Action
 * @ignore
 */
var RangeFilter = /** @class */ (function (_super) {
    __extends(RangeFilter, _super);
    function RangeFilter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 范围过滤生效的字段/维度，可以是 x, y
         */
        _this.dims = ['x', 'y'];
        /** 起始点 */
        _this.startPoint = null;
        _this.isStarted = false;
        return _this;
    }
    // x,y 是否生效
    RangeFilter.prototype.hasDim = function (dim) {
        return this.dims.includes(dim);
    };
    /**
     * 开始范围过滤，记录范围过滤的起点
     */
    RangeFilter.prototype.start = function () {
        var context = this.context;
        this.isStarted = true;
        this.startPoint = context.getCurrentPoint();
    };
    /**
     * 过滤，以开始的点和当前点对数据进行过滤
     */
    RangeFilter.prototype.filter = function () {
        var startPoint;
        var currentPoint;
        if (isMask(this.context)) {
            var maskShape = this.context.event.target;
            var bbox = maskShape.getCanvasBBox();
            startPoint = { x: bbox.x, y: bbox.y };
            currentPoint = { x: bbox.maxX, y: bbox.maxY };
        }
        else {
            if (!this.isStarted) {
                // 如果没有开始，则不执行过滤
                return;
            }
            startPoint = this.startPoint;
            currentPoint = this.context.getCurrentPoint();
        }
        if (Math.abs(startPoint.x - currentPoint.x) < 5 || Math.abs(startPoint.x - currentPoint.y) < 5) {
            // 距离过小也不生效
            return;
        }
        var _a = this.context, view = _a.view, event = _a.event;
        var payload = { view: view, event: event, dims: this.dims };
        view.emit(EVENTS.BEFORE_FILTER, Event.fromData(view, EVENTS.BEFORE_FILTER, payload));
        var coord = view.getCoordinate();
        var normalCurrent = coord.invert(currentPoint);
        var normalStart = coord.invert(startPoint);
        // 设置 x 方向的 filter
        if (this.hasDim('x')) {
            var xScale = view.getXScale();
            var filter = getFilter(xScale, 'x', normalCurrent, normalStart);
            this.filterView(view, xScale.field, filter);
        }
        // 设置 y 方向的 filter
        if (this.hasDim('y')) {
            var yScale = view.getYScales()[0];
            var filter = getFilter(yScale, 'y', normalCurrent, normalStart);
            this.filterView(view, yScale.field, filter);
        }
        this.reRender(view, { source: EVENTS.FILTER });
        view.emit(EVENTS.AFTER_FILTER, Event.fromData(view, EVENTS.AFTER_FILTER, payload));
    };
    /**
     * 结束
     */
    RangeFilter.prototype.end = function () {
        this.isStarted = false;
    };
    /**
     * 取消同当前 Action 相关的过滤，指定的 x,y
     */
    RangeFilter.prototype.reset = function () {
        var view = this.context.view;
        view.emit(EVENTS.BEFORE_RESET, Event.fromData(view, EVENTS.BEFORE_RESET, {}));
        this.isStarted = false;
        if (this.hasDim('x')) {
            var xScale = view.getXScale();
            this.filterView(view, xScale.field, null); // 取消过滤
        }
        if (this.hasDim('y')) {
            // y 轴过滤仅取第一个 yScale
            var yScale = view.getYScales()[0];
            this.filterView(view, yScale.field, null); // 取消过滤
        }
        this.reRender(view, { source: EVENTS.RESET });
        view.emit(EVENTS.AFTER_RESET, Event.fromData(view, EVENTS.AFTER_RESET, {}));
    };
    /**
     * 对 view 进行过滤
     */
    RangeFilter.prototype.filterView = function (view, field, filter) {
        view.filter(field, filter);
    };
    /**
     * 重新渲染
     * @param view
     */
    RangeFilter.prototype.reRender = function (view, payload) {
        view.render(true, payload);
    };
    return RangeFilter;
}(Action));
export default RangeFilter;
//# sourceMappingURL=range-filter.js.map