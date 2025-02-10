import { __assign, __extends } from "tslib";
import Geometry from './base';
/** 引入 Point 对应的 ShapeFactory */
import './shape/point';
/**
 * Point 几何标记。
 * 常用于绘制点图。
 */
var Point = /** @class */ (function (_super) {
    __extends(Point, _super);
    function Point() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'point';
        _this.shapeType = 'point';
        _this.generatePoints = true;
        return _this;
    }
    /**
     * 获取一个点的绘制信息。
     * @param mappingDatum
     * @returns draw cfg
     */
    Point.prototype.getDrawCfg = function (mappingDatum) {
        var shapeCfg = _super.prototype.getDrawCfg.call(this, mappingDatum);
        return __assign(__assign({}, shapeCfg), { isStack: !!this.getAdjust('stack') });
    };
    return Point;
}(Geometry));
export default Point;
//# sourceMappingURL=point.js.map