import { __extends } from "tslib";
import { FIELD_ORIGIN } from '../constant';
import Path from './path';
import './shape/area';
/**
 * Area 几何标记类。
 * 常用于绘制面积图。
 */
var Area = /** @class */ (function (_super) {
    __extends(Area, _super);
    function Area(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'area';
        _this.shapeType = 'area';
        /** 生成图形关键点 */
        _this.generatePoints = true;
        /**
         * 面积图是否从 0 基准线开始填充。
         * 1. 默认值为 `true`，表现如下：
         * ![image](https://gw.alipayobjects.com/zos/rmsportal/ZQqwUCczalrKqGgagOVp.png)
         * 2. 当值为 `false` 时，表现如下：
         * ![image](https://gw.alipayobjects.com/zos/rmsportal/yPswkaXvUpCYOdhocGwB.png)
         */
        _this.startOnZero = true;
        var _a = cfg.startOnZero, startOnZero = _a === void 0 ? true : _a, _b = cfg.sortable, sortable = _b === void 0 ? false : _b, _c = cfg.showSinglePoint, showSinglePoint = _c === void 0 ? false : _c;
        _this.startOnZero = startOnZero; // 默认为 true
        _this.sortable = sortable; // 关闭默认的 X 轴数据排序
        _this.showSinglePoint = showSinglePoint;
        return _this;
    }
    /**
     * 获取图形绘制的关键点以及数据
     * @param mappingData 映射后的数据
     */
    Area.prototype.getPointsAndData = function (mappingData) {
        var points = [];
        var data = [];
        for (var i = 0, len = mappingData.length; i < len; i++) {
            var obj = mappingData[i];
            points.push(obj.points);
            data.push(obj[FIELD_ORIGIN]);
        }
        return {
            points: points,
            data: data,
        };
    };
    /**
     * 获取 Y 轴上的最小值
     * @returns y 字段最小值
     */
    Area.prototype.getYMinValue = function () {
        if (this.startOnZero) {
            return _super.prototype.getYMinValue.call(this);
        }
        var yScale = this.getYScale();
        return yScale.min;
    };
    return Area;
}(Path));
export default Area;
//# sourceMappingURL=area.js.map