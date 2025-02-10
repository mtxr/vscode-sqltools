"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var coordinate_1 = require("../util/coordinate");
var shape_size_1 = require("./util/shape-size");
var base_1 = tslib_1.__importDefault(require("./base"));
/** 引入 Path 对应的 ShapeFactory */
require("./shape/violin");
/**
 * Violin 几何标记。
 * 用于绘制小提琴图。
 */
var Violin = /** @class */ (function (_super) {
    tslib_1.__extends(Violin, _super);
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
            var coordinateWidth = (0, coordinate_1.getXDimensionLength)(coordinate);
            size = size / coordinateWidth;
        }
        else {
            if (!this.defaultSize) {
                this.defaultSize = (0, shape_size_1.getDefaultSize)(this);
            }
            size = this.defaultSize;
        }
        cfg.size = size;
        cfg._size = (0, util_1.get)(record[constant_1.FIELD_ORIGIN], [this._sizeField]);
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
}(base_1.default));
exports.default = Violin;
//# sourceMappingURL=violin.js.map