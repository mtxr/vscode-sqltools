import { __assign, __spreadArray } from "tslib";
import { interaction, state, theme } from '../../adaptor/common';
import { edge, polygon } from '../../adaptor/geometries';
import { addViewAnimation, flow, getAllGeometriesRecursively, pick, transformDataToNodeLinkData } from '../../utils';
import { chordLayout } from '../../utils/transform/chord';
import { EDGE_COLOR_FIELD, NODE_COLOR_FIELD, X_FIELD, Y_FIELD } from './constant';
function transformData(params) {
    // 将弦图数据放到ext中，nodeGeometry edgeGeometry使用
    var options = params.options;
    var data = options.data, sourceField = options.sourceField, targetField = options.targetField, weightField = options.weightField, nodePaddingRatio = options.nodePaddingRatio, nodeWidthRatio = options.nodeWidthRatio, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a;
    // 将数据转换为node link格式
    var chordLayoutInputData = transformDataToNodeLinkData(data, sourceField, targetField, weightField);
    var _b = chordLayout({ weight: true, nodePaddingRatio: nodePaddingRatio, nodeWidthRatio: nodeWidthRatio }, chordLayoutInputData), nodes = _b.nodes, links = _b.links;
    // 1. 生成绘制node使用数据
    var nodesData = nodes.map(function (node) {
        return __assign(__assign({}, pick(node, __spreadArray(['id', 'x', 'y', 'name'], rawFields, true))), { isNode: true });
    });
    // 2. 生成 edge 使用数据 （同桑基图）
    var edgesData = links.map(function (link) {
        return __assign(__assign({ source: link.source.name, target: link.target.name, name: link.source.name || link.target.name }, pick(link, __spreadArray(['x', 'y', 'value'], rawFields, true))), { isNode: false });
    });
    return __assign(__assign({}, params), { ext: __assign(__assign({}, params.ext), { 
            // 将chordData放到ext中，方便下面的geometry使用
            chordData: { nodesData: nodesData, edgesData: edgesData } }) });
}
/**
 * scale配置
 * @param params 参数
 */
function scale(params) {
    var _a;
    var chart = params.chart;
    chart.scale((_a = {
            x: { sync: true, nice: true },
            y: { sync: true, nice: true, max: 1 }
        },
        _a[NODE_COLOR_FIELD] = { sync: 'color' },
        _a[EDGE_COLOR_FIELD] = { sync: 'color' },
        _a));
    return params;
}
/**
 * axis配置
 * @param params 参数
 */
function axis(params) {
    var chart = params.chart;
    chart.axis(false);
    return params;
}
/**
 * legend配置
 * @param params 参数
 */
function legend(params) {
    var chart = params.chart;
    chart.legend(false);
    return params;
}
/**
 * tooltip配置
 * @param params 参数
 */
function tooltip(params) {
    var chart = params.chart, options = params.options;
    var tooltip = options.tooltip;
    chart.tooltip(tooltip);
    return params;
}
/**
 * coordinate配置
 * @param params 参数
 */
function coordinate(params) {
    var chart = params.chart;
    chart.coordinate('polar').reflect('y');
    return params;
}
/**
 * nodeGeometry配置
 * @param params 参数
 */
function nodeGeometry(params) {
    // node view
    var chart = params.chart, options = params.options;
    var nodesData = params.ext.chordData.nodesData;
    var nodeStyle = options.nodeStyle, label = options.label, tooltip = options.tooltip;
    var nodeView = chart.createView();
    nodeView.data(nodesData);
    // 面
    polygon({
        chart: nodeView,
        options: {
            xField: X_FIELD,
            yField: Y_FIELD,
            seriesField: NODE_COLOR_FIELD,
            polygon: {
                style: nodeStyle,
            },
            label: label,
            tooltip: tooltip,
        },
    });
    return params;
}
/**
 * edgeGeometry配置
 * @param params 参数
 */
function edgeGeometry(params) {
    var chart = params.chart, options = params.options;
    var edgesData = params.ext.chordData.edgesData;
    var edgeStyle = options.edgeStyle, tooltip = options.tooltip;
    var edgeView = chart.createView();
    edgeView.data(edgesData);
    // edge
    var edgeOptions = {
        xField: X_FIELD,
        yField: Y_FIELD,
        seriesField: EDGE_COLOR_FIELD,
        edge: {
            style: edgeStyle,
            shape: 'arc',
        },
        tooltip: tooltip,
    };
    edge({
        chart: edgeView,
        options: edgeOptions,
    });
    return params;
}
function animation(params) {
    var chart = params.chart, options = params.options;
    var animation = options.animation;
    addViewAnimation(chart, animation, getAllGeometriesRecursively(chart));
    return params;
}
/**
 * 弦图适配器
 * @param chart
 * @param options
 */
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(theme, transformData, coordinate, scale, axis, legend, tooltip, edgeGeometry, nodeGeometry, interaction, state, animation)(params);
}
//# sourceMappingURL=adaptor.js.map