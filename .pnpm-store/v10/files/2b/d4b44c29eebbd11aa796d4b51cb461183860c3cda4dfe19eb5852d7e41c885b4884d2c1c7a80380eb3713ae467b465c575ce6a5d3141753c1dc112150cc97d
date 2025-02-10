"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coordinate_1 = require("../util/coordinate");
var base_1 = tslib_1.__importDefault(require("./base"));
/** 引入对应的 ShapeFactory */
require("./shape/schema");
var shape_size_1 = require("./util/shape-size");
/**
 * Schema 几何标记，用于一些自定义图形的绘制，比如箱型图、股票图等。
 */
var Schema = /** @class */ (function (_super) {
    tslib_1.__extends(Schema, _super);
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
        return cfg;
    };
    return Schema;
}(base_1.default));
exports.default = Schema;
//# sourceMappingURL=schema.js.map