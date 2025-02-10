"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../constant");
var engine_1 = require("../engine");
var dom_1 = require("../util/dom");
var view_1 = tslib_1.__importDefault(require("./view"));
/**
 * Chart 类，是使用 G2 进行绘图的入口。
 */
var Chart = /** @class */ (function (_super) {
    tslib_1.__extends(Chart, _super);
    // @ts-ignore
    function Chart(props) {
        var _this = this;
        var container = props.container, width = props.width, height = props.height, _a = props.autoFit, autoFit = _a === void 0 ? false : _a, padding = props.padding, appendPadding = props.appendPadding, _b = props.renderer, renderer = _b === void 0 ? 'canvas' : _b, pixelRatio = props.pixelRatio, _c = props.localRefresh, localRefresh = _c === void 0 ? true : _c, _d = props.visible, visible = _d === void 0 ? true : _d, _e = props.supportCSSTransform, supportCSSTransform = _e === void 0 ? false : _e, _f = props.defaultInteractions, defaultInteractions = _f === void 0 ? ['tooltip', 'legend-filter', 'legend-active', 'continuous-filter', 'ellipsis-text', 'axis-description'] : _f, options = props.options, limitInPlot = props.limitInPlot, theme = props.theme, syncViewPadding = props.syncViewPadding;
        var ele = (0, util_1.isString)(container) ? document.getElementById(container) : container;
        // 生成内部正式绘制的 div 元素
        var wrapperElement = (0, dom_1.createDom)('<div style="position:relative;"></div>');
        ele.appendChild(wrapperElement);
        // if autoFit, use the container size, to avoid the graph render twice.
        var size = (0, dom_1.getChartSize)(ele, autoFit, width, height);
        var G = (0, engine_1.getEngine)(renderer);
        var canvas = new G.Canvas(tslib_1.__assign({ container: wrapperElement, pixelRatio: pixelRatio, localRefresh: localRefresh, supportCSSTransform: supportCSSTransform }, size));
        // 调用 view 的创建
        _this = _super.call(this, {
            parent: null,
            canvas: canvas,
            // create 3 group layers for views.
            backgroundGroup: canvas.addGroup({ zIndex: constant_1.GROUP_Z_INDEX.BG }),
            middleGroup: canvas.addGroup({ zIndex: constant_1.GROUP_Z_INDEX.MID }),
            foregroundGroup: canvas.addGroup({ zIndex: constant_1.GROUP_Z_INDEX.FORE }),
            padding: padding,
            appendPadding: appendPadding,
            visible: visible,
            options: options,
            limitInPlot: limitInPlot,
            theme: theme,
            syncViewPadding: syncViewPadding,
        }) || this;
        /**
         * when container size changed, change chart size props, and re-render.
         */
        _this.onResize = (0, util_1.debounce)(function () {
            _this.forceFit();
        }, 300);
        _this.ele = ele;
        _this.canvas = canvas;
        _this.width = size.width;
        _this.height = size.height;
        _this.autoFit = autoFit;
        _this.localRefresh = localRefresh;
        _this.renderer = renderer;
        _this.wrapperElement = wrapperElement;
        // 自适应大小
        _this.updateCanvasStyle();
        _this.bindAutoFit();
        _this.initDefaultInteractions(defaultInteractions);
        return _this;
    }
    Chart.prototype.initDefaultInteractions = function (interactions) {
        var _this = this;
        (0, util_1.each)(interactions, function (interaction) {
            _this.interaction(interaction);
        });
    };
    /**
     * 设置 WAI-ARIA 无障碍标签。如何根据图形语法自动生成 arial 内容？
     * @param ariaOption
     */
    Chart.prototype.aria = function (ariaOption) {
        var ATTR = 'aria-label';
        if (ariaOption === false) {
            this.ele.removeAttribute(ATTR);
        }
        else {
            this.ele.setAttribute(ATTR, ariaOption.label);
        }
    };
    /**
     * 改变图表大小，同时重新渲染。
     * @param width 图表宽度
     * @param height 图表高度
     * @returns
     */
    Chart.prototype.changeSize = function (width, height) {
        // 如果宽高一致，那么 changeSize 不执行任何操作
        if (this.width === width && this.height === height) {
            return this;
        }
        this.emit(constant_1.VIEW_LIFE_CIRCLE.BEFORE_CHANGE_SIZE);
        this.width = width;
        this.height = height;
        this.canvas.changeSize(width, height);
        // 重新渲染
        this.render(true);
        this.emit(constant_1.VIEW_LIFE_CIRCLE.AFTER_CHANGE_SIZE);
        return this;
    };
    /**
     * 清空图表，同时清除掉 aria 配置
     */
    Chart.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.aria(false);
    };
    /**
     * 销毁图表，同时解绑事件，销毁创建的 G.Canvas 实例。
     * @returns void
     */
    Chart.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.unbindAutoFit();
        this.canvas.destroy();
        (0, dom_1.removeDom)(this.wrapperElement);
        this.wrapperElement = null;
    };
    /**
     * 显示或隐藏图表
     * @param visible 是否可见，true 表示显示，false 表示隐藏
     * @returns
     */
    Chart.prototype.changeVisible = function (visible) {
        _super.prototype.changeVisible.call(this, visible); // 需要更新 visible 变量
        this.wrapperElement.style.display = visible ? '' : 'none';
        return this;
    };
    /**
     * 自动根据容器大小 resize 画布
     */
    Chart.prototype.forceFit = function () {
        // skip if already destroyed
        if (!this.destroyed) {
            // 注意第二参数用 true，意思是即时 autoFit = false，forceFit() 调用之后一样是适配容器
            var _a = (0, dom_1.getChartSize)(this.ele, true, this.width, this.height), width = _a.width, height = _a.height;
            this.changeSize(width, height);
        }
    };
    Chart.prototype.updateCanvasStyle = function () {
        (0, dom_1.modifyCSS)(this.canvas.get('el'), {
            display: 'inline-block',
            verticalAlign: 'middle',
        });
    };
    Chart.prototype.bindAutoFit = function () {
        if (this.autoFit) {
            window.addEventListener('resize', this.onResize);
        }
    };
    Chart.prototype.unbindAutoFit = function () {
        if (this.autoFit) {
            window.removeEventListener('resize', this.onResize);
        }
    };
    return Chart;
}(view_1.default));
exports.default = Chart;
//# sourceMappingURL=chart.js.map