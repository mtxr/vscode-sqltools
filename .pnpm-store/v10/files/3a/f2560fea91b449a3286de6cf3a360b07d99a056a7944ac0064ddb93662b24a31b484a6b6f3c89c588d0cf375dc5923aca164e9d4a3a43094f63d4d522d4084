/**
 * 获取分类字段 key 值 一个分类值的时候， 返回非索引 key 值，在 tooltip 不做索引区分
 * @param values 数据量
 * @param field 指标字段
 * @param index 索引
 * @returns string
 */
function getSeriesFieldKey(values, field, index) {
    return values.length > 1 ? "".concat(field, "_").concat(index) : "".concat(field);
}
/**
 * bullet 处理数据
 * @param options
 */
export function transformData(options) {
    var data = options.data, xField = options.xField, measureField = options.measureField, rangeField = options.rangeField, targetField = options.targetField, layout = options.layout;
    var ds = [];
    var scales = [];
    data.forEach(function (item, index) {
        // 构建 title * range
        var rangeValues = [item[rangeField]].flat();
        rangeValues.sort(function (a, b) { return a - b; });
        rangeValues.forEach(function (d, i) {
            var _a;
            var range = i === 0 ? d : rangeValues[i] - rangeValues[i - 1];
            ds.push((_a = {
                    rKey: "".concat(rangeField, "_").concat(i)
                },
                _a[xField] = xField ? item[xField] : String(index),
                _a[rangeField] = range,
                _a));
        });
        // 构建 title * measure
        var measureValues = [item[measureField]].flat();
        measureValues.forEach(function (d, i) {
            var _a;
            ds.push((_a = {
                    mKey: getSeriesFieldKey(measureValues, measureField, i)
                },
                _a[xField] = xField ? item[xField] : String(index),
                _a[measureField] = d,
                _a));
        });
        // 构建 title * target
        var targetValues = [item[targetField]].flat();
        targetValues.forEach(function (d, i) {
            var _a;
            ds.push((_a = {
                    tKey: getSeriesFieldKey(targetValues, targetField, i)
                },
                _a[xField] = xField ? item[xField] : String(index),
                _a[targetField] = d,
                _a));
        });
        // 为了取最大值和最小值，先存储
        scales.push(item[rangeField], item[measureField], item[targetField]);
    });
    // scales 是嵌套的需要拍平
    var min = Math.min.apply(Math, scales.flat(Infinity));
    var max = Math.max.apply(Math, scales.flat(Infinity));
    // min 大于 0 从 0 开始
    min = min > 0 ? 0 : min;
    // 垂直情况，需要反转数据
    if (layout === 'vertical') {
        ds.reverse();
    }
    return { min: min, max: max, ds: ds };
}
//# sourceMappingURL=utils.js.map