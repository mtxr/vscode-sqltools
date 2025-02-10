import { __assign, __rest } from "tslib";
import { deepMix, get, isArray, isEqual } from '@antv/util';
import { animation, interaction, scale, theme, tooltip } from '../../adaptor/common';
import { schema as schemaGeometry } from '../../adaptor/geometries';
import { deepAssign, findGeometry, flow, getAdjustAppendPadding, LEVEL, log, normalPadding, resolveAllPadding, transformLabel, } from '../../utils';
import { ID_FIELD } from './constant';
import './interactions';
import './label';
import './shape';
import { getColorMap, islegalSets, layoutVennData } from './utils';
/** 图例默认预留空间 */
export var LEGEND_SPACE = 40;
/**
 * 获取 color 映射
 */
function colorMap(params, data, colorPalette) {
    var chart = params.chart, options = params.options;
    var blendMode = options.blendMode, setsField = options.setsField;
    var _a = chart.getTheme(), colors10 = _a.colors10, colors20 = _a.colors20;
    var palette = colorPalette;
    if (!isArray(palette)) {
        palette = data.filter(function (d) { return d[setsField].length === 1; }).length <= 10 ? colors10 : colors20;
    }
    var map = getColorMap(palette, data, blendMode, setsField);
    return function (id) { return map.get(id) || palette[0]; };
}
/**
 * color options 转换
 */
function transformColor(params, data) {
    var options = params.options;
    var color = options.color;
    if (typeof color !== 'function') {
        var colorPalette = typeof color === 'string' ? [color] : color;
        var map_1 = colorMap(params, data, colorPalette);
        return function (datum) { return map_1(datum[ID_FIELD]); };
    }
    return color;
}
/**
 * 处理 padding
 */
function padding(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, appendPadding = options.appendPadding, padding = options.padding;
    // 处理 legend 的位置. 默认预留 40px, 业务上可以通过 appendPadding 增加
    var tempPadding = normalPadding(appendPadding);
    if (legend !== false) {
        tempPadding = getAdjustAppendPadding(appendPadding, get(legend, 'position'), LEGEND_SPACE);
    }
    chart.appendPadding = resolveAllPadding([tempPadding, padding]);
    return params;
}
/**
 * 处理非法数据
 * @param params
 */
function data(params) {
    var options = params.options;
    /* 如遇到 交集 中存在 非法元素 的情况，就过滤掉
     * 如：
     * data = [
     *   { sets: ['A'], size: 3 }, // 集合
     *   { sets: ['B'], size: 4 }, // 集合
     *   { sets: ['A', 'B'], size: 2 }, // 交集
     *   { sets: ['A', 'B', 'C'], size: 2 }, // 交集 (存在非法 C，过滤该条数据)
     *   ...
     * ]
     */
    var data = options['data'];
    if (!data) {
        log(LEVEL.WARN, false, 'warn: %s', '数据不能为空');
        data = [];
    }
    // 合法元素的集合：['A', 'B']
    var currSets = data.filter(function (datum) { return datum.sets.length === 1; }).map(function (datum) { return datum.sets[0]; });
    // 过滤 data
    var filterSets = data.filter(function (datum) {
        var sets = datum.sets;
        // 存在非法元素，就过滤这条数据
        return islegalSets(currSets, sets);
    });
    if (!isEqual(filterSets, data))
        log(LEVEL.WARN, false, 'warn: %s', '交集中不能出现不存在的集合, 请输入合法数据');
    return deepMix({}, params, {
        options: {
            data: filterSets,
        },
    });
}
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var pointStyle = options.pointStyle, setsField = options.setsField, sizeField = options.sizeField;
    // 获取容器大小
    var _a = normalPadding(chart.appendPadding), t = _a[0], r = _a[1], b = _a[2], l = _a[3];
    // 处理 legend 的位置. 默认预留 40px, 业务上可以通过 appendPadding 增加
    var customInfo = { offsetX: l, offsetY: t };
    // coordinateBBox + appendPadding = viewBBox, 不需要再计算 appendPadding 部分，因此直接使用 viewBBox
    var _b = chart.viewBBox, width = _b.width, height = _b.height;
    // 处理padding输入不合理的情况， w 和 h 不能为负数
    var vennData = layoutVennData(options, Math.max(width - (r + l), 0), Math.max(height - (t + b), 0), 0);
    chart.data(vennData);
    var ext = schemaGeometry(deepAssign({}, params, {
        options: {
            xField: 'x',
            yField: 'y',
            sizeField: sizeField,
            seriesField: ID_FIELD,
            rawFields: [setsField, sizeField],
            schema: {
                shape: 'venn',
                style: pointStyle,
            },
        },
    })).ext;
    var geometry = ext.geometry;
    geometry.customInfo(customInfo);
    var colorOptions = transformColor(params, vennData);
    // 韦恩图试点, color 通道只能映射一个字段. 通过外部查找获取 datum
    if (typeof colorOptions === 'function') {
        geometry.color(ID_FIELD, function (id) {
            var datum = vennData.find(function (d) { return d[ID_FIELD] === id; });
            var defaultColor = colorMap(params, vennData)(id);
            return colorOptions(datum, defaultColor);
        });
    }
    return params;
}
/**
 * 处理 label
 * @param params
 */
function label(params) {
    var chart = params.chart, options = params.options;
    var label = options.label;
    // 获取容器大小
    var _a = normalPadding(chart.appendPadding), t = _a[0], l = _a[3];
    // 传入 label 布局函数所需的 自定义参数
    var customLabelInfo = { offsetX: l, offsetY: t };
    var geometry = findGeometry(chart, 'schema');
    if (!label) {
        geometry.label(false);
    }
    else {
        var callback = label.callback, cfg = __rest(label, ["callback"]);
        geometry.label({
            fields: ['id'],
            callback: callback,
            cfg: deepMix({}, transformLabel(cfg), {
                // 使用 G2 的 自定义label 修改位置
                type: 'venn',
                customLabelInfo: customLabelInfo,
            }),
        });
    }
    return params;
}
/**
 * legend 配置
 * @param params
 */
export function legend(params) {
    var chart = params.chart, options = params.options;
    var legend = options.legend, sizeField = options.sizeField;
    chart.legend(ID_FIELD, legend);
    // 强制不开启 连续图例
    chart.legend(sizeField, false);
    return params;
}
/**
 * 默认关闭坐标轴
 * @param params
 */
export function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
/**
 * 韦恩图 interaction 交互适配器
 */
function vennInteraction(params) {
    var options = params.options, chart = params.chart;
    var interactions = options.interactions;
    if (interactions) {
        var MAP_1 = {
            'legend-active': 'venn-legend-active',
            'legend-highlight': 'venn-legend-highlight',
        };
        interaction(deepAssign({}, params, {
            options: {
                interactions: interactions.map(function (i) { return (__assign(__assign({}, i), { type: MAP_1[i.type] || i.type })); }),
            },
        }));
    }
    chart.removeInteraction('legend-active');
    chart.removeInteraction('legend-highlight');
    return params;
}
/**
 * 图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(padding, theme, data, geometry, label, scale({}), legend, axis, tooltip, vennInteraction, animation
    // ... 其他的 adaptor flow
    )(params);
}
//# sourceMappingURL=adaptor.js.map