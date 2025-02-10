import { __assign } from "tslib";
import { each } from '@antv/util';
import { line, point } from '../../../adaptor/geometries';
import { deepAssign, pick } from '../../../utils';
import { adaptor as columnAdaptor } from '../../column/adaptor';
import { isColumn, isLine } from './option';
/**
 * 绘制单个图形
 * @param params
 */
export function drawSingleGeometry(params) {
    var options = params.options, chart = params.chart;
    var geometryOption = options.geometryOption;
    var isStack = geometryOption.isStack, color = geometryOption.color, seriesField = geometryOption.seriesField, groupField = geometryOption.groupField, isGroup = geometryOption.isGroup;
    var FIELD_KEY = ['xField', 'yField'];
    if (isLine(geometryOption)) {
        // 绘制线
        line(deepAssign({}, params, {
            options: __assign(__assign(__assign({}, pick(options, FIELD_KEY)), geometryOption), { line: {
                    color: geometryOption.color,
                    style: geometryOption.lineStyle,
                } }),
        }));
        // 绘制点
        point(deepAssign({}, params, {
            options: __assign(__assign(__assign({}, pick(options, FIELD_KEY)), geometryOption), { point: geometryOption.point && __assign({ color: color, shape: 'circle' }, geometryOption.point) }),
        }));
        // adjust
        var adjust_1 = [];
        if (isGroup) {
            adjust_1.push({
                type: 'dodge',
                dodgeBy: groupField || seriesField,
                customOffset: 0,
            });
        }
        if (isStack) {
            adjust_1.push({
                type: 'stack',
            });
        }
        if (adjust_1.length) {
            each(chart.geometries, function (g) {
                g.adjust(adjust_1);
            });
        }
    }
    if (isColumn(geometryOption)) {
        columnAdaptor(deepAssign({}, params, {
            options: __assign(__assign(__assign({}, pick(options, FIELD_KEY)), geometryOption), { widthRatio: geometryOption.columnWidthRatio, interval: __assign(__assign({}, pick(geometryOption, ['color'])), { style: geometryOption.columnStyle }) }),
        }));
    }
    return params;
}
//# sourceMappingURL=geometry.js.map