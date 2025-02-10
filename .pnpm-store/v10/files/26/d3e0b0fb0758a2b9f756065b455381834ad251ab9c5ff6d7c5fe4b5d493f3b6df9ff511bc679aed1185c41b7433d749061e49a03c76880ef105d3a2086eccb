"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var coordinate_1 = require("../util/coordinate");
var base_1 = tslib_1.__importDefault(require("./base"));
/** 引入对应的 ShapeFactory */
require("./shape/interval");
var shape_size_1 = require("./util/shape-size");
var scale_1 = require("../util/scale");
/**
 * Interval 几何标记。
 * 用于绘制柱状图、饼图、条形图、玫瑰图等。
 */
var Interval = /** @class */ (function (_super) {
    tslib_1.__extends(Interval, _super);
    function Interval(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'interval';
        _this.shapeType = 'interval';
        _this.generatePoints = true;
        var background = cfg.background;
        _this.background = background;
        return _this;
    }
    /**
     * 获取每条数据的 Shape 绘制信息
     * @param obj 经过分组 -> 数字化 -> adjust 调整后的数据记录
     * @returns
     */
    Interval.prototype.createShapePointsCfg = function (obj) {
        var cfg = _super.prototype.createShapePointsCfg.call(this, obj);
        // 计算每个 shape 的 size
        var size;
        var sizeAttr = this.getAttribute('size');
        if (sizeAttr) {
            size = this.getAttributeValues(sizeAttr, obj)[0];
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
    /**
     * 调整 y 轴的 scale 范围。
     * 对于 Y 轴为数值轴柱状图，默认从 0 开始 生长。
     */
    Interval.prototype.adjustScale = function () {
        _super.prototype.adjustScale.call(this);
        var yScale = this.getYScale();
        // 特殊逻辑：饼图需要填充满整个空间
        if (this.coordinate.type === 'theta') {
            yScale.change({
                nice: false,
                min: 0,
                // 发生过 stack 调整，yScale 的 max 被调整过，this.updateStackRange()
                max: (0, scale_1.getMaxScale)(yScale),
            });
        }
        else {
            // 柱状图数值轴默认从 0 开始
            var scaleDefs = this.scaleDefs;
            var field = yScale.field, min = yScale.min, max = yScale.max, type = yScale.type;
            if (type !== 'time') {
                // time 类型不做调整
                // 柱状图的 Y 轴要从 0 开始生长，但是如果用户设置了则以用户的为准
                if (min > 0 && !(0, util_1.get)(scaleDefs, [field, 'min'])) {
                    yScale.change({
                        min: 0,
                    });
                }
                // 柱当柱状图全为负值时也需要从 0 开始生长，但是如果用户设置了则以用户的为准
                if (max <= 0 && !(0, util_1.get)(scaleDefs, [field, 'max'])) {
                    yScale.change({
                        max: 0,
                    });
                }
            }
        }
    };
    /**
     * @override
     */
    Interval.prototype.getDrawCfg = function (mappingData) {
        var shapeCfg = _super.prototype.getDrawCfg.call(this, mappingData);
        shapeCfg.background = this.background;
        return shapeCfg;
    };
    return Interval;
}(base_1.default));
exports.default = Interval;
//# sourceMappingURL=interval.js.map