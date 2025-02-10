import { map } from '@antv/util';
import { BOX_RANGE } from './constant';
/**
 * @desc 将数据转换为 box 需要的的图表数据,如果yField为数组,从data中解构出对应数组值并写入data,否则直接返回data
 * @param data
 * @param yField
 */
export var transformData = function (data, yField) {
    var newData = data;
    // formate data when `yField` is Array
    if (Array.isArray(yField)) {
        var low_1 = yField[0], q1_1 = yField[1], median_1 = yField[2], q3_1 = yField[3], high_1 = yField[4];
        newData = map(data, function (obj) {
            obj[BOX_RANGE] = [obj[low_1], obj[q1_1], obj[median_1], obj[q3_1], obj[high_1]];
            return obj;
        });
    }
    return newData;
};
//# sourceMappingURL=utils.js.map