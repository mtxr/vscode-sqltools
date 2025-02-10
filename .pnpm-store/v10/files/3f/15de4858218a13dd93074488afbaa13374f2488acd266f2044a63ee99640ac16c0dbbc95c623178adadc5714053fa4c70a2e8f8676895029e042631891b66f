import { each } from '@antv/util';
import { testLabel } from '../../util/label';
import { strLen } from '../../util/text';
function formatLabel(label, unit, suffix, precision) {
    var text = label.attr('text');
    // 轴的零值标签不参与格式化
    if (text === '0') {
        return text;
    }
    var value = parseFloat(text) / unit;
    var newText = formatText(value, precision);
    label.attr('text', "" + newText + suffix);
}
/** 根据显示空间获取数值format的精度 */
function getPrecision(labels, unit, suffix, limitLength) {
    var values = [];
    var length = [];
    each(labels, function (label) {
        values.push(parseFloat(label.attr('text')) / unit);
        length.push(label.getBBox().width);
    });
    values.sort(function (a, b) {
        return b.toString().length - a.toString().length;
    });
    var maxLength = Math.max.apply(Math, length);
    var maxCodeLength = strLen(values[0].toString());
    var suffixLength = strLen(suffix);
    var reseveLength = Math.floor((limitLength / maxLength) * maxCodeLength) - suffixLength;
    // 先尝试保留小数点后两位
    var valueCodeLength = strLen(values[0].toFixed(2));
    if (valueCodeLength <= reseveLength) {
        return 2;
    }
    // 保留小数点后1位
    valueCodeLength = strLen(values[0].toFixed(1));
    if (valueCodeLength <= reseveLength) {
        return 1;
    }
}
function formatText(value, precision) {
    return value.toFixed(precision || 0);
}
export function formatLabels(labelGroup, limitLength, unit, suffix) {
    var children = labelGroup.getChildren();
    var needFormat = false;
    each(children, function (label) {
        var rst = testLabel(label, limitLength);
        if (rst === false) {
            needFormat = true;
        }
    });
    if (needFormat) {
        var precision_1 = getPrecision(children, unit, suffix, limitLength);
        each(children, function (label) {
            formatLabel(label, unit, suffix, precision_1);
        });
        return true;
    }
    return false;
}
//# sourceMappingURL=auto-format.js.map