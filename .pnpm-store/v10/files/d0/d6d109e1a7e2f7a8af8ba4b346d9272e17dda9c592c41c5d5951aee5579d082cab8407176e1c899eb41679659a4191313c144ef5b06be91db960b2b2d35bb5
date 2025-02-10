import { __extends } from "tslib";
import * as _ from '@antv/util';
import { DODGE_RATIO, MARGIN_RATIO } from '../constant';
import Adjust from './adjust';
var Dodge = /** @class */ (function (_super) {
    __extends(Dodge, _super);
    function Dodge(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.cacheMap = {};
        _this.adjustDataArray = [];
        _this.mergeData = [];
        var _a = cfg.marginRatio, marginRatio = _a === void 0 ? MARGIN_RATIO : _a, _b = cfg.dodgeRatio, dodgeRatio = _b === void 0 ? DODGE_RATIO : _b, dodgeBy = cfg.dodgeBy, intervalPadding = cfg.intervalPadding, dodgePadding = cfg.dodgePadding, xDimensionLength = cfg.xDimensionLength, groupNum = cfg.groupNum, defaultSize = cfg.defaultSize, maxColumnWidth = cfg.maxColumnWidth, minColumnWidth = cfg.minColumnWidth, columnWidthRatio = cfg.columnWidthRatio, customOffset = cfg.customOffset;
        _this.marginRatio = marginRatio;
        _this.dodgeRatio = dodgeRatio;
        _this.dodgeBy = dodgeBy;
        _this.intervalPadding = intervalPadding;
        _this.dodgePadding = dodgePadding;
        _this.xDimensionLegenth = xDimensionLength;
        _this.groupNum = groupNum;
        _this.defaultSize = defaultSize;
        _this.maxColumnWidth = maxColumnWidth;
        _this.minColumnWidth = minColumnWidth;
        _this.columnWidthRatio = columnWidthRatio;
        _this.customOffset = customOffset;
        return _this;
    }
    Dodge.prototype.process = function (groupDataArray) {
        var groupedDataArray = _.clone(groupDataArray);
        // 将数据数组展开一层
        var mergeData = _.flatten(groupedDataArray);
        var dodgeBy = this.dodgeBy;
        // 如果指定了分组 dim 的字段
        var adjustDataArray = dodgeBy ? _.group(mergeData, dodgeBy) : groupedDataArray;
        this.cacheMap = {};
        this.adjustDataArray = adjustDataArray;
        this.mergeData = mergeData;
        this.adjustData(adjustDataArray, mergeData);
        this.adjustDataArray = [];
        this.mergeData = [];
        return groupedDataArray;
    };
    Dodge.prototype.adjustDim = function (dim, values, data, frameIndex) {
        var _this = this;
        var customOffset = this.customOffset;
        var map = this.getDistribution(dim);
        var groupData = this.groupData(data, dim); // 根据值分组
        _.each(groupData, function (group, key) {
            var range;
            // xField 中只有一个值，不需要做 dodge
            if (values.length === 1) {
                range = {
                    pre: values[0] - 1,
                    next: values[0] + 1,
                };
            }
            else {
                // 如果有多个，则需要获取调整的范围
                range = _this.getAdjustRange(dim, parseFloat(key), values);
            }
            _.each(group, function (d) {
                var value = d[dim];
                var valueArr = map[value];
                var valIndex = valueArr.indexOf(frameIndex);
                if (!_.isNil(customOffset)) {
                    var pre = range.pre, next = range.next;
                    d[dim] = _.isFunction(customOffset) ? customOffset(d, range) : (pre + next) / 2 + customOffset;
                }
                else {
                    d[dim] = _this.getDodgeOffset(range, valIndex, valueArr.length);
                }
            });
        });
        return [];
    };
    Dodge.prototype.getDodgeOffset = function (range, idx, len) {
        var _a = this, dodgeRatio = _a.dodgeRatio, marginRatio = _a.marginRatio, intervalPadding = _a.intervalPadding, dodgePadding = _a.dodgePadding;
        var pre = range.pre, next = range.next;
        var tickLength = next - pre;
        var position;
        // 分多种输入情况
        if (!_.isNil(intervalPadding) && _.isNil(dodgePadding) && intervalPadding >= 0) {
            // 仅配置intervalPadding
            var offset = this.getIntervalOnlyOffset(len, idx);
            position = pre + offset;
        }
        else if (!_.isNil(dodgePadding) && _.isNil(intervalPadding) && dodgePadding >= 0) {
            // 仅配置dodgePadding
            var offset = this.getDodgeOnlyOffset(len, idx);
            position = pre + offset;
        }
        else if (!_.isNil(intervalPadding) &&
            !_.isNil(dodgePadding) &&
            intervalPadding >= 0 &&
            dodgePadding >= 0) {
            // 同时配置intervalPadding和dodgePadding
            var offset = this.getIntervalAndDodgeOffset(len, idx);
            position = pre + offset;
        }
        else {
            // 默认情况
            var width = (tickLength * dodgeRatio) / len;
            var margin = marginRatio * width;
            var offset = (1 / 2) * (tickLength - len * width - (len - 1) * margin) +
                ((idx + 1) * width + idx * margin) -
                (1 / 2) * width -
                (1 / 2) * tickLength;
            position = (pre + next) / 2 + offset;
        }
        return position;
    };
    Dodge.prototype.getIntervalOnlyOffset = function (len, idx) {
        var _a = this, defaultSize = _a.defaultSize, intervalPadding = _a.intervalPadding, xDimensionLegenth = _a.xDimensionLegenth, groupNum = _a.groupNum, dodgeRatio = _a.dodgeRatio, maxColumnWidth = _a.maxColumnWidth, minColumnWidth = _a.minColumnWidth, columnWidthRatio = _a.columnWidthRatio;
        var normalizedIntervalPadding = intervalPadding / xDimensionLegenth;
        var normalizedDodgePadding = (1 - (groupNum - 1) * normalizedIntervalPadding) / groupNum * dodgeRatio / (len - 1);
        var geomWidth = ((1 - normalizedIntervalPadding * (groupNum - 1)) / groupNum - normalizedDodgePadding * (len - 1)) / len;
        // 根据columnWidthRatio/defaultSize/maxColumnWidth/minColumnWidth调整宽度
        geomWidth = (!_.isNil(columnWidthRatio)) ? 1 / groupNum / len * columnWidthRatio : geomWidth;
        if (!_.isNil(maxColumnWidth)) {
            var normalizedMaxWidht = maxColumnWidth / xDimensionLegenth;
            geomWidth = Math.min(geomWidth, normalizedMaxWidht);
        }
        if (!_.isNil(minColumnWidth)) {
            var normalizedMinWidht = minColumnWidth / xDimensionLegenth;
            geomWidth = Math.max(geomWidth, normalizedMinWidht);
        }
        geomWidth = defaultSize ? (defaultSize / xDimensionLegenth) : geomWidth;
        // 调整组内间隔
        normalizedDodgePadding = ((1 - (groupNum - 1) * normalizedIntervalPadding) / groupNum - len * geomWidth) / (len - 1);
        var offset = ((1 / 2 + idx) * geomWidth + idx * normalizedDodgePadding +
            (1 / 2) * normalizedIntervalPadding) * groupNum -
            normalizedIntervalPadding / 2;
        return offset;
    };
    Dodge.prototype.getDodgeOnlyOffset = function (len, idx) {
        var _a = this, defaultSize = _a.defaultSize, dodgePadding = _a.dodgePadding, xDimensionLegenth = _a.xDimensionLegenth, groupNum = _a.groupNum, marginRatio = _a.marginRatio, maxColumnWidth = _a.maxColumnWidth, minColumnWidth = _a.minColumnWidth, columnWidthRatio = _a.columnWidthRatio;
        var normalizedDodgePadding = dodgePadding / xDimensionLegenth;
        var normalizedIntervalPadding = 1 * marginRatio / (groupNum - 1);
        var geomWidth = ((1 - normalizedIntervalPadding * (groupNum - 1)) / groupNum - normalizedDodgePadding * (len - 1)) / len;
        // 根据columnWidthRatio/defaultSize/maxColumnWidth/minColumnWidth调整宽度
        geomWidth = columnWidthRatio ? 1 / groupNum / len * columnWidthRatio : geomWidth;
        if (!_.isNil(maxColumnWidth)) {
            var normalizedMaxWidht = maxColumnWidth / xDimensionLegenth;
            geomWidth = Math.min(geomWidth, normalizedMaxWidht);
        }
        if (!_.isNil(minColumnWidth)) {
            var normalizedMinWidht = minColumnWidth / xDimensionLegenth;
            geomWidth = Math.max(geomWidth, normalizedMinWidht);
        }
        geomWidth = defaultSize ? (defaultSize / xDimensionLegenth) : geomWidth;
        // 调整组间距
        normalizedIntervalPadding = (1 - (geomWidth * len + normalizedDodgePadding * (len - 1)) * groupNum) / (groupNum - 1);
        var offset = ((1 / 2 + idx) * geomWidth + idx * normalizedDodgePadding +
            (1 / 2) * normalizedIntervalPadding) * groupNum -
            normalizedIntervalPadding / 2;
        return offset;
    };
    Dodge.prototype.getIntervalAndDodgeOffset = function (len, idx) {
        var _a = this, intervalPadding = _a.intervalPadding, dodgePadding = _a.dodgePadding, xDimensionLegenth = _a.xDimensionLegenth, groupNum = _a.groupNum;
        var normalizedIntervalPadding = intervalPadding / xDimensionLegenth;
        var normalizedDodgePadding = dodgePadding / xDimensionLegenth;
        var geomWidth = ((1 - normalizedIntervalPadding * (groupNum - 1)) / groupNum - normalizedDodgePadding * (len - 1)) / len;
        var offset = ((1 / 2 + idx) * geomWidth + idx * normalizedDodgePadding +
            (1 / 2) * normalizedIntervalPadding) * groupNum -
            normalizedIntervalPadding / 2;
        return offset;
    };
    Dodge.prototype.getDistribution = function (dim) {
        var groupedDataArray = this.adjustDataArray;
        var cacheMap = this.cacheMap;
        var map = cacheMap[dim];
        if (!map) {
            map = {};
            _.each(groupedDataArray, function (data, index) {
                var values = _.valuesOfKey(data, dim);
                if (!values.length) {
                    values.push(0);
                }
                _.each(values, function (val) {
                    if (!map[val]) {
                        map[val] = [];
                    }
                    map[val].push(index);
                });
            });
            cacheMap[dim] = map;
        }
        return map;
    };
    return Dodge;
}(Adjust));
export default Dodge;
//# sourceMappingURL=dodge.js.map