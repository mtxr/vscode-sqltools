import { __spreadArray } from "tslib";
import { uniq } from '@antv/util';
import { theme } from '../../adaptor/common';
import { edge, polygon } from '../../adaptor/geometries';
import { deepAssign, findViewById, flow } from '../../utils';
import { addViewAnimation } from '../../utils/view';
import { COLOR_FIELD, EDGES_VIEW_ID, NODES_VIEW_ID, X_FIELD, Y_FIELD } from './constant';
import { transformToViewsData } from './helper';
/**
 * 默认配置项 处理
 * @param params
 */
function defaultOptions(params) {
    var options = params.options;
    var _a = options.rawFields, rawFields = _a === void 0 ? [] : _a;
    return deepAssign({}, {
        options: {
            tooltip: {
                fields: uniq(__spreadArray(['name', 'source', 'target', 'value', 'isNode'], rawFields, true)),
            },
            label: {
                fields: uniq(__spreadArray(['x', 'name'], rawFields, true)),
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
    var _b = transformToViewsData(options, chart.width, chart.height), nodes = _b.nodes, edges = _b.edges;
    // edge view
    var edgeView = chart.createView({ id: EDGES_VIEW_ID });
    edgeView.data(edges);
    edge({
        chart: edgeView,
        // @ts-ignore
        options: {
            xField: X_FIELD,
            yField: Y_FIELD,
            seriesField: COLOR_FIELD,
            rawFields: __spreadArray(['source', 'target'], rawFields, true),
            edge: {
                color: color,
                style: edgeStyle,
                shape: 'arc',
            },
            tooltip: tooltip,
            state: edgeState,
        },
    });
    var nodeView = chart.createView({ id: NODES_VIEW_ID });
    nodeView.data(nodes);
    polygon({
        chart: nodeView,
        options: {
            xField: X_FIELD,
            yField: Y_FIELD,
            seriesField: COLOR_FIELD,
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
export function animation(params) {
    var chart = params.chart, options = params.options;
    var animation = options.animation;
    var geometries = __spreadArray(__spreadArray([], chart.views[0].geometries, true), chart.views[1].geometries, true);
    addViewAnimation(chart, animation, geometries);
    return params;
}
/**
 * 节点拖动
 * @param params
 */
export function nodeDraggable(params) {
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
/**
 * Interaction 配置
 * @param params
 */
function interaction(params) {
    var chart = params.chart, options = params.options;
    var _a = options.interactions, interactions = _a === void 0 ? [] : _a;
    var nodeInteractions = [].concat(interactions, options.nodeInteractions || []);
    var edgeInteractions = [].concat(interactions, options.edgeInteractions || []);
    var nodeView = findViewById(chart, NODES_VIEW_ID);
    var edgeView = findViewById(chart, EDGES_VIEW_ID);
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
export function adaptor(params) {
    // flow 的方式处理所有的配置到 G2 API
    return flow(defaultOptions, geometry, interaction, nodeDraggable, animation, theme
    // ... 其他的 adaptor flow
    )(params);
}
//# sourceMappingURL=adaptor.js.map