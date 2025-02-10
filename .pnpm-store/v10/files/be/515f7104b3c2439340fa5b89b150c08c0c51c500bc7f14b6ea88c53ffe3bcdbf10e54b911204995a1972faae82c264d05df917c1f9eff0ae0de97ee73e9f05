import { __extends } from "tslib";
import { get } from '@antv/util';
import { Plot } from '../../core/plot';
import { findViewById } from '../../utils';
import { adaptor } from './adaptor';
import { EDGES_VIEW_ID, NODES_VIEW_ID } from './constant';
import { transformToViewsData } from './helper';
// 桑基图内置交互
import './interactions';
/**
 *  桑基图 Sankey
 */
var Sankey = /** @class */ (function (_super) {
    __extends(Sankey, _super);
    function Sankey() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'sankey';
        return _this;
    }
    Sankey.getDefaultOptions = function () {
        return {
            appendPadding: 8,
            syncViewPadding: true,
            nodeStyle: {
                opacity: 1,
                fillOpacity: 1,
                lineWidth: 1,
            },
            edgeStyle: {
                opacity: 0.3,
                lineWidth: 0,
            },
            edgeState: {
                active: {
                    style: {
                        opacity: 0.8,
                        lineWidth: 0,
                    },
                },
            },
            label: {
                formatter: function (_a) {
                    var name = _a.name;
                    return name;
                },
                callback: function (x) {
                    var isLast = x[1] === 1; // 最后一列靠边的节点
                    return {
                        style: {
                            fill: '#545454',
                            textAlign: isLast ? 'end' : 'start',
                        },
                        offsetX: isLast ? -8 : 8,
                    };
                },
                layout: [
                    {
                        type: 'hide-overlap',
                    },
                ],
            },
            tooltip: {
                showTitle: false,
                showMarkers: false,
                shared: false,
                // 内置：node 不显示 tooltip，edge 显示 tooltip
                showContent: function (items) {
                    return !get(items, [0, 'data', 'isNode']);
                },
                formatter: function (datum) {
                    var source = datum.source, target = datum.target, value = datum.value;
                    return {
                        name: source + ' -> ' + target,
                        value: value,
                    };
                },
            },
            nodeWidthRatio: 0.008,
            nodePaddingRatio: 0.01,
            animation: {
                appear: {
                    animation: 'wave-in',
                },
                enter: {
                    animation: 'wave-in',
                },
            },
        };
    };
    /**
     * @override
     * @param data
     */
    Sankey.prototype.changeData = function (data) {
        this.updateOption({ data: data });
        var _a = transformToViewsData(this.options, this.chart.width, this.chart.height), nodes = _a.nodes, edges = _a.edges;
        var nodesView = findViewById(this.chart, NODES_VIEW_ID);
        var edgesView = findViewById(this.chart, EDGES_VIEW_ID);
        nodesView.changeData(nodes);
        edgesView.changeData(edges);
    };
    /**
     * 获取适配器
     */
    Sankey.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    /**
     * 获取 条形图 默认配置
     */
    Sankey.prototype.getDefaultOptions = function () {
        return Sankey.getDefaultOptions();
    };
    return Sankey;
}(Plot));
export { Sankey };
//# sourceMappingURL=index.js.map