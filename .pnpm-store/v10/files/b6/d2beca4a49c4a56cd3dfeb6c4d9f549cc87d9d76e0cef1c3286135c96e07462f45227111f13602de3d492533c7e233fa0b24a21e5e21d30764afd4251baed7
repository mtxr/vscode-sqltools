import { clamp } from '@antv/util';
import { isRealNumber } from '../../utils/number';
/**
 * 获取进度条数据
 */
export function getProgressData(percent) {
    var clampPercent = clamp(isRealNumber(percent) ? percent : 0, 0, 1);
    return [
        {
            // 用于 progressStyle 的回调方法
            current: "".concat(clampPercent),
            type: 'current',
            percent: clampPercent,
        },
        {
            current: "".concat(clampPercent),
            type: 'target',
            percent: 1,
        },
    ];
}
//# sourceMappingURL=utils.js.map