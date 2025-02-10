import { each, isArray } from '@antv/util';
import { getAllElements } from '../../../utils';
/**
 * 获取图表元素对应字段的值
 * @param element 图表元素
 * @param field 字段名
 * @ignore
 */
export function getElementValue(element, field) {
    var model = element.getModel();
    var record = model.data;
    var value;
    if (isArray(record)) {
        value = record[0][field];
    }
    else {
        value = record[field];
    }
    return value;
}
/**
 * @ignore
 * 清理 highlight 效果
 * @param view View 或者 Chart
 */
export function clearHighlight(view) {
    var elements = getAllElements(view);
    each(elements, function (el) {
        if (el.hasState('active')) {
            el.setState('active', false);
        }
        if (el.hasState('selected')) {
            el.setState('selected', false);
        }
        if (el.hasState('inactive')) {
            el.setState('inactive', false);
        }
    });
}
//# sourceMappingURL=utils.js.map