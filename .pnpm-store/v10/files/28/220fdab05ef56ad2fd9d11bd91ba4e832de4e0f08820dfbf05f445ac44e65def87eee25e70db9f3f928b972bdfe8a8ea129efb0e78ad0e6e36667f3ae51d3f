"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = exports.nodeDraggable = exports.animation = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var common_1 = require("../../adaptor/common");
var geometries_1 = require("../../adaptor/geometries");
var utils_1 = require("../../utils");
var view_1 = require("../../utils/view");
var constant_1 = require("./constant");
var helper_1 = require("./helper");
/**
 * 默认配置项 处理
 * @param params
 */
function defaultOptions(params) {
    var options = params.options;
    var _a = options.rawFields, rawFields = _a === void 0 ? [] : _a;
    return (0, utils_1.deepAssign)({}, {
        options: {
            tooltip: {
                fields: (0, util_1.uniq)(tslib_1.__spreadArray(['name', 'source', 'target', 'value', 'isNode'], rawFields, true)),
            },
            label: {
                fields: (0, util_1.uniq)(tslib_1.__spreadArray(['x', 'name'], rawFields, true)),
            },
        },
    }, params);
}
/**
 * geometry 处理
 * @param params
 */
function geometry(params) {
    var chart = params.chart, options = params.options;
    var color = options.color, nodeStyle = options.nodeStyle, edgeStyle = options.edgeStyle, label = options.label, tooltip = options.tooltip, nodeState = options.nodeState, edgeState = options.edgeState, _a = options.rawFields, rawFields = _a === void 0 ? [] : _a;
    // 1. 组件，优先设置，因为子 view 会继承配置
    chart.legend(false);
    chart.tooltip(tooltip);
    chart.axis(false);
    // y 镜像一下，防止图形顺序和数据顺序反了
    chart.coordinate().reflect('y');
    // 2. node edge views
    // @ts-ignore
    var _b = (0, helper_1.transformToViewsData)(options, chart.width, chart.height), nodes = _b.nodes, edges = _b.edges;
    // edge view
    var edgeView = chart.createView({ id: constant_1.EDGES_VIEW_ID });
    edgeView.data(edges);
    (0, geometries_1.edge)({
        chart: edgeView,
        // @ts-ignore
        options: {
            xField: constant_1.X_FIELD,
            yField: constant_1.Y_FIELD,
            seriesField: constant_1.COLOR_FIELD,
            rawFields: tslib_1.__spreadArray(['source', 'target'], rawFields, true),
            edge: {
                color: color,
                style: edgeStyle,
                shape: 'arc',
            },
            tooltip: tooltip,
            state: edgeState,
        },
    });
    var nodeView = chart.createView({ id: constant_1.NODES_VIEW_ID });
    nodeView.data(nodes);
    (0, geometries_1.polygon)({
        chart: nodeView,
        options: {
            xField: constant_1.X_FIELD,
            yField: constant_1.Y_FIELD,
            seriesField: constant_1.COLOR_FIELD,
            polygon: {
                color: color,
                style: nodeStyle,
            },
            label: label,
            tooltip: tooltip,
            state: nodeState,
        },
    });
    chart.interaction('element-active');
    // scale
    chart.scale({
        x: { sync: true, nice: true, min: 0, max: 1, minLimit: 0, maxLimit: 1 },
        y: { sync: true, nice: true, min: 0, max: 1, minLimit: 0, maxLimit: 1 },
        name: { sync: 'color', type: 'cat' },
    });
    return params;
}
/**
 * 动画
 * @param params
 */
function animation(params) {
    var chart = params.chart, options = params.options;
    var animation = options.animation;
    var geometries = tslib_1.__spreadArray(tslib_1.__spreadArray([], chart.views[0].geometries, true), chart.views[1].geometries, true);
    (0, view_1.addViewAnimation)(chart, animation, geometries);
    return params;
}
exports.animation = animation;
/**
 * 节点拖动
 * @param params
 */
function nodeDraggable(params) {
    var chart = params.chart, options = params.options;
    var nodeDraggable = options.nodeDraggable;
    var DRAG_INTERACTION = 'sankey-node-draggable';
    if (nodeDraggable) {
        chart.interaction(DRAG_INTERACTION);
    }
    else {
        chart.removeInteraction(DRAG_INTERACTION);
    }
    return params;
}
exports.nodeDraggable = nodeDraggable;
/**
 * Interaction 配置
 * @param params
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    var _a = options.interactions, interactions = _a === void 0 ? [] : _a;
    var nodeInteractions = [].concat(interactions, options.nodeInteractions || []);
    var edgeInteractions = [].concat(interactions, options.edgeInteractions || []);
    var nodeView = (0, utils_1.findViewById)(chart, constant_1.NODES_VIEW_ID);
    var edgeView = (0, utils_1.findViewById)(chart, constant_1.EDGES_VIEW_ID);
    nodeInteractions.forEach(function (i) {
        if ((i === null || i === void 0 ? void 0 : i.enable) === false) {
            nodeView.removeInteraction(i.type);
        }
        else {
            nodeView.interaction(i.type, i.cfg || {});
        }
    });
    edgeInteractions.forEach(function (i) {
        if ((i === null || i === void 0 ? void 0 : i.enable) === false) {
            edgeView.removeInteraction(i.type);
        }
        else {
            edgeView.interaction(i.type, i.cfg || {});
        }
    });
    return params;
}
/**
 * 图适配器
 * @param chart
 * @param options
 */
function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return (0, utils_1.flow)(defaultOptions, geometry, interaction, nodeDraggable, animation, common_1.theme
    // ... 其他的 adaptor flow
    )(params);
}
exports.adaptor = adaptor;
//# sourceMappingURL=adaptor.js.map