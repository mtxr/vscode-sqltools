import { flatten, isString, valuesOfKey, isNil } from '@antv/util';
import { getXDimensionLength } from '../../util/coordinate';
// 已经排序后的数据查找距离最小的
function findMinDistance(arr, scale) {
    var count = arr.length;
    var sourceArr = arr;
    if (isString(sourceArr[0])) {
        // 日期类型的 values 经常上文本类型，所以需要转换一下
        sourceArr = arr.map(function (v) {
            return scale.translate(v);
        });
    }
    var distance = sourceArr[1] - sourceArr[0];
    for (var i = 2; i < count; i++) {
        var tmp = sourceArr[i] - sourceArr[i - 1];
        if (distance > tmp) {
            distance = tmp;
        }
    }
    return distance;
}
function getDodgeCount(dataArray, dodgeBy) {
    if (dodgeBy) {
        var mergeData = flatten(dataArray);
        var values = valuesOfKey(mergeData, dodgeBy);
        return values.length;
    }
    return dataArray.length;
}
/** @ignore */
export function getDefaultSize(geometry) {
    var theme = geometry.theme;
    var coordinate = geometry.coordinate;
    var xScale = geometry.getXScale();
    var xValues = xScale.values;
    var dataArray = geometry.beforeMappingData;
    var count = xValues.length;
    var xDimensionLength = getXDimensionLength(geometry.coordinate);
    // 获取柱宽相关配置项
    var intervalPadding = geometry.intervalPadding, dodgePadding = geometry.dodgePadding;
    // 兼容theme配置
    var maxColumnWidth = geometry.maxColumnWidth || theme.maxColumnWidth;
    var minColumnWidth = geometry.minColumnWidth || theme.minColumnWidth;
    var columnWidthRatio = geometry.columnWidthRatio || theme.columnWidthRatio;
    var multiplePieWidthRatio = geometry.multiplePieWidthRatio || theme.multiplePieWidthRatio;
    var roseWidthRatio = geometry.roseWidthRatio || theme.roseWidthRatio;
    // 线性情况下count值
    if (xScale.isLinear && xValues.length > 1) {
        // Linear 类型用户有可能设置了 min, max 范围所以需要根据数据最小区间计算 count
        xValues.sort();
        var interval = findMinDistance(xValues, xScale);
        count = (xScale.max - xScale.min) / interval;
        if (xValues.length > count) {
            count = xValues.length;
        }
    }
    var range = xScale.range;
    var normalizedSize = 1 / count;
    var wr = 1;
    if (coordinate.isPolar) {
        // 极坐标场景
        if (coordinate.isTransposed && count > 1) {
            // 极坐标下多层环图
            wr = multiplePieWidthRatio;
        }
        else {
            wr = roseWidthRatio;
        }
    }
    else {
        // 非极坐标场景
        if (xScale.isLinear) {
            normalizedSize *= range[1] - range[0];
        }
        wr = columnWidthRatio;
    }
    // 基础柱状图
    if (!isNil(intervalPadding) && intervalPadding >= 0) {
        // 配置组间距情况
        var normalizedIntervalPadding = intervalPadding / xDimensionLength;
        normalizedSize = (1 - (count - 1) * normalizedIntervalPadding) / count;
    }
    else {
        // 默认情况
        normalizedSize *= wr;
    }
    // 分组柱状图
    if (geometry.getAdjust('dodge')) {
        var dodgeAdjust = geometry.getAdjust('dodge');
        var dodgeBy = dodgeAdjust.dodgeBy;
        var dodgeCount = getDodgeCount(dataArray, dodgeBy);
        if (!isNil(dodgePadding) && dodgePadding >= 0) {
            // 仅配置组内间距情况
            var normalizedDodgePadding = dodgePadding / xDimensionLength;
            normalizedSize = (normalizedSize - normalizedDodgePadding * (dodgeCount - 1)) / dodgeCount;
        }
        else if (!isNil(intervalPadding) && intervalPadding >= 0) {
            // 设置组间距但未设置组内间距情况，避免组间距过小导致图形重叠，需乘以wr
            normalizedSize *= wr;
            normalizedSize = normalizedSize / dodgeCount;
        }
        else {
            // 组间距和组内间距均未配置
            normalizedSize = normalizedSize / dodgeCount;
        }
        normalizedSize = normalizedSize >= 0 ? normalizedSize : 0;
    }
    // 最大和最小限制
    if (!isNil(maxColumnWidth) && maxColumnWidth >= 0) {
        var normalizedMaxColumnWidth = maxColumnWidth / xDimensionLength;
        if (normalizedSize > normalizedMaxColumnWidth) {
            normalizedSize = normalizedMaxColumnWidth;
        }
    }
    // minColumnWidth可能设置为0
    if (!isNil(minColumnWidth) && minColumnWidth >= 0) {
        var normalizedMinColumnWidth = minColumnWidth / xDimensionLength;
        if (normalizedSize < normalizedMinColumnWidth) {
            normalizedSize = normalizedMinColumnWidth;
        }
    }
    return normalizedSize;
}
//# sourceMappingURL=shape-size.js.map