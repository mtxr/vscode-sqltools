"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrillDownAction = exports.HIERARCHY_DATA_TRANSFORM_PARAMS = exports.DEFAULT_BREAD_CRUMB_CONFIG = exports.BREAD_CRUMB_NAME = exports.PADDING_TOP = void 0;
var tslib_1 = require("tslib");
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var deep_assign_1 = require("../../utils/deep-assign");
// 面包屑文字和分割符'/'之间的距离
var PADDING = 4;
// 面包屑位置距离树图的距离
var PADDING_LEFT = 0;
// 面包屑位置距离树图的顶部距离
exports.PADDING_TOP = 5;
/** Group name of breadCrumb: 面包屑 */
exports.BREAD_CRUMB_NAME = 'drilldown-bread-crumb';
// 面包屑默认配置
exports.DEFAULT_BREAD_CRUMB_CONFIG = {
    /** 位置，默认：左上角 */
    position: 'top-left',
    dividerText: '/',
    textStyle: {
        fontSize: 12,
        fill: 'rgba(0, 0, 0, 0.65)',
        cursor: 'pointer',
    },
    activeTextStyle: {
        fill: '#87B5FF',
    },
};
/**
 * hierarchy 数据转换的参数
 */
exports.HIERARCHY_DATA_TRANSFORM_PARAMS = 'hierarchy-data-transform-params';
/**
 * @description 下钻交互的 action
 * @author liuzhenying
 *
 * 适用于：hierarchy plot
 */
var DrillDownAction = /** @class */ (function (_super) {
    tslib_1.__extends(DrillDownAction, _super);
    function DrillDownAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Action name */
        _this.name = 'drill-down';
        // 存储历史下钻数据
        _this.historyCache = [];
        // 面包屑 group
        _this.breadCrumbGroup = null;
        // 面包屑基础配置
        _this.breadCrumbCfg = exports.DEFAULT_BREAD_CRUMB_CONFIG;
        return _this;
    }
    /**
     * 点击事件, 下钻数据，并绘制面包屑
     */
    DrillDownAction.prototype.click = function () {
        var data = (0, util_1.get)(this.context, ['event', 'data', 'data']);
        if (!data)
            return false;
        this.drill(data);
        this.drawBreadCrumb();
    };
    /**
     * 重置位置，初始化及触发 chart  afterchangesize 回调时使用
     */
    DrillDownAction.prototype.resetPosition = function () {
        // 当在第一层级未绘制面包屑，此时 changedata 触发 resetPosition 函数，需判断 this.breadCrumbGroup 是否存在
        if (!this.breadCrumbGroup)
            return;
        var coordinate = this.context.view.getCoordinate();
        var breadCrumbGroup = this.breadCrumbGroup;
        var bbox = breadCrumbGroup.getBBox();
        var position = this.getButtonCfg().position;
        // @todo 后续抽取一个函数来处理，以及增加 margin 或者 padding 的设置
        // 非 polar 的，需要使用 coordinate，除却图表组件
        var point = { x: coordinate.start.x, y: coordinate.end.y - (bbox.height + exports.PADDING_TOP * 2) };
        if (coordinate.isPolar) {
            // 默认，左上角直接出发
            point = { x: 0, y: 0 };
        }
        if (position === 'bottom-left') {
            // 涉及到坐标反转的问题
            point = { x: coordinate.start.x, y: coordinate.start.y };
        }
        /** PADDING_LEFT, PADDING_TOP 与画布边缘的距离 */
        var matrix = g2_1.Util.transform(null, [['t', point.x + PADDING_LEFT, point.y + bbox.height + exports.PADDING_TOP]]);
        breadCrumbGroup.setMatrix(matrix);
    };
    /**
     * 返回上一层
     */
    DrillDownAction.prototype.back = function () {
        if ((0, util_1.size)(this.historyCache)) {
            this.backTo(this.historyCache.slice(0, -1));
        }
    };
    /**
     * 重置
     */
    DrillDownAction.prototype.reset = function () {
        if (this.historyCache[0]) {
            this.backTo(this.historyCache.slice(0, 1));
        }
        // 清空
        this.historyCache = [];
        this.hideCrumbGroup();
    };
    /**
     * 下钻数据并更新 view 显示层
     * @param nodeInfo 下钻数据
     */
    DrillDownAction.prototype.drill = function (nodeInfo) {
        var view = this.context.view;
        var transformData = (0, util_1.get)(view, ['interactions', 'drill-down', 'cfg', 'transformData'], function (v) { return v; });
        // 重新 update 数据
        var drillData = transformData(tslib_1.__assign({ data: nodeInfo.data }, nodeInfo[exports.HIERARCHY_DATA_TRANSFORM_PARAMS]));
        view.changeData(drillData);
        // 存储历史记录
        var historyCache = [];
        var node = nodeInfo;
        while (node) {
            var nodeData = node.data;
            historyCache.unshift({
                id: "".concat(nodeData.name, "_").concat(node.height, "_").concat(node.depth),
                name: nodeData.name,
                // children 是实际数据
                children: transformData(tslib_1.__assign({ data: nodeData }, nodeInfo[exports.HIERARCHY_DATA_TRANSFORM_PARAMS])),
            });
            node = node.parent;
        }
        this.historyCache = (this.historyCache || []).slice(0, -1).concat(historyCache);
    };
    /**
     * 回退事件，点击面包屑时触发
     * @param historyCache 当前要回退到的历史
     */
    DrillDownAction.prototype.backTo = function (historyCache) {
        if (!historyCache || historyCache.length <= 0) {
            return;
        }
        var view = this.context.view;
        var data = (0, util_1.last)(historyCache).children; // 处理后的数组
        view.changeData(data);
        if (historyCache.length > 1) {
            this.historyCache = historyCache;
            this.drawBreadCrumb();
        }
        else {
            // 清空
            this.historyCache = [];
            this.hideCrumbGroup();
        }
    };
    /**
     * 获取 mix 默认的配置和用户配置
     */
    DrillDownAction.prototype.getButtonCfg = function () {
        var view = this.context.view;
        var drillDownConfig = (0, util_1.get)(view, ['interactions', 'drill-down', 'cfg', 'drillDownConfig']);
        return (0, deep_assign_1.deepAssign)(this.breadCrumbCfg, drillDownConfig === null || drillDownConfig === void 0 ? void 0 : drillDownConfig.breadCrumb, this.cfg);
    };
    /**
     * 显示面包屑
     */
    DrillDownAction.prototype.drawBreadCrumb = function () {
        this.drawBreadCrumbGroup();
        this.resetPosition();
        this.breadCrumbGroup.show();
    };
    /**
     * 绘制 Button 和 文本
     */
    DrillDownAction.prototype.drawBreadCrumbGroup = function () {
        var _this = this;
        var config = this.getButtonCfg();
        var cache = this.historyCache;
        // 初始化面包屑 group
        if (!this.breadCrumbGroup) {
            this.breadCrumbGroup = this.context.view.foregroundGroup.addGroup({
                name: exports.BREAD_CRUMB_NAME,
            });
        }
        else {
            this.breadCrumbGroup.clear();
        }
        // 绘制面包屑
        var left = 0;
        cache.forEach(function (record, index) {
            // 添加文本
            var textShape = _this.breadCrumbGroup.addShape({
                type: 'text',
                id: record.id,
                name: "".concat(exports.BREAD_CRUMB_NAME, "_").concat(record.name, "_text"),
                attrs: tslib_1.__assign(tslib_1.__assign({ text: index === 0 && !(0, util_1.isNil)(config.rootText) ? config.rootText : record.name }, config.textStyle), { x: left, y: 0 }),
            });
            var textShapeBox = textShape.getBBox();
            left += textShapeBox.width + PADDING;
            // 增加文本事件
            textShape.on('click', function (event) {
                var _a;
                var targetId = event.target.get('id');
                if (targetId !== ((_a = (0, util_1.last)(cache)) === null || _a === void 0 ? void 0 : _a.id)) {
                    var newHistoryCache = cache.slice(0, cache.findIndex(function (d) { return d.id === targetId; }) + 1);
                    _this.backTo(newHistoryCache);
                }
            });
            // active 效果内置
            textShape.on('mouseenter', function (event) {
                var _a;
                var targetId = event.target.get('id');
                if (targetId !== ((_a = (0, util_1.last)(cache)) === null || _a === void 0 ? void 0 : _a.id)) {
                    textShape.attr(config.activeTextStyle);
                }
                else {
                    textShape.attr({ cursor: 'default' });
                }
            });
            textShape.on('mouseleave', function () {
                textShape.attr(config.textStyle);
            });
            if (index < cache.length - 1) {
                // 添加反斜杠
                var dividerShape = _this.breadCrumbGroup.addShape({
                    type: 'text',
                    name: "".concat(config.name, "_").concat(record.name, "_divider"),
                    attrs: tslib_1.__assign(tslib_1.__assign({ text: config.dividerText }, config.textStyle), { x: left, y: 0 }),
                });
                var dividerBox = dividerShape.getBBox();
                left += dividerBox.width + PADDING;
            }
        });
    };
    /**
     * 隐藏面包屑
     */
    DrillDownAction.prototype.hideCrumbGroup = function () {
        if (this.breadCrumbGroup) {
            this.breadCrumbGroup.hide();
        }
    };
    /**
     * @override
     * destroy: 销毁资源
     */
    DrillDownAction.prototype.destroy = function () {
        if (this.breadCrumbGroup) {
            this.breadCrumbGroup.remove();
        }
        _super.prototype.destroy.call(this);
    };
    return DrillDownAction;
}(g2_1.Action));
exports.DrillDownAction = DrillDownAction;
//# sourceMappingURL=drill-down.js.map