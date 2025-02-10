import { __extends } from "tslib";
import { isArray } from '@antv/util';
import Geometry from './base';
/** 引入 Path 对应的 ShapeFactory */
import './shape/polygon';
/**
 * Polygon 几何标记。
 * 常用于绘制色块图、日历图等。
 */
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'polygon';
        _this.shapeType = 'polygon';
        _this.generatePoints = true;
        return _this;
    }
    /**
     * 获取 Shape 的关键点数据。
     * @param obj
     * @returns
     */
    Polygon.prototype.createShapePointsCfg = function (obj) {
        var cfg = _super.prototype.createShapePointsCfg.call(this, obj);
        var x = cfg.x;
        var y = cfg.y;
        var temp;
        // x y 都是数组时，不做处理
        if (!(isArray(x) && isArray(y))) {
            var xScale = this.getXScale();
            var yScale = this.getYScale();
            var xCount = xScale.values.length;
            var yCount = yScale.values.length;
            var xOffset = (0.5 * 1) / xCount;
            var yOffset = (0.5 * 1) / yCount;
            if (xScale.isCategory && yScale.isCategory) {
                // 如果x,y都是分类
                x = [x - xOffset, x - xOffset, x + xOffset, x + xOffset];
                y = [y - yOffset, y + yOffset, y + yOffset, y - yOffset];
            }
            else if (isArray(x)) {
                // x 是数组
                temp = x;
                x = [temp[0], temp[0], temp[1], temp[1]];
                y = [y - yOffset / 2, y + yOffset / 2, y + yOffset / 2, y - yOffset / 2];
            }
            else if (isArray(y)) {
                // y 是数组
                temp = y;
                y = [temp[0], temp[1], temp[1], temp[0]];
                x = [x - xOffset / 2, x - xOffset / 2, x + xOffset / 2, x + xOffset / 2];
            }
            cfg.x = x;
            cfg.y = y;
        }
        return cfg;
    };
    return Polygon;
}(Geometry));
export default Polygon;
//# sourceMappingURL=polygon.js.map