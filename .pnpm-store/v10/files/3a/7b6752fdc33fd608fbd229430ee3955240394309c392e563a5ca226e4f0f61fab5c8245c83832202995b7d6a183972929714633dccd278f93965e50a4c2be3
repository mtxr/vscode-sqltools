import { __spreadArray } from "tslib";
import { get } from '@antv/util';
import { animation, annotation, interaction as commonInteraction, legend, theme, tooltip } from '../../adaptor/common';
import { polygon as basePolygon } from '../../adaptor/geometries/polygon';
import { pattern } from '../../adaptor/pattern';
import { deepAssign, flow } from '../../utils';
import { getAdjustAppendPadding } from '../../utils/padding';
import { enableDrillInteraction, findInteraction, transformData } from './utils';
/**
 * 获取默认 option
 * @param params
 */
function defaultOptions(params) {
    var options = params.options;
    var colorField = options.colorField;
    return deepAssign({
        options: {
            rawFields: ['value'],
            tooltip: {
                fields: ['name', 'value', colorField, 'path'],
                formatter: function (data) {
                    return {
                        name: data.name,
                        value: data.value,
                    };
                },
            },
        },
    }, params);
}
/**
 * 字段
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var color = options.color, colorField = options.colorField, rectStyle = options.rectStyle, hierarchyConfig = options.hierarchyConfig, rawFields = options.rawFields;
    var data = transformData({
        data: options.data,
        colorField: options.colorField,
        enableDrillDown: enableDrillInteraction(options),
        hierarchyConfig: hierarchyConfig,
    });
    chart.data(data);
    // geometry
    basePolygon(deepAssign({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            seriesField: colorField,
            rawFields: rawFields,
            polygon: {
                color: color,
                style: rectStyle,
            },
        },
    }));
    // 做一个反转，这样配合排序，可以将最大值放到左上角，最小值放到右下角
    chart.coordinate().reflect('y');
    return params;
}
/**
 * 坐标轴
 * @param params
 */
function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
function adaptorInteraction(options) {
    var drilldown = options.drilldown, _a = options.interactions, interactions = _a === void 0 ? [] : _a;
    var enableDrillDown = enableDrillInteraction(options);
    if (enableDrillDown) {
        return deepAssign({}, options, {
            interactions: __spreadArray(__spreadArray([], interactions, true), [
                {
                    type: 'drill-down',
                    // 🚓 这不是一个规范的 API，后续会变更。慎重参考
                    cfg: { drillDownConfig: drilldown, transformData: transformData },
                },
            ], false),
        });
    }
    return options;
}
/**
 * Interaction 配置
 * @param params
 */
export function interaction(params) {
    var chart = params.chart, options = params.options;
    var interactions = options.interactions, drilldown = options.drilldown;
    commonInteraction({
        chart: chart,
        options: adaptorInteraction(options),
    });
    // 适配 view-zoom
    var viewZoomInteraction = findInteraction(interactions, 'view-zoom');
    if (viewZoomInteraction) {
        // 开启缩放 interaction 后，则阻止默认滚动事件，避免整个窗口的滚动
        if (viewZoomInteraction.enable !== false) {
            chart.getCanvas().on('mousewheel', function (ev) {
                ev.preventDefault();
            });
        }
        else {
            // 手动关闭后，清除。仅对声明 viewZoomInteraction 的清除。
            chart.getCanvas().off('mousewheel');
        }
    }
    // 适应下钻交互面包屑
    var enableDrillDown = enableDrillInteraction(options);
    if (enableDrillDown) {
        // 为面包屑在底部留出 25px 的空间
        chart.appendPadding = getAdjustAppendPadding(chart.appendPadding, get(drilldown, ['breadCrumb', 'position']));
    }
    return params;
}
/**
 * 矩形树图
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(defaultOptions, theme, pattern('rectStyle'), geometry, axis, legend, tooltip, interaction, animation, annotation())(params);
}
//# sourceMappingURL=adaptor.js.map