"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = void 0;
var tslib_1 = require("tslib");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var chord_1 = require("../../utils/transform/chord");
var constant_1 = require("./constant");
function transformData(params) {
    // 将弦图数据放到ext中，nodeGeometry edgeGeometry使用
    var options = params.options;
    var data = options.data, sourceField = options.sourceField, targetField = options.targetField, weightField = options.weightField, nodePaddingRatio = options.nodePaddingRatio, nodeWidthRatio = options.nodeWidthRatio, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a;
    // 将数据转换为node link格式
    var chordLayoutInputData = (0, utils_1.transformDataToNodeLinkData)(data, sourceField, targetField, weightField);
    var _b = (0, chord_1.chordLayout)({ weight: true, nodePaddingRatio: nodePaddingRatio, nodeWidthRatio: nodeWidthRatio }, chordLayoutInputData), nodes = _b.nodes, links = _b.links;
    // 1. 生成绘制node使用数据
    var nodesData = nodes.map(function (node) {
        return tslib_1.__assign(tslib_1.__assign({}, (0, utils_1.pick)(node, tslib_1.__spreadArray(['id', 'x', 'y', 'name'], rawFields, true))), { isNode: true });
    });
    // 2. 生成 edge 使用数据 （同桑基图）
    var edgesData = links.map(function (link) {
        return tslib_1.__assign(tslib_1.__assign({ source: link.source.name, target: link.target.name, name: link.source.name || link.target.name }, (0, utils_1.pick)(link, tslib_1.__spreadArray(['x', 'y', 'value'], rawFields, true))), { isNode: false });
    });
    return tslib_1.__assign(tslib_1.__assign({}, params), { ext: tslib_1.__assign(tslib_1.__assign({}, params.ext), { 
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
        _a[constant_1.NODE_COLOR_FIELD] = { sync: 'color' },
        _a[constant_1.EDGE_COLOR_FIELD] = { sync: 'color' },
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
    (0, geometries_1.polygon)({
        chart: nodeView,
        options: {
            xField: constant_1.X_FIELD,
            yField: constant_1.Y_FIELD,
            seriesField: constant_1.NODE_COLOR_FIELD,
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
        xField: constant_1.X_FIELD,
        yField: constant_1.Y_FIELD,
        seriesField: constant_1.EDGE_COLOR_FIELD,
        edge: {
            style: edgeStyle,
            shape: 'arc',
        },
        tooltip: tooltip,
    };
    (0, geometries_1.edge)({
        chart: edgeView,
        options: edgeOptions,
    });
    return params;
}
function animation(params) {
    var chart = params.chart, options = params.options;
    var animation = options.animation;
    (0, utils_1.addViewAnimation)(chart, animation, (0, utils_1.getAllGeometriesRecursively)(chart));
    return params;
}
/**
 * 弦图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(common_1.theme, transformData, coordinate, scale, axis, legend, tooltip, edgeGeometry, nodeGeometry, common_1.interaction, common_1.state, animation)(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map