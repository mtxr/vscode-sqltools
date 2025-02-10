import { __extends } from "tslib";
import { get } from '@antv/util';
import { FIELD_ORIGIN } from '../constant';
import { getXDimensionLength } from '../util/coordinate';
import { getDefaultSize } from './util/shape-size';
import Geometry from './base';
/** 引入 Path 对应的 ShapeFactory */
import './shape/violin';
/**
 * Violin 几何标记。
 * 用于绘制小提琴图。
 */
var Violin = /** @class */ (function (_super) {
    __extends(Violin, _super);
    function Violin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'violin';
        _this.shapeType = 'violin';
        _this.generatePoints = true;
        return _this;
    }
    /**
     * 获取 Shape 的关键点数据。
     * @param record
     * @returns
     */
    Violin.prototype.createShapePointsCfg = function (record) {
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
        cfg._size = get(record[FIELD_ORIGIN], [this._sizeField]);
        return cfg;
    };
    /**
     * @override
     */
    Violin.prototype.initAttributes = function () {
        var attributeOption = this.attributeOption;
        var sizeField = attributeOption.size
            ? attributeOption.size.fields[0]
            : this._sizeField
                ? this._sizeField
                : 'size';
        this._sizeField = sizeField;
        // fixme 干啥要删掉
        delete attributeOption.size;
        _super.prototype.initAttributes.call(this);
    };
    return Violin;
}(Geometry));
export default Violin;
//# sourceMappingURL=violin.js.map