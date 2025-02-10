"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facet = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var axis_1 = require("../util/axis");
/**
 * facet 基类
 *  - 定义生命周期，方便自定义 facet
 *  - 提供基础的生命流程方法
 *
 * 生命周期：
 *
 * 初始化 init
 * 1. 初始化容器
 * 2. 数据分面，生成分面布局信息
 *
 * 渲染阶段 render
 * 1. view 创建
 * 2. title
 * 3. axis
 *
 * 清除阶段 clear
 * 1. 清除 view
 *
 * 销毁阶段 destroy
 * 1. clear
 * 2. 清除事件
 * 3. 清除 group
 */
var Facet = /** @class */ (function () {
    function Facet(view, cfg) {
        /** 是否销毁 */
        this.destroyed = false;
        /** 分面之后的所有分面数据结构 */
        this.facets = [];
        this.view = view;
        this.cfg = (0, util_1.deepMix)({}, this.getDefaultCfg(), cfg);
    }
    /**
     * 初始化过程
     */
    Facet.prototype.init = function () {
        // 初始化容器
        if (!this.container) {
            this.container = this.createContainer();
        }
        // 生成分面布局信息
        var data = this.view.getData();
        this.facets = this.generateFacets(data);
    };
    /**
     * 渲染分面，由上层 view 调用。包括：
     *  - 分面 view
     *  - 轴
     *  - title
     *
     *  子类可以复写，添加一些其他组件，比如滚动条等
     */
    Facet.prototype.render = function () {
        this.renderViews();
    };
    /**
     * 更新 facet
     */
    Facet.prototype.update = function () {
        // 其实不用做任何事情，因为 facet 最终生成的 View 和 Geometry 都在父 view 的更新中处理了
    };
    /**
     * 清空，clear 之后如果还需要使用，需要重新调用 init 初始化过程
     * 一般在数据有变更的时候调用，重新进行数据的分面逻辑
     */
    Facet.prototype.clear = function () {
        this.clearFacetViews();
    };
    /**
     * 销毁
     */
    Facet.prototype.destroy = function () {
        this.clear();
        if (this.container) {
            this.container.remove(true);
            this.container = undefined;
        }
        this.destroyed = true;
        this.view = undefined;
        this.facets = [];
    };
    /**
     * 根据 facet 生成 view，可以给上层自定义使用
     * @param facet
     */
    Facet.prototype.facetToView = function (facet) {
        var region = facet.region, data = facet.data, _a = facet.padding, padding = _a === void 0 ? this.cfg.padding : _a;
        var view = this.view.createView({
            region: region,
            padding: padding,
        });
        // 设置分面的数据
        view.data(data || []);
        facet.view = view;
        // 前置钩子
        this.beforeEachView(view, facet);
        var eachView = this.cfg.eachView;
        if (eachView) {
            eachView(view, facet);
        }
        // 后置钩子
        this.afterEachView(view, facet);
        return view;
    };
    // 创建容器
    Facet.prototype.createContainer = function () {
        var foregroundGroup = this.view.getLayer(constant_1.LAYER.FORE);
        return foregroundGroup.addGroup();
    };
    /**
     * 初始化 view
     */
    Facet.prototype.renderViews = function () {
        this.createFacetViews();
    };
    /**
     * 创建 分面 view
     */
    Facet.prototype.createFacetViews = function () {
        var _this = this;
        // 使用分面数据 创建分面 view
        return this.facets.map(function (facet) {
            return _this.facetToView(facet);
        });
    };
    /**
     * 从 view 中清除 facetView
     */
    Facet.prototype.clearFacetViews = function () {
        var _this = this;
        // 从 view 中移除分面 view
        (0, util_1.each)(this.facets, function (facet) {
            if (facet.view) {
                _this.view.removeView(facet.view);
                facet.view = undefined;
            }
        });
    };
    /**
     * 解析 spacing
     */
    Facet.prototype.parseSpacing = function () {
        /**
         * @example
         *
         * // 仅使用百分比或像素值
         * // 横向间隔为 10%，纵向间隔为 10%
         * ['10%', '10%']
         * // 横向间隔为 10px，纵向间隔为 10px
         * [10, 10]
         *
         * // 同时使用百分比和像素值
         * ['10%', 10]
         * // 横向间隔为 10%，纵向间隔为 10px
         */
        var _a = this.view.viewBBox, width = _a.width, height = _a.height;
        var spacing = this.cfg.spacing;
        return spacing.map(function (s, idx) {
            if ((0, util_1.isNumber)(s))
                return s / (idx === 0 ? width : height);
            else
                return parseFloat(s) / 100;
        });
    };
    // 其他一些提供给子类使用的方法
    /**
     * 获取这个字段对应的所有值，数组
     * @protected
     * @param data 数据
     * @param field 字段名
     * @return 字段对应的值
     */
    Facet.prototype.getFieldValues = function (data, field) {
        var rst = [];
        var cache = {};
        // 去重、去除 Nil 值
        (0, util_1.each)(data, function (d) {
            var value = d[field];
            if (!(0, util_1.isNil)(value) && !cache[value]) {
                rst.push(value);
                cache[value] = true;
            }
        });
        return rst;
    };
    /**
     * 获得每个分面的 region，平分区域
     * @param rows row 总数
     * @param cols col 总数
     * @param xIndex x 方向 index
     * @param yIndex y 方向 index
     */
    Facet.prototype.getRegion = function (rows, cols, xIndex, yIndex) {
        var _a = tslib_1.__read(this.parseSpacing(), 2), xSpacing = _a[0], ySpacing = _a[1];
        // 每两个分面区域横向间隔xSPacing, 纵向间隔ySpacing
        // 每个分面区域的横纵占比
        /**
         * ratio * num + spacing * (num - 1) = 1
         * => ratio = (1 - (spacing * (num - 1))) / num
         *          = (1 + spacing) / num - spacing
         *
         * num 对应 cols/rows
         * spacing 对应 xSpacing/ySpacing
         */
        var xRatio = (1 + xSpacing) / (cols === 0 ? 1 : cols) - xSpacing;
        var yRatio = (1 + ySpacing) / (rows === 0 ? 1 : rows) - ySpacing;
        // 得到第 index 个分面区域百分比位置
        var start = {
            x: (xRatio + xSpacing) * xIndex,
            y: (yRatio + ySpacing) * yIndex,
        };
        var end = {
            x: start.x + xRatio,
            y: start.y + yRatio,
        };
        return { start: start, end: end };
    };
    Facet.prototype.getDefaultCfg = function () {
        return {
            eachView: undefined,
            showTitle: true,
            spacing: [0, 0],
            padding: 10,
            fields: [],
        };
    };
    /**
     * 默认的 title 样式，因为有的分面是 title，有的分面配置是 columnTitle、rowTitle
     */
    Facet.prototype.getDefaultTitleCfg = function () {
        // @ts-ignore
        var fontFamily = this.view.getTheme().fontFamily;
        return {
            style: {
                fontSize: 14,
                fill: '#666',
                fontFamily: fontFamily,
            },
        };
    };
    /**
     * 处理 axis 的默认配置
     * @param view
     * @param facet
     */
    Facet.prototype.processAxis = function (view, facet) {
        var options = view.getOptions();
        var coordinateOption = options.coordinate;
        var geometries = view.geometries;
        var coordinateType = (0, util_1.get)(coordinateOption, 'type', 'rect');
        if (coordinateType === 'rect' && geometries.length) {
            if ((0, util_1.isNil)(options.axes)) {
                // @ts-ignore
                options.axes = {};
            }
            var axes = options.axes;
            var _a = tslib_1.__read(geometries[0].getXYFields(), 2), x = _a[0], y = _a[1];
            var xOption = (0, axis_1.getAxisOption)(axes, x);
            var yOption = (0, axis_1.getAxisOption)(axes, y);
            if (xOption !== false) {
                options.axes[x] = this.getXAxisOption(x, axes, xOption, facet);
            }
            if (yOption !== false) {
                options.axes[y] = this.getYAxisOption(y, axes, yOption, facet);
            }
        }
    };
    /**
     * 获取分面数据
     * @param conditions
     */
    Facet.prototype.getFacetDataFilter = function (conditions) {
        return function (datum) {
            // 过滤出全部满足条件的数据
            return (0, util_1.every)(conditions, function (condition) {
                var field = condition.field, value = condition.value;
                if (!(0, util_1.isNil)(value) && field) {
                    return datum[field] === value;
                }
                return true;
            });
        };
    };
    return Facet;
}());
exports.Facet = Facet;
//# sourceMappingURL=facet.js.map