import { clone, each, getRange, groupBy, hasKey, isEmpty, sortBy, valuesOfKey } from '@antv/util';
// 进行转换得到值所在的 range
function getBinKey(value, binWidth, binNumber) {
    // 做一点特殊处理
    if (binNumber === 1) {
        return [0, binWidth];
    }
    var index = Math.floor(value / binWidth);
    return [binWidth * index, binWidth * (index + 1)];
}
// 默认 sturges 转换
function sturges(values) {
    return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}
/**
 * 对数据进行百分比化
 * @param data
 * @param binField
 * @param binWidth
 * @param binNumber
 * @param stackField
 */
export function binHistogram(data, binField, binWidth, binNumber, stackField) {
    var originData_copy = clone(data);
    // 根据 binField 对源数据进行排序
    sortBy(originData_copy, binField);
    // 获取源数据 binField 的 range
    var values = valuesOfKey(originData_copy, binField);
    var range = getRange(values);
    var rangeWidth = range.max - range.min;
    // 计算分箱，直方图分箱的计算基于 binWidth，如配置了 binNumber 则将其转为 binWidth 进行计算
    var _binWidth = binWidth;
    if (!binWidth && binNumber) {
        _binWidth = binNumber > 1 ? rangeWidth / (binNumber - 1) : range.max;
    }
    // 当 binWidth 和 binNumber 都没有指定的情况，采用 Sturges formula 自动生成 binWidth
    if (!binWidth && !binNumber) {
        var _defaultBinNumber = sturges(values);
        _binWidth = rangeWidth / _defaultBinNumber;
    }
    // 构建 key - StatisticData 结构
    var bins = {};
    var groups = groupBy(originData_copy, stackField);
    // 判断分组是否为空，如果为空，说明没有 stackField 字段
    if (isEmpty(groups)) {
        each(originData_copy, function (data) {
            var value = data[binField];
            var bin = getBinKey(value, _binWidth, binNumber);
            var binKey = "".concat(bin[0], "-").concat(bin[1]);
            if (!hasKey(bins, binKey)) {
                bins[binKey] = { range: bin, count: 0 };
            }
            bins[binKey].count += 1;
        });
    }
    else {
        Object.keys(groups).forEach(function (groupKey) {
            each(groups[groupKey], function (data) {
                var value = data[binField];
                var bin = getBinKey(value, _binWidth, binNumber);
                var binKey = "".concat(bin[0], "-").concat(bin[1]);
                var groupKeyBinKey = "".concat(binKey, "-").concat(groupKey);
                if (!hasKey(bins, groupKeyBinKey)) {
                    bins[groupKeyBinKey] = { range: bin, count: 0 };
                    bins[groupKeyBinKey][stackField] = groupKey;
                }
                bins[groupKeyBinKey].count += 1;
            });
        });
    }
    // 将分箱数据转换为 plotData 才是图表所需要的
    var plotData = [];
    each(bins, function (bin) {
        plotData.push(bin);
    });
    return plotData;
}
//# sourceMappingURL=histogram.js.map