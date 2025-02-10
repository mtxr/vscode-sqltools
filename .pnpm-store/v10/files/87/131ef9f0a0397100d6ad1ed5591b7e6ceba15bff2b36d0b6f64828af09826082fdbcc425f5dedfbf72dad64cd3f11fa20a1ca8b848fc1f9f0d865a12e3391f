import { get } from '@antv/util';
/**
 * 获得 tooltip 的映射信息
 * @param tooltip
 * @param defaultFields
 */
export function getTooltipMapping(tooltip, defaultFields) {
    if (tooltip === false) {
        return {
            fields: false, // 关闭 tooltip
        };
    }
    var fields = get(tooltip, 'fields');
    var formatter = get(tooltip, 'formatter');
    if (formatter && !fields) {
        fields = defaultFields;
    }
    return {
        fields: fields,
        formatter: formatter,
    };
}
//# sourceMappingURL=tooltip.js.map