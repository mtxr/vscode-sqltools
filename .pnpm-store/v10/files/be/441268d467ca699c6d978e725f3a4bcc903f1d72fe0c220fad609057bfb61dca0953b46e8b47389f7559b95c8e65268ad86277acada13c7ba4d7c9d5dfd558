"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _ = require("@antv/util");
var constant_1 = require("../constant");
var adjust_1 = require("./adjust");
function randomNumber(min, max) {
    return (max - min) * Math.random() + min;
}
var Jitter = /** @class */ (function (_super) {
    tslib_1.__extends(Jitter, _super);
    function Jitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jitter.prototype.process = function (groupDataArray) {
        var groupedDataArray = _.clone(groupDataArray);
        // 之前分组之后的数据，然后有合并回去（和分组前可以理解成是一样的）
        var mergeData = _.flatten(groupedDataArray);
        // 返回值
        this.adjustData(groupedDataArray, mergeData);
        return groupedDataArray;
    };
    /**
     * 当前数据分组（index）中，按照维度 dim 进行 jitter 调整
     * @param dim
     * @param values
     * @param dataArray
     */
    Jitter.prototype.adjustDim = function (dim, values, dataArray) {
        var _this = this;
        // 在每一个分组中，将数据再按照 dim 分组，用于散列
        var groupDataArray = this.groupData(dataArray, dim);
        return _.each(groupDataArray, function (data, dimValue) {
            return _this.adjustGroup(data, dim, parseFloat(dimValue), values);
        });
    };
    // 随机出来的字段值
    Jitter.prototype.getAdjustOffset = function (range) {
        var pre = range.pre, next = range.next;
        // 随机的范围
        var margin = (next - pre) * constant_1.GAP;
        return randomNumber(pre + margin, next - margin);
    };
    // adjust group data
    Jitter.prototype.adjustGroup = function (group, dim, dimValue, values) {
        var _this = this;
        // 调整范围
        var range = this.getAdjustRange(dim, dimValue, values);
        _.each(group, function (data) {
            data[dim] = _this.getAdjustOffset(range); // 获取调整的位置
        });
        return group;
    };
    return Jitter;
}(adjust_1.default));
exports.default = Jitter;
//# sourceMappingURL=jitter.js.map