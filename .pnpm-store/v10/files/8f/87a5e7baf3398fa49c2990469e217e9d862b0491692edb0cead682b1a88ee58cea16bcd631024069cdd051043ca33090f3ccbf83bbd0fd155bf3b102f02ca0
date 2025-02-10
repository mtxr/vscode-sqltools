import { __assign } from "tslib";
import { isType } from '@antv/util';
/**
 * 兼容 v1 label formatter
 * @param labelOptions
 */
export function transformLabel(labelOptions) {
    if (!isType(labelOptions, 'Object')) {
        return labelOptions;
    }
    var label = __assign({}, labelOptions);
    if (label.formatter && !label.content) {
        label.content = label.formatter;
    }
    return label;
}
//# sourceMappingURL=label.js.map