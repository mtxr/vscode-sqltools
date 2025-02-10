"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyNodeDragAction = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var utils_1 = require("../../../../utils");
var constant_1 = require("../../constant");
var SankeyNodeDragAction = /** @class */ (function (_super) {
    tslib_1.__extends(SankeyNodeDragAction, _super);
    function SankeyNodeDragAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * 是否在拖拽中的标记
         */
        _this.isDragging = false;
        return _this;
    }
    /**
     * 当前操作的是否是 element
     */
    SankeyNodeDragAction.prototype.isNodeElement = function () {
        var shape = (0, util_1.get)(this.context, 'event.target');
        if (shape) {
            var element = shape.get('element');
            return element && element.getModel().data.isNode;
        }
        return false;
    };
    SankeyNodeDragAction.prototype.getNodeView = function () {
        return (0, utils_1.findViewById)(this.context.view, constant_1.NODES_VIEW_ID);
    };
    SankeyNodeDragAction.prototype.getEdgeView = function () {
        return (0, utils_1.findViewById)(this.context.view, constant_1.EDGES_VIEW_ID);
    };
    /**
     * 获取当前操作的 index
     * @param element
     */
    SankeyNodeDragAction.prototype.getCurrentDatumIdx = function (element) {
        return this.getNodeView().geometries[0].elements.indexOf(element);
    };
    /**
     * 点击下去，开始
     */
    SankeyNodeDragAction.prototype.start = function () {
        // 记录开始了的状态
        if (this.isNodeElement()) {
            this.prevPoint = {
                x: (0, util_1.get)(this.context, 'event.x'),
                y: (0, util_1.get)(this.context, 'event.y'),
            };
            var element = this.context.event.target.get('element');
            var idx = this.getCurrentDatumIdx(element);
            if (idx === -1) {
                return;
            }
            this.currentElementIdx = idx;
            this.context.isDragging = true;
            this.isDragging = true;
            // 关闭动画并暂存配置
            this.prevNodeAnimateCfg = this.getNodeView().getOptions().animate;
            this.prevEdgeAnimateCfg = this.getEdgeView().getOptions().animate;
            this.getNodeView().animate(false);
            this.getEdgeView().animate(false);
        }
    };
    /**
     * 移动过程中，平移
     */
    SankeyNodeDragAction.prototype.translate = function () {
        if (this.isDragging) {
            var chart = this.context.view;
            var currentPoint = {
                x: (0, util_1.get)(this.context, 'event.x'),
                y: (0, util_1.get)(this.context, 'event.y'),
            };
            var x = currentPoint.x - this.prevPoint.x;
            var y = currentPoint.y - this.prevPoint.y;
            var nodeView = this.getNodeView();
            var element = nodeView.geometries[0].elements[this.currentElementIdx];
            // 修改数据
            if (element && element.getModel()) {
                var prevDatum = element.getModel().data;
                var data = nodeView.getOptions().data;
                var coordinate = nodeView.getCoordinate();
                var datumGap_1 = {
                    x: x / coordinate.getWidth(),
                    y: y / coordinate.getHeight(),
                };
                var nextDatum = tslib_1.__assign(tslib_1.__assign({}, prevDatum), { x: prevDatum.x.map(function (x) { return (x += datumGap_1.x); }), y: prevDatum.y.map(function (y) { return (y += datumGap_1.y); }) });
                // 处理一下在 [0, 1] 范围
                // 1. 更新 node 数据
                var newData = tslib_1.__spreadArray([], data, true);
                newData[this.currentElementIdx] = nextDatum;
                nodeView.data(newData);
                // 2. 更新 edge 数据
                var name_1 = prevDatum.name;
                var edgeView = this.getEdgeView();
                var edgeData = edgeView.getOptions().data;
                edgeData.forEach(function (datum) {
                    // 2.1 以该 node 为 source 的边，修改 [x0, x1, x2, x3] 中的 x0, x1
                    if (datum.source === name_1) {
                        datum.x[0] += datumGap_1.x;
                        datum.x[1] += datumGap_1.x;
                        datum.y[0] += datumGap_1.y;
                        datum.y[1] += datumGap_1.y;
                    }
                    // 2.2 以该 node 为 target 的边，修改 [x0, x1, x2, x3] 中的 x2, x3
                    if (datum.target === name_1) {
                        datum.x[2] += datumGap_1.x;
                        datum.x[3] += datumGap_1.x;
                        datum.y[2] += datumGap_1.y;
                        datum.y[3] += datumGap_1.y;
                    }
                });
                edgeView.data(edgeData);
                // 3. 更新最新位置
                this.prevPoint = currentPoint;
                // node edge 都改变了，所以要从底层 render
                chart.render(true);
            }
        }
    };
    /**
     * 结论，清除状态
     */
    SankeyNodeDragAction.prototype.end = function () {
        this.isDragging = false;
        this.context.isDragging = false;
        this.prevPoint = null;
        this.currentElementIdx = null;
        // 还原动画
        this.getNodeView().animate(this.prevNodeAnimateCfg);
        this.getEdgeView().animate(this.prevEdgeAnimateCfg);
    };
    return SankeyNodeDragAction;
}(g2_1.Action));
exports.SankeyNodeDragAction = SankeyNodeDragAction;
//# sourceMappingURL=node-drag.js.map