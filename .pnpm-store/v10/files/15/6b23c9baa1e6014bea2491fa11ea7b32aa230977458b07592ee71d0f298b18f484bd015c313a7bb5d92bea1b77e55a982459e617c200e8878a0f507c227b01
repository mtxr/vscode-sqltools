"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("@antv/util");
var adjust_1 = require("./adjust");
var Symmetric = /** @class */ (function (_super) {
    tslib_1.__extends(Symmetric, _super);
    function Symmetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Symmetric.prototype.process = function (groupDataArray) {
        var mergeData = _.flatten(groupDataArray);
        var _a = this, xField = _a.xField, yField = _a.yField;
        // 每个 x 值对应的 最大值
        var cache = this.getXValuesMaxMap(mergeData);
        // 所有数据的最大的值
        var max = Math.max.apply(Math, Object.keys(cache).map(function (key) { return cache[key]; }));
        return _.map(groupDataArray, function (dataArray) {
            return _.map(dataArray, function (data) {
                var _a, _b;
                var yValue = data[yField];
                var xValue = data[xField];
                // 数组处理逻辑
                if (_.isArray(yValue)) {
                    var off_1 = (max - cache[xValue]) / 2;
                    return tslib_1.__assign(tslib_1.__assign({}, data), (_a = {}, _a[yField] = _.map(yValue, function (y) { return off_1 + y; }), _a));
                }
                // 非数组处理逻辑
                var offset = (max - yValue) / 2;
                return tslib_1.__assign(tslib_1.__assign({}, data), (_b = {}, _b[yField] = [offset, yValue + offset], _b));
            });
        });
    };
    // 获取每个 x 对应的最大的值
    Symmetric.prototype.getXValuesMaxMap = function (mergeData) {
        var _this = this;
        var _a = this, xField = _a.xField, yField = _a.yField;
        // 根据 xField 的值进行分组
        var groupDataArray = _.groupBy(mergeData, function (data) { return data[xField]; });
        // 获取每个 xField 值中的最大值
        return _.mapValues(groupDataArray, function (dataArray) { return _this.getDimMaxValue(dataArray, yField); });
    };
    Symmetric.prototype.getDimMaxValue = function (mergeData, dim) {
        // 所有的 value 值
        var dimValues = _.map(mergeData, function (data) { return _.get(data, dim, []); });
        // 将数组打平（dim value 有可能是数组，比如 stack 之后的）
        var flattenValues = _.flatten(dimValues);
        // 求出数组的最大值
        return Math.max.apply(Math, flattenValues);
    };
    return Symmetric;
}(adjust_1.default));
exports.default = Symmetric;
//# sourceMappingURL=symmetric.js.map