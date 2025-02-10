"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plot = exports.PLOT_CONTAINER_OPTIONS = void 0;
var tslib_1 = require("tslib");
var event_emitter_1 = tslib_1.__importDefault(require("@antv/event-emitter"));
var g2_1 = require("@antv/g2");
var util_1 = require("@antv/util");
var size_sensor_1 = require("size-sensor");
var utils_1 = require("../utils");
var SOURCE_ATTRIBUTE_NAME = 'data-chart-source-type';
/** plot 图表容器的配置 */
exports.PLOT_CONTAINER_OPTIONS = [
    'padding',
    'appendPadding',
    'renderer',
    'pixelRatio',
    'syncViewPadding',
    'supportCSSTransform',
    'limitInPlot',
];
/**
 * 所有 plot 的基类
 */
var Plot = /** @class */ (function (_super) {
    tslib_1.__extends(Plot, _super);
    function Plot(container, options) {
        var _this = _super.call(this) || this;
        _this.container = typeof container === 'string' ? document.getElementById(container) : container;
        _this.options = (0, utils_1.deepAssign)({}, _this.getDefaultOptions(), options);
        _this.createG2();
        _this.bindEvents();
        return _this;
    }
    /**
     * 获取默认的 options 配置项
     * 每个组件都可以复写
     */
    Plot.getDefaultOptions = function () {
        return {
            renderer: 'canvas',
            xAxis: {
                nice: true,
                label: {
                    autoRotate: false,
                    autoHide: { type: 'equidistance', cfg: { minGap: 6 } },
                },
            },
            yAxis: {
                nice: true,
                label: {
                    autoHide: true,
                    autoRotate: false,
                },
            },
            animation: true,
        };
    };
    /**
     * 创建 G2 实例
     */
    Plot.prototype.createG2 = function () {
        var _a = this.options, width = _a.width, height = _a.height, defaultInteractions = _a.defaultInteractions;
        this.chart = new g2_1.Chart(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({ container: this.container, autoFit: false }, this.getChartSize(width, height)), { localRefresh: false }), (0, utils_1.pick)(this.options, exports.PLOT_CONTAINER_OPTIONS)), { defaultInteractions: defaultInteractions }));
        // 给容器增加标识，知道图表的来源区别于 G2
        this.container.setAttribute(SOURCE_ATTRIBUTE_NAME, 'G2Plot');
    };
    /**
     * 计算默认的 chart 大小。逻辑简化：如果存在 width 或 height，则直接使用，否则使用容器大小
     * @param width
     * @param height
     */
    Plot.prototype.getChartSize = function (width, height) {
        var chartSize = (0, utils_1.getContainerSize)(this.container);
        return { width: width || chartSize.width || 400, height: height || chartSize.height || 400 };
    };
    /**
     * 绑定代理所有 G2 的事件
     */
    Plot.prototype.bindEvents = function () {
        var _this = this;
        if (this.chart) {
            this.chart.on('*', function (e) {
                if (e === null || e === void 0 ? void 0 : e.type) {
                    _this.emit(e.type, e);
                }
            });
        }
    };
    /**
     * 获取默认的 options 配置项
     * 每个组件都可以复写
     */
    Plot.prototype.getDefaultOptions = function () {
        return Plot.getDefaultOptions();
    };
    /**
     * 绘制
     */
    Plot.prototype.render = function () {
        // 暴力处理，先清空再渲染，需要 G2 层自行做好更新渲染
        this.chart.clear();
        // 因为子 view 会继承父 view 的 options 配置（包括 legend，所以会导致 legend 重复创建）
        // 所以这里给 chart 实例的 options 配置清空
        // 最好的解法是在 G2 view.clear 方法的时候，重置 options 配置。或者提供方法去 resetOptions
        // #1684 理论上在多 view 图形上，只要存在 custom legend，都存在类似问题（子弹图、双轴图）
        // @ts-ignore
        this.chart.options = {
            data: [],
            animate: true,
        };
        this.chart.views = []; // 删除已有的 views
        // 执行 adaptor
        this.execAdaptor();
        // 渲染
        this.chart.render();
        // 绑定
        this.bindSizeSensor();
    };
    /**
     * 更新: 更新配置且重新渲染
     * @param options
     */
    Plot.prototype.update = function (options) {
        this.updateOption(options);
        this.render();
    };
    /**
     * 更新配置
     * @param options
     */
    Plot.prototype.updateOption = function (options) {
        this.options = (0, utils_1.deepAssign)({}, this.options, options);
    };
    /**
     * 设置状态
     * @param type 状态类型，支持 'active' | 'inactive' | 'selected' 三种
     * @param conditions 条件，支持数组
     * @param status 是否激活，默认 true
     */
    Plot.prototype.setState = function (type, condition, status) {
        if (status === void 0) { status = true; }
        var elements = (0, utils_1.getAllElementsRecursively)(this.chart);
        (0, util_1.each)(elements, function (ele) {
            if (condition(ele.getData())) {
                ele.setState(type, status);
            }
        });
    };
    /**
     * 获取状态
     */
    Plot.prototype.getStates = function () {
        var elements = (0, utils_1.getAllElementsRecursively)(this.chart);
        var stateObjects = [];
        (0, util_1.each)(elements, function (element) {
            var data = element.getData();
            var states = element.getStates();
            (0, util_1.each)(states, function (state) {
                stateObjects.push({ data: data, state: state, geometry: element.geometry, element: element });
            });
        });
        return stateObjects;
    };
    /**
     * 更新数据
     * @override
     * @param options
     */
    Plot.prototype.changeData = function (data) {
        // @ts-ignore
        this.update({ data: data });
        // TODO: 临时方案，最好使用下面的方式去更新数据
        // this.chart.changeData(data);
    };
    /**
     * 修改画布大小
     * @param width
     * @param height
     */
    Plot.prototype.changeSize = function (width, height) {
        this.chart.changeSize(width, height);
    };
    /**
     * 增加图表标注。通过 id 标识，如果匹配到，就做更新
     */
    Plot.prototype.addAnnotations = function (annotations, view) {
        view = view ? view : this.chart;
        var incoming = tslib_1.__spreadArray([], annotations, true);
        var controller = view.getController('annotation');
        var current = controller.getComponents().map(function (co) { return co.extra; });
        controller.clear(true);
        var _loop_1 = function (i) {
            var annotation = current[i];
            var findIndex = incoming.findIndex(function (item) { return item.id && item.id === annotation.id; });
            if (findIndex !== -1) {
                annotation = (0, utils_1.deepAssign)({}, annotation, incoming[findIndex]);
                incoming.splice(findIndex, 1);
            }
            controller.annotation(annotation);
        };
        for (var i = 0; i < current.length; i++) {
            _loop_1(i);
        }
        incoming.forEach(function (annotation) { return controller.annotation(annotation); });
        view.render(true);
    };
    /**
     * 删除图表标注。通过 id 标识，如果匹配到，就做删除
     */
    Plot.prototype.removeAnnotations = function (annotations) {
        var controller = this.chart.getController('annotation');
        var current = controller.getComponents().map(function (co) { return co.extra; });
        controller.clear(true);
        var _loop_2 = function (i) {
            var annotation = current[i];
            if (!annotations.find(function (item) { return item.id && item.id === annotation.id; })) {
                controller.annotation(annotation);
            }
        };
        for (var i = 0; i < current.length; i++) {
            _loop_2(i);
        }
        this.chart.render(true);
    };
    /**
     * 销毁
     */
    Plot.prototype.destroy = function () {
        // 取消 size-sensor 的绑定
        this.unbindSizeSensor();
        // G2 的销毁
        this.chart.destroy();
        // 清空已经绑定的事件
        this.off();
        this.container.removeAttribute(SOURCE_ATTRIBUTE_NAME);
    };
    /**
     * 执行 adaptor 操作
     */
    Plot.prototype.execAdaptor = function () {
        var adaptor = this.getSchemaAdaptor();
        var _a = this.options, padding = _a.padding, appendPadding = _a.appendPadding;
        // 更新 padding
        this.chart.padding = padding;
        // 更新 appendPadding
        this.chart.appendPadding = appendPadding;
        // 转化成 G2 API
        adaptor({
            chart: this.chart,
            options: this.options,
        });
    };
    /**
     * 当图表容器大小变化的时候，执行的函数
     */
    Plot.prototype.triggerResize = function () {
        this.chart.forceFit();
    };
    /**
     * 绑定 dom 容器大小变化的事件
     */
    Plot.prototype.bindSizeSensor = function () {
        var _this = this;
        if (this.unbind) {
            return;
        }
        var _a = this.options.autoFit, autoFit = _a === void 0 ? true : _a;
        if (autoFit) {
            this.unbind = (0, size_sensor_1.bind)(this.container, function () {
                // 获取最新的宽高信息
                var _a = (0, utils_1.getContainerSize)(_this.container), width = _a.width, height = _a.height;
                // 主要是防止绑定的时候触发 resize 回调
                if (width !== _this.chart.width || height !== _this.chart.height) {
                    _this.triggerResize();
                }
            });
        }
    };
    /**
     * 取消绑定
     */
    Plot.prototype.unbindSizeSensor = function () {
        if (this.unbind) {
            this.unbind();
            this.unbind = undefined;
        }
    };
    return Plot;
}(event_emitter_1.default));
exports.Plot = Plot;
//# sourceMappingURL=plot.js.map