import { each, every, isString } from '@antv/util';
import { processIllegalData } from '../../utils';
/**
 * 获取总计值
 * @param data
 * @param field
 */
export function getTotalValue(data, field) {
    var total = null;
    each(data, function (item) {
        if (typeof item[field] === 'number') {
            total += item[field];
        }
    });
    return total;
}
/**
 * pie label offset adaptor
 */
export function adaptOffset(type, offset) {
    var defaultOffset;
    switch (type) {
        case 'inner':
            defaultOffset = '-30%';
            if (isString(offset) && offset.endsWith('%')) {
                return parseFloat(offset) * 0.01 > 0 ? defaultOffset : offset;
            }
            return offset < 0 ? offset : defaultOffset;
        case 'outer':
            defaultOffset = 12;
            if (isString(offset) && offset.endsWith('%')) {
                return parseFloat(offset) * 0.01 < 0 ? defaultOffset : offset;
            }
            return offset > 0 ? offset : defaultOffset;
        default:
            return offset;
    }
}
/**
 * 判断数据是否全部为 0
 * @param data
 * @param angleField
 */
export function isAllZero(data, angleField) {
    return every(processIllegalData(data, angleField), function (d) { return d[angleField] === 0; });
}
//# sourceMappingURL=utils.js.map