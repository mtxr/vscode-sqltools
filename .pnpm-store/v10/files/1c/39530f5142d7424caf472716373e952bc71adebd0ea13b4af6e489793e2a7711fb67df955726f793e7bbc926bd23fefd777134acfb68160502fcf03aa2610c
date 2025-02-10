import { __spreadArray } from "tslib";
import { get, isFunction } from '@antv/util';
import { animation, interaction, scale, state, theme, tooltip } from '../../adaptor/common';
import { point } from '../../adaptor/geometries';
import { deepAssign, flow } from '../../utils';
import { WORD_CLOUD_COLOR_FIELD } from './constant';
import { transform } from './utils';
/**
 * geometry 配置处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var colorField = options.colorField, color = options.color;
    var data = transform(params);
    chart.data(data);
    var p = deepAssign({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            seriesField: colorField && WORD_CLOUD_COLOR_FIELD,
            rawFields: isFunction(color) && __spreadArray(__spreadArray([], get(options, 'rawFields', []), true), ['datum'], false),
            point: {
                color: color,
                shape: 'word-cloud',
            },
        },
    });
    var ext = point(p).ext;
    ext.geometry.label(false);
    chart.coordinate().reflect('y');
    chart.axis(false);
    return params;
}
/**
 * meta 配置
 * @param params
 */
function meta(params) {
    return flow(scale({
        x: { nice: false },
        y: { nice: false },
    }))(params);
}
/**
 * 词云图 legend 配置
 * @param params
 */
export function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, colorField = options.colorField;
    if (legend === false) {
        chart.legend(false);
    }
    else if (colorField) {
        chart.legend(WORD_CLOUD_COLOR_FIELD, legend);
    }
    return params;
}
/**
 * 词云图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    flow(geometry, meta, tooltip, legend, interaction, animation, theme, state)(params);
}
//# sourceMappingURL=adaptor.js.map