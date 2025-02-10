import { __extends } from "tslib";
import { getXDimensionLength } from '../util/coordinate';
import Geometry from './base';
/** 引入对应的 ShapeFactory */
import './shape/schema';
import { getDefaultSize } from './util/shape-size';
/**
 * Schema 几何标记，用于一些自定义图形的绘制，比如箱型图、股票图等。
 */
var Schema = /** @class */ (function (_super) {
    __extends(Schema, _super);
    function Schema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'schema';
        _this.shapeType = 'schema';
        _this.generatePoints = true;
        return _this;
    }
    /**
     * 获取 Shape 的关键点数据。
     * @param record
     * @returns
     */
    Schema.prototype.createShapePointsCfg = function (record) {
        var cfg = _super.prototype.createShapePointsCfg.call(this, record);
        // 计算每个 shape 的 size
        var size;
        var sizeAttr = this.getAttribute('size');
        if (sizeAttr) {
            size = this.getAttributeValues(sizeAttr, record)[0];
            // 归一化
            var coordinate = this.coordinate;
            var coordinateWidth = getXDimensionLength(coordinate);
            size = size / coordinateWidth;
        }
        else {
            if (!this.defaultSize) {
                this.defaultSize = getDefaultSize(this);
            }
            size = this.defaultSize;
        }
        cfg.size = size;
        return cfg;
    };
    return Schema;
}(Geometry));
export default Schema;
//# sourceMappingURL=schema.js.map