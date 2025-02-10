"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("@antv/util");
var constant_1 = require("../constant");
var Adjust = /** @class */ (function () {
    function Adjust(cfg) {
        var xField = cfg.xField, yField = cfg.yField, _a = cfg.adjustNames, adjustNames = _a === void 0 ? ['x', 'y'] : _a, dimValuesMap = cfg.dimValuesMap;
        this.adjustNames = adjustNames;
        this.xField = xField;
        this.yField = yField;
        this.dimValuesMap = dimValuesMap;
    }
    /**
     * 查看维度是否是 adjust 字段
     * @param dim
     */
    Adjust.prototype.isAdjust = function (dim) {
        return this.adjustNames.indexOf(dim) >= 0;
    };
    Adjust.prototype.getAdjustRange = function (dim, dimValue, values) {
        var yField = this.yField;
        var index = values.indexOf(dimValue);
        var length = values.length;
        var pre;
        var next;
        // 没有 y 字段，但是需要根据 y 调整
        if (!yField && this.isAdjust('y')) {
            pre = 0;
            next = 1;
        }
        else if (length > 1) {
            // 如果以其开头，则取之，否则取他前面一个
            pre = values[index === 0 ? 0 : index - 1];
            // 如果以其结尾，则取之，否则取他后面一个
            next = values[index === length - 1 ? length - 1 : index + 1];
            if (index !== 0) {
                pre += (dimValue - pre) / 2;
            }
            else {
                pre -= (next - dimValue) / 2;
            }
            if (index !== length - 1) {
                next -= (next - dimValue) / 2;
            }
            else {
                next += (dimValue - values[length - 2]) / 2;
            }
        }
        else {
            pre = dimValue === 0 ? 0 : dimValue - 0.5;
            next = dimValue === 0 ? 1 : dimValue + 0.5;
        }
        return {
            pre: pre,
            next: next,
        };
    };
    Adjust.prototype.adjustData = function (groupedDataArray, mergedData) {
        var _this = this;
        // 所有调整维度的值数组
        var dimValuesMap = this.getDimValues(mergedData);
        // 按照每一个分组来进行调整
        _.each(groupedDataArray, function (dataArray, index) {
            // 遍历所有数据集合
            // 每个分组中，分别按照不同的 dim 进行调整
            _.each(dimValuesMap, function (values, dim) {
                // 根据不同的度量分别调整位置
                _this.adjustDim(dim, values, dataArray, index);
            });
        });
    };
    /**
     * 对数据进行分组adjustData
     * @param data 数据
     * @param dim 分组的字段
     * @return 分组结果
     */
    Adjust.prototype.groupData = function (data, dim) {
        // 补齐数据空数据为默认值
        _.each(data, function (record) {
            if (record[dim] === undefined) {
                record[dim] = constant_1.DEFAULT_Y;
            }
        });
        // 按照 dim 维度分组
        return _.groupBy(data, dim);
    };
    /** @override */
    Adjust.prototype.adjustDim = function (dim, values, data, index) { };
    /**
     * 获取可调整度量对应的值
     * @param mergedData 数据
     * @return 值的映射
     */
    Adjust.prototype.getDimValues = function (mergedData) {
        var _a = this, xField = _a.xField, yField = _a.yField;
        var dimValuesMap = _.assign({}, this.dimValuesMap);
        // 所有的维度
        var dims = [];
        if (xField && this.isAdjust('x')) {
            dims.push(xField);
        }
        if (yField && this.isAdjust('y')) {
            dims.push(yField);
        }
        dims.forEach(function (dim) {
            if (dimValuesMap && dimValuesMap[dim]) {
                return;
            }
            // 在每个维度上，所有的值
            dimValuesMap[dim] = _.valuesOfKey(mergedData, dim).sort(function (v1, v2) { return v1 - v2; });
        });
        // 只有一维的情况下，同时调整 y，赋予默认值
        if (!yField && this.isAdjust('y')) {
            var dim = 'y';
            dimValuesMap[dim] = [constant_1.DEFAULT_Y, 1]; // 默认分布在 y 轴的 0 与 1 之间
        }
        return dimValuesMap;
    };
    return Adjust;
}());
exports.default = Adjust;
//# sourceMappingURL=adjust.js.map