import { __assign, __extends, __read, __rest, __spreadArray } from "tslib";
import { clone, deepMix, each, filter, find, flatten, get, isBoolean, isFunction, isNil, isObject, isString, isUndefined, mix, remove, set, size, uniqueId, isEqual, isPlainObject, reduce, } from '@antv/util';
import { GROUP_Z_INDEX, LAYER, PLOT_EVENTS, VIEW_LIFE_CIRCLE } from '../constant';
import Base from '../base';
import { getFacet } from '../facet';
import { createInteraction } from '../interaction';
import { getTheme } from '../theme';
import { BBox } from '../util/bbox';
import { getCoordinateClipCfg, isPointInCoordinate } from '../util/coordinate';
import { uniq } from '../util/helper';
import { findDataByPoint } from '../util/tooltip';
import { parsePadding } from '../util/padding';
import { getDefaultCategoryScaleRange } from '../util/scale';
import { createTheme } from '../theme/util';
import { getComponentController, getComponentControllerNames } from './controller';
import CoordinateController from './controller/coordinate';
import Event from './event';
import defaultLayout from './layout';
import { ScalePool } from './util/scale-pool';
import { PaddingCal } from './layout/padding-cal';
import { calculatePadding } from './layout/auto';
import { defaultSyncViewPadding } from './util/sync-view-padding';
/**
 * G2 视图 View 类
 */
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(props) {
        var _this = _super.call(this, { visible: props.visible }) || this;
        /** 所有的子 view。 */
        _this.views = [];
        /** 所有的 geometry 实例。 */
        _this.geometries = [];
        /** 所有的组件 controllers。 */
        _this.controllers = [];
        /** 所有的 Interaction 实例。 */
        _this.interactions = {};
        /** 是否对超出坐标系范围的 Geometry 进行剪切 */
        _this.limitInPlot = false;
        // 配置信息存储
        _this.options = {
            data: [],
            animate: true, // 默认开启动画
        }; // 初始化为空
        /** 配置开启的组件插件，默认为全局配置的组件。 */
        _this.usedControllers = getComponentControllerNames();
        /** 所有的 scales */
        _this.scalePool = new ScalePool();
        /** 布局函数 */
        _this.layoutFunc = defaultLayout;
        /** 当前鼠标是否在 plot 内（CoordinateBBox） */
        _this.isPreMouseInPlot = false;
        /** 默认标识位，用于判定数据是否更新 */
        _this.isDataChanged = false;
        /** 用于判断坐标系范围是否发生变化的标志位 */
        _this.isCoordinateChanged = false;
        /** 从当前这个 view 创建的 scale key */
        _this.createdScaleKeys = new Map();
        _this.onCanvasEvent = function (evt) {
            var name = evt.name;
            if (!name.includes(':')) {
                // 非委托事件
                var e = _this.createViewEvent(evt);
                // 处理 plot 事件
                _this.doPlotEvent(e);
                _this.emit(name, e);
            }
        };
        /**
         * 触发事件之后
         * @param evt
         */
        _this.onDelegateEvents = function (evt) {
            // 阻止继续冒泡，防止重复事件触发
            // evt.preventDefault();
            var name = evt.name;
            if (!name.includes(':')) {
                return;
            }
            // 事件在 view 嵌套中冒泡（暂不提供阻止冒泡的机制）
            var e = _this.createViewEvent(evt);
            // 包含有基本事件、组合事件
            _this.emit(name, e);
            // const currentTarget = evt.currentTarget as IShape;
            // const inheritNames = currentTarget.get('inheritNames');
            // if (evt.delegateObject || inheritNames) {
            //   const events = this.getEvents();
            //   each(inheritNames, (subName) => {
            //     const eventName = `${subName}:${type}`;
            //     if (events[eventName]) {
            //       this.emit(eventName, e);
            //     }
            //   });
            // }
        };
        var _a = props.id, id = _a === void 0 ? uniqueId('view') : _a, parent = props.parent, canvas = props.canvas, backgroundGroup = props.backgroundGroup, middleGroup = props.middleGroup, foregroundGroup = props.foregroundGroup, _b = props.region, region = _b === void 0 ? { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } } : _b, padding = props.padding, appendPadding = props.appendPadding, theme = props.theme, options = props.options, limitInPlot = props.limitInPlot, syncViewPadding = props.syncViewPadding;
        _this.parent = parent;
        _this.canvas = canvas;
        _this.backgroundGroup = backgroundGroup;
        _this.middleGroup = middleGroup;
        _this.foregroundGroup = foregroundGroup;
        _this.region = region;
        _this.padding = padding;
        _this.appendPadding = appendPadding;
        // 接受父 view 传入的参数
        _this.options = __assign(__assign({}, _this.options), options);
        _this.limitInPlot = limitInPlot;
        _this.id = id;
        _this.syncViewPadding = syncViewPadding;
        // 初始化 theme
        _this.themeObject = isObject(theme) ? deepMix({}, getTheme('default'), createTheme(theme)) : getTheme(theme);
        _this.init();
        return _this;
    }
    /**
     * 设置 layout 布局函数
     * @param layout 布局函数
     * @returns void
     */
    View.prototype.setLayout = function (layout) {
        this.layoutFunc = layout;
    };
    /**
     * 生命周期：初始化
     * @returns voids
     */
    View.prototype.init = function () {
        // 计算画布的 viewBBox
        this.calculateViewBBox();
        // 事件委托机制
        this.initEvents();
        // 初始化组件 controller
        this.initComponentController();
        this.initOptions();
    };
    /**
     * 生命周期：渲染流程，渲染过程需要处理数据更新的情况。
     * render 函数仅仅会处理 view 和子 view。
     * @param isUpdate 是否触发更新流程。
     * @param params render 事件参数
     */
    View.prototype.render = function (isUpdate, payload) {
        if (isUpdate === void 0) { isUpdate = false; }
        this.emit(VIEW_LIFE_CIRCLE.BEFORE_RENDER, Event.fromData(this, VIEW_LIFE_CIRCLE.BEFORE_RENDER, payload));
        // 递归渲染
        this.paint(isUpdate);
        this.emit(VIEW_LIFE_CIRCLE.AFTER_RENDER, Event.fromData(this, VIEW_LIFE_CIRCLE.AFTER_RENDER, payload));
        if (this.visible === false) {
            // 用户在初始化的时候声明 visible: false
            this.changeVisible(false);
        }
    };
    /**
     * 生命周期：清空图表上所有的绘制内容，但是不销毁图表，chart 仍可使用。
     * @returns void
     */
    View.prototype.clear = function () {
        var _this = this;
        this.emit(VIEW_LIFE_CIRCLE.BEFORE_CLEAR);
        // 1. 清空缓存和计算数据
        this.filteredData = [];
        this.coordinateInstance = undefined;
        this.isDataChanged = false; // 复位
        this.isCoordinateChanged = false; // 复位
        // 2. 清空 geometries
        var geometries = this.geometries;
        for (var i = 0; i < geometries.length; i++) {
            geometries[i].clear();
            // view 中使用 geometry 的时候，还需要清空它的容器，不然下一次 chart.geometry() 的时候，又创建了一个，导致泄露， #2799。
            geometries[i].container.remove(true);
            geometries[i].labelsContainer.remove(true);
        }
        this.geometries = [];
        // 3. 清空 controllers
        var controllers = this.controllers;
        for (var i = 0; i < controllers.length; i++) {
            if (controllers[i].name === 'annotation') {
                // 需要清空配置项
                controllers[i].clear(true);
            }
            else {
                controllers[i].clear();
            }
        }
        // 4. 删除 scale 缓存
        this.createdScaleKeys.forEach(function (v, k) {
            _this.getRootView().scalePool.deleteScale(k);
        });
        this.createdScaleKeys.clear();
        // 递归处理子 view
        var views = this.views;
        for (var i = 0; i < views.length; i++) {
            views[i].clear();
        }
        this.emit(VIEW_LIFE_CIRCLE.AFTER_CLEAR);
    };
    /**
     * 生命周期：销毁，完全无法使用。
     * @returns void
     */
    View.prototype.destroy = function () {
        // 销毁前事件，销毁之后已经没有意义了，所以不抛出事件
        this.emit(VIEW_LIFE_CIRCLE.BEFORE_DESTROY);
        var interactions = this.interactions;
        // 销毁 interactions
        each(interactions, function (interaction) {
            if (interaction) {
                // 有可能已经销毁，设置了 undefined
                interaction.destroy();
            }
        });
        this.clear();
        // 销毁 controller 中的组件
        var controllers = this.controllers;
        for (var i = 0, len = controllers.length; i < len; i++) {
            var controller = controllers[i];
            controller.destroy();
        }
        this.backgroundGroup.remove(true);
        this.middleGroup.remove(true);
        this.foregroundGroup.remove(true);
        _super.prototype.destroy.call(this);
    };
    /* end 生命周期函数 */
    /**
     * 显示或者隐藏整个 view。
     * @param visible 是否可见
     * @returns View
     */
    View.prototype.changeVisible = function (visible) {
        _super.prototype.changeVisible.call(this, visible);
        var geometries = this.geometries;
        for (var i = 0, len = geometries.length; i < len; i++) {
            var geometry = geometries[i];
            geometry.changeVisible(visible);
        }
        var controllers = this.controllers;
        for (var i = 0, len = controllers.length; i < len; i++) {
            var controller = controllers[i];
            controller.changeVisible(visible);
        }
        this.foregroundGroup.set('visible', visible);
        this.middleGroup.set('visible', visible);
        this.backgroundGroup.set('visible', visible);
        // group.set('visible', visible) 不会触发自动刷新
        this.getCanvas().draw();
        return this;
    };
    /**
     * 装载数据源。
     *
     * ```ts
     * view.data([{ city: '杭州', sale: 100 }, { city: '上海', sale: 110 } ]);
     * ```
     *
     * @param data 数据源，json 数组。
     * @returns View
     */
    View.prototype.data = function (data) {
        set(this.options, 'data', data);
        this.isDataChanged = true;
        return this;
    };
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #data(data)}
     */
    View.prototype.source = function (data) {
        console.warn('This method will be removed at G2 V4.1. Please use chart.data() instead.');
        return this.data(data);
    };
    /**
     * 设置数据筛选规则。
     *
     * ```ts
     * view.filter('city', (value: any, datum: Datum) => value !== '杭州');
     *
     * // 删除 'city' 字段对应的筛选规则。
     * view.filter('city', null);
     * ```
     *
     * @param field 数据字段
     * @param condition 筛选规则
     * @returns View
     */
    View.prototype.filter = function (field, condition) {
        if (isFunction(condition)) {
            set(this.options, ['filters', field], condition);
            return this;
        }
        // condition 为空，则表示删除过滤条件
        if (!condition && get(this.options, ['filters', field])) {
            delete this.options.filters[field];
        }
        return this;
    };
    View.prototype.axis = function (field, axisOption) {
        if (isBoolean(field)) {
            set(this.options, ['axes'], field);
        }
        else {
            set(this.options, ['axes', field], axisOption);
        }
        return this;
    };
    View.prototype.legend = function (field, legendOption) {
        if (isBoolean(field)) {
            set(this.options, ['legends'], field);
        }
        else if (isString(field)) {
            set(this.options, ['legends', field], legendOption);
            if (isPlainObject(legendOption) && (legendOption === null || legendOption === void 0 ? void 0 : legendOption.selected)) {
                set(this.options, ['filters', field], function (name) {
                    var _a;
                    return (_a = legendOption === null || legendOption === void 0 ? void 0 : legendOption.selected[name]) !== null && _a !== void 0 ? _a : true;
                });
            }
        }
        else {
            // 设置全局的 legend 配置
            set(this.options, ['legends'], field);
        }
        return this;
    };
    View.prototype.scale = function (field, scaleOption) {
        var _this = this;
        if (isString(field)) {
            set(this.options, ['scales', field], scaleOption);
        }
        else if (isObject(field)) {
            each(field, function (v, k) {
                set(_this.options, ['scales', k], v);
            });
        }
        return this;
    };
    /**
     * tooltip 提示信息配置。
     *
     * ```ts
     * view.tooltip(false); // 关闭 tooltip
     *
     * view.tooltip({
     *   shared: true
     * });
     * ```
     *
     * @param cfg Tooltip 配置，更详细的配置项参考：https://github.com/antvis/component#tooltip
     * @returns View
     */
    View.prototype.tooltip = function (cfg) {
        set(this.options, 'tooltip', cfg);
        return this;
    };
    /**
     * 辅助标记配置。
     *
     * ```ts
     * view.annotation().line({
     *   start: ['min', 85],
     *   end: ['max', 85],
     *   style: {
     *     stroke: '#595959',
     *     lineWidth: 1,
     *     lineDash: [3, 3],
     *   },
     * });
     * ```
     * 更详细的配置项：https://github.com/antvis/component#annotation
     * @returns [[Annotation]]
     */
    View.prototype.annotation = function () {
        return this.getController('annotation');
    };
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #guide()}
     */
    View.prototype.guide = function () {
        console.warn('This method will be removed at G2 V4.1. Please use chart.annotation() instead.');
        return this.annotation();
    };
    View.prototype.coordinate = function (type, coordinateCfg) {
        // 提供语法糖，使用更简单
        if (isString(type)) {
            set(this.options, 'coordinate', { type: type, cfg: coordinateCfg });
        }
        else {
            set(this.options, 'coordinate', type);
        }
        // 更新 coordinate 配置
        this.coordinateController.update(this.options.coordinate);
        return this.coordinateController;
    };
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #coordinate()}
     */
    View.prototype.coord = function (type, coordinateCfg) {
        console.warn('This method will be removed at G2 V4.1. Please use chart.coordinate() instead.');
        // @ts-ignore
        return this.coordinate(type, coordinateCfg);
    };
    /**
     * view 分面绘制。
     *
     * ```ts
     * view.facet('rect', {
     *   rowField: 'province',
     *   columnField: 'category',
     *   eachView: (innerView: View, facet?: FacetData) => {
     *     innerView.line().position('city*sale');
     *   },
     * });
     * ```
     *
     * @param type 分面类型
     * @param cfg 分面配置， [[FacetCfgMap]]
     * @returns View
     */
    View.prototype.facet = function (type, cfg) {
        // 先销毁掉之前的分面
        if (this.facetInstance) {
            this.facetInstance.destroy();
        }
        // 创建新的分面
        var Ctor = getFacet(type);
        if (!Ctor) {
            throw new Error("facet '".concat(type, "' is not exist!"));
        }
        this.facetInstance = new Ctor(this, __assign(__assign({}, cfg), { type: type }));
        return this;
    };
    /*
     * 开启或者关闭动画。
     *
     * ```ts
     * view.animate(false);
     * ```
     *
     * @param status 动画状态，true 表示开始，false 表示关闭
     * @returns View
     */
    View.prototype.animate = function (status) {
        set(this.options, 'animate', status);
        return this;
    };
    /**
     * 更新配置项，用于配置项式声明。
     * @param options 配置项
     */
    View.prototype.updateOptions = function (options) {
        this.clear(); // 清空
        mix(this.options, options);
        // 需要把已存在的 view 销毁，否则会重复创建
        // 目前针对配置项还没有特别好的 view 更新机制，为了不影响主流流程，所以在这里直接销毁
        this.views.forEach(function (view) { return view.destroy(); });
        this.views = [];
        this.initOptions();
        // 初始化坐标系大小，保证 padding 计算正确
        this.coordinateBBox = this.viewBBox;
        return this;
    };
    /**
     * 往 `view.options` 属性中存储配置项。
     * @param name 属性名称
     * @param opt 属性值
     * @returns view
     */
    View.prototype.option = function (name, opt) {
        // 对于内置的 option，避免覆盖。
        // name 在原型上，说明可能是内置 API，存在 option 被覆盖的风险，不处理
        if (View.prototype[name]) {
            throw new Error("Can't use built in variable name \"".concat(name, "\", please change another one."));
        }
        // 存入到 option 中
        set(this.options, name, opt);
        return this;
    };
    /**
     * 设置主题。
     *
     * ```ts
     * view.theme('dark'); // 'dark' 需要事先通过 `registerTheme()` 接口注册完成
     *
     * view.theme({ defaultColor: 'red' });
     * ```
     *
     * @param theme 主题名或者主题配置
     * @returns View
     */
    View.prototype.theme = function (theme) {
        this.themeObject = isObject(theme) ? deepMix({}, this.themeObject, createTheme(theme)) : getTheme(theme);
        return this;
    };
    /* end 一系列传入配置的 API */
    /**
     * Call the interaction based on the interaction name
     *
     * ```ts
     * view.interaction('my-interaction', { extra: 'hello world' });
     * ```
     * 详细文档可以参考：https://g2.antv.vision/zh/docs/api/general/interaction
     * @param name interaction name
     * @param cfg interaction config
     * @returns
     */
    View.prototype.interaction = function (name, cfg) {
        var existInteraction = this.interactions[name];
        // 存在则先销毁已有的
        if (existInteraction) {
            existInteraction.destroy();
        }
        // 新建交互实例
        var interaction = createInteraction(name, this, cfg);
        if (interaction) {
            interaction.init();
            this.interactions[name] = interaction;
        }
        return this;
    };
    /**
     * 移除当前 View 的 interaction
     * ```ts
     * view.removeInteraction('my-interaction');
     * ```
     * @param name interaction name
     */
    View.prototype.removeInteraction = function (name) {
        var existInteraction = this.interactions[name];
        // 存在则先销毁已有的
        if (existInteraction) {
            existInteraction.destroy();
            this.interactions[name] = undefined;
        }
    };
    /**
     * 修改数据，数据更新逻辑，数据更新仅仅影响当前这一层的 view
     *
     * ```ts
     * view.changeData([{ city: '北京', sale: '200' }]);
     * ```
     *
     * @param data
     * @returns void
     */
    View.prototype.changeData = function (data) {
        this.isDataChanged = true;
        this.emit(VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, Event.fromData(this, VIEW_LIFE_CIRCLE.BEFORE_CHANGE_DATA, null));
        // 1. 保存数据
        this.data(data);
        // 2. 渲染
        this.paint(true);
        // 3. 遍历子 view 进行 change data
        var views = this.views;
        for (var i = 0, len = views.length; i < len; i++) {
            var view = views[i];
            // FIXME 子 view 有自己的数据的情况，该如何处理？
            view.changeData(data);
        }
        this.emit(VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, Event.fromData(this, VIEW_LIFE_CIRCLE.AFTER_CHANGE_DATA, null));
    };
    /* View 管理相关的 API */
    /**
     * 创建子 view
     *
     * ```ts
     * const innerView = view.createView({
     *   start: { x: 0, y: 0 },
     *   end: { x: 0.5, y: 0.5 },
     *   padding: 8,
     * });
     * ```
     *
     * @param cfg
     * @returns View
     */
    View.prototype.createView = function (cfg) {
        // 将会在 4.1 版本中移除递归嵌套 view，仅仅只允许 chart - view 两层。
        // 这个 API 理论上用户量不多，所以暂时不发大版本，所以先暂时打一个 warning。
        if (this.parent && this.parent.parent) {
            // 存在 3 层 结构了
            console.warn('The view nesting recursive feature will be removed at G2 V4.1. Please avoid to use it.');
        }
        // 子 view 共享 options 配置数据
        var sharedOptions = {
            data: this.options.data,
            scales: clone(this.options.scales),
            axes: clone(this.options.axes),
            coordinate: clone(this.coordinateController.getOption()),
            tooltip: clone(this.options.tooltip),
            legends: clone(this.options.legends),
            animate: this.options.animate,
            visible: this.visible,
        };
        var v = new View(__assign(__assign({ parent: this, canvas: this.canvas, 
            // 子 view 共用三层 group
            backgroundGroup: this.backgroundGroup.addGroup({ zIndex: GROUP_Z_INDEX.BG }), middleGroup: this.middleGroup.addGroup({ zIndex: GROUP_Z_INDEX.MID }), foregroundGroup: this.foregroundGroup.addGroup({ zIndex: GROUP_Z_INDEX.FORE }), theme: this.themeObject, padding: this.padding }, cfg), { options: __assign(__assign({}, sharedOptions), get(cfg, 'options', {})) }));
        this.views.push(v);
        return v;
    };
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Replaced by {@link #createView()}
     */
    View.prototype.view = function (cfg) {
        console.warn('This method will be removed at G2 V4.1. Please use chart.createView() instead.');
        return this.createView(cfg);
    };
    /**
     * 删除一个子 view
     * @param view
     * @return removedView
     */
    View.prototype.removeView = function (view) {
        var removedView = remove(this.views, function (v) { return v === view; })[0];
        if (removedView) {
            removedView.destroy();
        }
        return removedView;
    };
    /* end View 管理相关的 API */
    // 一些 get 方法
    /**
     * 获取当前坐标系实例。
     * @returns [[Coordinate]]
     */
    View.prototype.getCoordinate = function () {
        return this.coordinateInstance;
    };
    /**
     * 获取当前 view 的主题配置。
     * @returns themeObject
     */
    View.prototype.getTheme = function () {
        return this.themeObject;
    };
    /**
     * 获得 x 轴字段的 scale 实例。
     * @returns view 中 Geometry 对于的 x scale
     */
    View.prototype.getXScale = function () {
        // 拿第一个 Geometry 的 X scale
        // 隐藏逻辑：一个 view 中的 Geometry 必须 x 字段一致
        var g = this.geometries[0];
        return g ? g.getXScale() : null;
    };
    /**
     * 获取 y 轴字段的 scales 实例。
     * @returns view 中 Geometry 对于的 y scale 数组
     */
    View.prototype.getYScales = function () {
        // 拿到所有的 Geometry 的 Y scale，然后去重
        var tmpMap = {};
        var yScales = [];
        this.geometries.forEach(function (g) {
            var yScale = g.getYScale();
            var field = yScale.field;
            if (!tmpMap[field]) {
                tmpMap[field] = true;
                yScales.push(yScale);
            }
        });
        return yScales;
    };
    /**
     * 获取 x 轴或者 y 轴对应的所有 scale 实例。
     * @param dimType x | y
     * @returns x 轴或者 y 轴对应的所有 scale 实例。
     */
    View.prototype.getScalesByDim = function (dimType) {
        var geometries = this.geometries;
        var scales = {};
        for (var i = 0, len = geometries.length; i < len; i++) {
            var geometry = geometries[i];
            var scale = dimType === 'x' ? geometry.getXScale() : geometry.getYScale();
            if (scale && !scales[scale.field]) {
                scales[scale.field] = scale;
            }
        }
        return scales;
    };
    /**
     * 根据字段名去获取 scale 实例。
     * @param field 数据字段名称
     * @param key id
     */
    View.prototype.getScale = function (field, key) {
        var defaultKey = key ? key : this.getScaleKey(field);
        // 调用根节点 view 的方法获取
        return this.getRootView().scalePool.getScale(defaultKey);
    };
    /**
     * @deprecated
     * This method will be removed at G2 V4.1. Please use `getScale`.
     */
    View.prototype.getScaleByField = function (field, key) {
        return this.getScale(field, key);
    };
    /**
     * 返回所有配置信息。
     * @returns 所有的 view API 配置。
     */
    View.prototype.getOptions = function () {
        return this.options;
    };
    /**
     * 获取 view 的数据（过滤后的数据）。
     * @returns 处理过滤器之后的数据。
     */
    View.prototype.getData = function () {
        return this.filteredData;
    };
    /**
     * 获取原始数据
     * @returns 传入 G2 的原始数据
     */
    View.prototype.getOriginalData = function () {
        return this.options.data;
    };
    /**
     * 获取布局后的边距 padding
     * @returns
     */
    View.prototype.getPadding = function () {
        return this.autoPadding.getPadding();
    };
    /**
     * 获取当前 view 有的 geometries
     * @returns
     */
    View.prototype.getGeometries = function () {
        return this.geometries;
    };
    /**
     * 获取 view 中的所有 geome
     */
    View.prototype.getElements = function () {
        return reduce(this.geometries, function (elements, geometry) {
            return elements.concat(geometry.getElements());
        }, []);
    };
    /**
     * 根据一定的规则查找 Geometry 的 Elements。
     *
     * ```typescript
     * getElementsBy((element) => {
     *   const data = element.getData();
     *
     *   return data.a === 'a';
     * });
     * ```
     *
     * @param condition 定义查找规则的回调函数。
     * @returns
     */
    View.prototype.getElementsBy = function (condition) {
        return this.getElements().filter(function (el) { return condition(el); });
    };
    /**
     * 获得绘制的层级 group。
     * @param layer 层级名称。
     * @returns 对应层级的 Group。
     */
    View.prototype.getLayer = function (layer) {
        return layer === LAYER.BG
            ? this.backgroundGroup
            : layer === LAYER.MID
                ? this.middleGroup
                : layer === LAYER.FORE
                    ? this.foregroundGroup
                    : this.foregroundGroup;
    };
    /**
     * 对外暴露方法，判断一个点是否在绘图区域（即坐标系范围）内部。
     * @param point 坐标点
     */
    View.prototype.isPointInPlot = function (point) {
        return isPointInCoordinate(this.getCoordinate(), point);
    };
    /**
     * 获得所有的 legend 对应的 attribute 实例。
     * @returns 维度字段的 Attribute 数组
     */
    View.prototype.getLegendAttributes = function () {
        return flatten(this.geometries.map(function (g) { return g.getGroupAttributes(); }));
    };
    /**
     * 获取所有的分组字段的 scale 实例。
     * @returns 获得分组字段的 scale 实例数组。
     */
    View.prototype.getGroupScales = function () {
        // 拿到所有的 Geometry 的 分组字段 scale，然后打平去重
        var scales = this.geometries.map(function (g) { return g.getGroupScales(); });
        return uniq(flatten(scales));
    };
    /**
     * 获取 G.Canvas 实例。
     * @returns G.Canvas 画布实例。
     */
    View.prototype.getCanvas = function () {
        return this.getRootView().canvas;
    };
    /**
     * 获得根节点 view。
     */
    View.prototype.getRootView = function () {
        var v = this;
        while (true) {
            if (v.parent) {
                v = v.parent;
                continue;
            }
            break;
        }
        return v;
    };
    /**
     * 获取该数据在可视化后，对应的画布坐标点。
     * @param data 原始数据记录
     * @returns 对应的画布坐标点
     */
    View.prototype.getXY = function (data) {
        var coordinate = this.getCoordinate();
        var xScales = this.getScalesByDim('x');
        var yScales = this.getScalesByDim('y');
        var x;
        var y;
        each(data, function (value, key) {
            if (xScales[key]) {
                x = xScales[key].scale(value);
            }
            if (yScales[key]) {
                y = yScales[key].scale(value);
            }
        });
        if (!isNil(x) && !isNil(y)) {
            return coordinate.convert({ x: x, y: y });
        }
    };
    /**
     * 获取 name 对应的 controller 实例
     * @param name
     */
    View.prototype.getController = function (name) {
        return find(this.controllers, function (c) { return c.name === name; });
    };
    /**
     * 显示 point 坐标点对应的 tooltip。
     * @param point 画布坐标点
     * @returns View
     */
    View.prototype.showTooltip = function (point) {
        var tooltip = this.getController('tooltip');
        if (tooltip) {
            tooltip.showTooltip(point);
        }
        return this;
    };
    /**
     * 隐藏 tooltip。
     * @returns View
     */
    View.prototype.hideTooltip = function () {
        var tooltip = this.getController('tooltip');
        if (tooltip) {
            tooltip.hideTooltip();
        }
        return this;
    };
    /**
     * 将 tooltip 锁定到当前位置不能移动。
     * @returns View
     */
    View.prototype.lockTooltip = function () {
        var tooltip = this.getController('tooltip');
        if (tooltip) {
            tooltip.lockTooltip();
        }
        return this;
    };
    /**
     * 将 tooltip 锁定解除。
     * @returns View
     */
    View.prototype.unlockTooltip = function () {
        var tooltip = this.getController('tooltip');
        if (tooltip) {
            tooltip.unlockTooltip();
        }
        return this;
    };
    /**
     * 是否锁定 tooltip。
     * @returns 是否锁定
     */
    View.prototype.isTooltipLocked = function () {
        var tooltip = this.getController('tooltip');
        return tooltip && tooltip.isTooltipLocked();
    };
    /**
     * 获取当前 point 对应的 tooltip 数据项。
     * @param point 坐标点
     * @returns tooltip 数据项
     */
    View.prototype.getTooltipItems = function (point) {
        var tooltip = this.getController('tooltip');
        return tooltip ? tooltip.getTooltipItems(point) : [];
    };
    /**
     * 获取逼近的点的数据集合
     * @param point 当前坐标点
     * @returns  数据
     */
    View.prototype.getSnapRecords = function (point) {
        var geometries = this.geometries;
        var rst = [];
        for (var i = 0, len = geometries.length; i < len; i++) {
            var geom = geometries[i];
            var dataArray = geom.dataArray;
            geom.sort(dataArray); // 先进行排序，便于 tooltip 查找
            var record = void 0;
            for (var j = 0, dataLen = dataArray.length; j < dataLen; j++) {
                var data = dataArray[j];
                record = findDataByPoint(point, data, geom);
                if (record) {
                    rst.push(record);
                }
            }
        }
        // 同样递归处理子 views
        var views = this.views;
        for (var i = 0, len = views.length; i < len; i++) {
            var view = views[i];
            var snapRecords = view.getSnapRecords(point);
            rst = rst.concat(snapRecords);
        }
        return rst;
    };
    /**
     * 获取所有的 pure component 组件，用于布局。
     */
    View.prototype.getComponents = function () {
        var components = [];
        var controllers = this.controllers;
        for (var i = 0, len = controllers.length; i < len; i++) {
            var controller = controllers[i];
            components = components.concat(controller.getComponents());
        }
        return components;
    };
    /**
     * 将 data 数据进行过滤。
     * @param data
     * @returns 过滤之后的数据
     */
    View.prototype.filterData = function (data) {
        var filters = this.options.filters;
        // 不存在 filters，则不需要进行数据过滤
        if (size(filters) === 0) {
            return data;
        }
        // 存在过滤器，则逐个执行过滤，过滤器之间是 与 的关系
        return filter(data, function (datum, idx) {
            // 所有的 filter 字段
            var fields = Object.keys(filters);
            // 所有的条件都通过，才算通过
            return fields.every(function (field) {
                var condition = filters[field];
                // condition 返回 true，则保留
                return condition(datum[field], datum, idx);
            });
        });
    };
    /**
     * 对某一个字段进行过滤
     * @param field
     * @param data
     */
    View.prototype.filterFieldData = function (field, data) {
        var filters = this.options.filters;
        var condition = get(filters, field);
        if (isUndefined(condition)) {
            return data;
        }
        return data.filter(function (datum, idx) { return condition(datum[field], datum, idx); });
    };
    /**
     * 调整 coordinate 的坐标范围。
     */
    View.prototype.adjustCoordinate = function () {
        var _a = this.getCoordinate(), curStart = _a.start, curEnd = _a.end;
        var start = this.coordinateBBox.bl;
        var end = this.coordinateBBox.tr;
        // 在 defaultLayoutFn 中只会在 coordinateBBox 发生变化的时候会调用 adjustCoordinate()，所以不用担心被置位
        if (isEqual(curStart, start) && isEqual(curEnd, end)) {
            this.isCoordinateChanged = false;
            // 如果大小没有变化则不更新
            return;
        }
        this.isCoordinateChanged = true;
        this.coordinateInstance = this.coordinateController.adjust(start, end);
    };
    View.prototype.paint = function (isUpdate) {
        this.renderDataRecursive(isUpdate);
        // 处理 sync scale 的逻辑
        this.syncScale();
        this.emit(VIEW_LIFE_CIRCLE.BEFORE_PAINT);
        // 初始化图形、组件位置，计算 padding
        this.renderPaddingRecursive(isUpdate);
        // 布局图形、组件
        this.renderLayoutRecursive(isUpdate);
        // 背景色 shape
        this.renderBackgroundStyleShape();
        // 最终的绘制 render
        this.renderPaintRecursive(isUpdate);
        this.emit(VIEW_LIFE_CIRCLE.AFTER_PAINT);
        this.isDataChanged = false; // 渲染完毕复位
    };
    /**
     * 渲染背景样式的 shape。
     * 放到 view 中创建的原因是让使用 view 绘制图形的时候，也能够处理背景色
     */
    View.prototype.renderBackgroundStyleShape = function () {
        // 只有根节点才处理
        if (this.parent) {
            return;
        }
        var background = get(this.themeObject, 'background');
        // 配置了背景色
        if (background) {
            // 1. 不存在则创建
            if (!this.backgroundStyleRectShape) {
                this.backgroundStyleRectShape = this.backgroundGroup.addShape('rect', {
                    attrs: {},
                    zIndex: -1,
                    // 背景色 shape 不设置事件捕获
                    capture: false,
                });
                this.backgroundStyleRectShape.toBack();
            }
            // 2. 有了 shape 之后设置背景，位置（更新的时候）
            var _a = this.viewBBox, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            this.backgroundStyleRectShape.attr({
                fill: background,
                x: x,
                y: y,
                width: width,
                height: height,
            });
        }
        else {
            // 没有配置背景色
            if (this.backgroundStyleRectShape) {
                this.backgroundStyleRectShape.remove(true);
                this.backgroundStyleRectShape = undefined;
            }
        }
    };
    /**
     * 递归计算每个 view 的 padding 值，coordinateBBox 和 coordinateInstance
     * @param isUpdate
     */
    View.prototype.renderPaddingRecursive = function (isUpdate) {
        // 1. 子 view 大小相对 coordinateBBox，changeSize 的时候需要重新计算
        this.calculateViewBBox();
        // 2. 更新 coordinate
        this.adjustCoordinate();
        // 3. 初始化组件 component
        this.initComponents(isUpdate);
        // 4. 布局计算每隔 view 的 padding 值
        // 4.1. 自动加 auto padding -> absolute padding，并且增加 appendPadding
        this.autoPadding = calculatePadding(this).shrink(parsePadding(this.appendPadding));
        // 4.2. 计算出新的 coordinateBBox，更新 Coordinate
        // 这里必须保留，原因是后面子 view 的 viewBBox 或根据 parent 的 coordinateBBox
        this.coordinateBBox = this.viewBBox.shrink(this.autoPadding.getPadding());
        this.adjustCoordinate();
        // 刷新 tooltip (tooltip crosshairs 依赖 coordinate 位置)
        var tooltipController = this.controllers.find(function (c) { return c.name === 'tooltip'; });
        tooltipController.update();
        // 同样递归处理子 views
        var views = this.views;
        for (var i = 0, len = views.length; i < len; i++) {
            var view = views[i];
            view.renderPaddingRecursive(isUpdate);
        }
    };
    /**
     * 递归处理 view 的布局，最终是计算各个 view 的 coordinateBBox 和 coordinateInstance
     * @param isUpdate
     */
    View.prototype.renderLayoutRecursive = function (isUpdate) {
        // 1. 同步子 view padding
        // 根据配置获取 padding
        var syncViewPaddingFn = this.syncViewPadding === true
            ? defaultSyncViewPadding
            : isFunction(this.syncViewPadding)
                ? this.syncViewPadding
                : undefined;
        if (syncViewPaddingFn) {
            syncViewPaddingFn(this, this.views, PaddingCal);
            // 同步 padding 之后，更新 coordinate
            this.views.forEach(function (v) {
                v.coordinateBBox = v.viewBBox.shrink(v.autoPadding.getPadding());
                v.adjustCoordinate();
            });
        }
        // 3. 将 view 中的组件按照 view padding 移动到对应的位置
        this.doLayout();
        // 同样递归处理子 views
        var views = this.views;
        for (var i = 0, len = views.length; i < len; i++) {
            var view = views[i];
            view.renderLayoutRecursive(isUpdate);
        }
    };
    /**
     * 最终递归绘制组件和图形
     * @param isUpdate
     */
    View.prototype.renderPaintRecursive = function (isUpdate) {
        var middleGroup = this.middleGroup;
        if (this.limitInPlot) {
            var _a = getCoordinateClipCfg(this.coordinateInstance), type = _a.type, attrs = _a.attrs;
            middleGroup.setClip({
                type: type,
                attrs: attrs,
            });
        }
        else {
            // 清除已有的 clip
            middleGroup.setClip(undefined);
        }
        // 1. 渲染几何标记
        this.paintGeometries(isUpdate);
        // 2. 绘制组件
        this.renderComponents(isUpdate);
        // 同样递归处理子 views
        var views = this.views;
        for (var i = 0, len = views.length; i < len; i++) {
            var view = views[i];
            view.renderPaintRecursive(isUpdate);
        }
    };
    // end Get 方法
    /**
     * 创建 scale，递归到顶层 view 去创建和缓存 scale
     * @param field
     * @param data
     * @param scaleDef
     * @param key
     */
    View.prototype.createScale = function (field, data, scaleDef, key) {
        // 1. 合并 field 对应的 scaleDef，合并原则是底层覆盖顶层（就近原则）
        var currentScaleDef = get(this.options.scales, [field]);
        var mergedScaleDef = __assign(__assign({}, currentScaleDef), scaleDef);
        // 2. 是否存在父 view，在则递归，否则创建
        if (this.parent) {
            return this.parent.createScale(field, data, mergedScaleDef, key);
        }
        // 3. 在根节点 view 通过 scalePool 创建
        return this.scalePool.createScale(field, data, mergedScaleDef, key);
    };
    /**
     * 递归渲染中的数据处理
     * @param isUpdate
     */
    View.prototype.renderDataRecursive = function (isUpdate) {
        // 1. 处理数据
        this.doFilterData();
        // 2. 创建实例
        this.createCoordinate();
        // 3. 初始化 Geometry
        this.initGeometries(isUpdate);
        // 4. 处理分面逻辑，最终都是生成子 view 和 geometry
        this.renderFacet(isUpdate);
        // 同样递归处理子 views
        var views = this.views;
        for (var i = 0, len = views.length; i < len; i++) {
            var view = views[i];
            view.renderDataRecursive(isUpdate);
        }
    };
    /**
     * 计算 region，计算实际的像素范围坐标
     * @private
     */
    View.prototype.calculateViewBBox = function () {
        var x;
        var y;
        var width;
        var height;
        if (this.parent) {
            var bbox = this.parent.coordinateBBox;
            // 存在 parent， 那么就是通过父容器大小计算
            x = bbox.x;
            y = bbox.y;
            width = bbox.width;
            height = bbox.height;
        }
        else {
            // 顶层容器，从 canvas 中取值 宽高
            x = 0;
            y = 0;
            width = this.canvas.get('width');
            height = this.canvas.get('height');
        }
        var _a = this.region, start = _a.start, end = _a.end;
        // 根据 region 计算当前 view 的 bbox 大小。
        var viewBBox = new BBox(x + width * start.x, y + height * start.y, width * (end.x - start.x), height * (end.y - start.y));
        if (!this.viewBBox || !this.viewBBox.isEqual(viewBBox)) {
            // viewBBox 发生变化的时候进行更新
            this.viewBBox = new BBox(x + width * start.x, y + height * start.y, width * (end.x - start.x), height * (end.y - start.y));
        }
        // 初始的 coordinate bbox 大小
        this.coordinateBBox = this.viewBBox;
    };
    /**
     * 初始化事件机制：G 4.0 底层内置支持 name:event 的机制，那么只要所有组件都有自己的 name 即可。
     *
     * G2 的事件只是获取事件委托，然后在 view 嵌套结构中，形成事件冒泡机制。
     * 当前 view 只委托自己 view 中的 Component 和 Geometry 事件，并向上冒泡
     * @private
     */
    View.prototype.initEvents = function () {
        // 三层 group 中的 shape 事件都会通过 G 冒泡上来的
        this.foregroundGroup.on('*', this.onDelegateEvents);
        this.middleGroup.on('*', this.onDelegateEvents);
        this.backgroundGroup.on('*', this.onDelegateEvents);
        this.canvas.on('*', this.onCanvasEvent);
    };
    /**
     * 初始化插件
     */
    View.prototype.initComponentController = function () {
        var usedControllers = this.usedControllers;
        for (var i = 0, len = usedControllers.length; i < len; i++) {
            var controllerName = usedControllers[i];
            var Ctor = getComponentController(controllerName);
            if (Ctor) {
                this.controllers.push(new Ctor(this));
            }
        }
    };
    View.prototype.createViewEvent = function (evt) {
        var shape = evt.shape, name = evt.name;
        var data = shape ? shape.get('origin') : null;
        // 事件在 view 嵌套中冒泡（暂不提供阻止冒泡的机制）
        var e = new Event(this, evt, data);
        e.type = name;
        return e;
    };
    /**
     * 处理 PLOT_EVENTS
     * plot event 需要处理所有的基础事件，并判断是否在画布中，然后再决定是否要 emit。
     * 对于 mouseenter、mouseleave 比较特殊，需要做一下数学比较。
     * @param e
     */
    View.prototype.doPlotEvent = function (e) {
        var type = e.type, x = e.x, y = e.y;
        var point = { x: x, y: y };
        var ALL_EVENTS = [
            'mousedown',
            'mouseup',
            'mousemove',
            'mouseleave',
            'mousewheel',
            'touchstart',
            'touchmove',
            'touchend',
            'touchcancel',
            'click',
            'dblclick',
            'contextmenu',
        ];
        if (ALL_EVENTS.includes(type)) {
            var currentInPlot = this.isPointInPlot(point);
            var newEvent = e.clone();
            if (currentInPlot) {
                var TYPE = "plot:".concat(type); // 组合 plot 事件
                newEvent.type = TYPE;
                this.emit(TYPE, newEvent);
                if (type === 'mouseleave' || type === 'touchend') {
                    // 在plot 内部却离开画布
                    this.isPreMouseInPlot = false;
                }
            }
            // 对于 mouseenter, mouseleave 的计算处理
            if (type === 'mousemove' || type === 'touchmove') {
                if (this.isPreMouseInPlot && !currentInPlot) {
                    if (type === 'mousemove') {
                        newEvent.type = PLOT_EVENTS.MOUSE_LEAVE;
                        this.emit(PLOT_EVENTS.MOUSE_LEAVE, newEvent);
                    }
                    newEvent.type = PLOT_EVENTS.LEAVE;
                    this.emit(PLOT_EVENTS.LEAVE, newEvent);
                }
                else if (!this.isPreMouseInPlot && currentInPlot) {
                    if (type === 'mousemove') {
                        newEvent.type = PLOT_EVENTS.MOUSE_ENTER;
                        this.emit(PLOT_EVENTS.MOUSE_ENTER, newEvent);
                    }
                    newEvent.type = PLOT_EVENTS.ENTER;
                    this.emit(PLOT_EVENTS.ENTER, newEvent);
                }
                // 赋新的状态值
                this.isPreMouseInPlot = currentInPlot;
            }
            else if (type === 'mouseleave' || type === 'touchend') {
                // 可能不在 currentInPlot 中
                if (this.isPreMouseInPlot) {
                    if (type === 'mouseleave') {
                        newEvent.type = PLOT_EVENTS.MOUSE_LEAVE;
                        this.emit(PLOT_EVENTS.MOUSE_LEAVE, newEvent);
                    }
                    newEvent.type = PLOT_EVENTS.LEAVE;
                    this.emit(PLOT_EVENTS.LEAVE, newEvent);
                    this.isPreMouseInPlot = false;
                }
            }
        }
    };
    // view 生命周期 —— 渲染流程
    /**
     * 处理筛选器，筛选数据
     * @private
     */
    View.prototype.doFilterData = function () {
        var data = this.options.data;
        this.filteredData = this.filterData(data);
    };
    /**
     * 初始化 Geometries
     * @private
     */
    View.prototype.initGeometries = function (isUpdate) {
        // 初始化图形的之前，先创建 / 更新 scales
        this.createOrUpdateScales();
        // 实例化 Geometry，然后 view 将所有的 scale 管理起来
        var coordinate = this.getCoordinate();
        var scaleDefs = get(this.options, 'scales', {});
        var geometries = this.geometries;
        for (var i = 0, len = geometries.length; i < len; i++) {
            var geometry = geometries[i];
            // 保持 scales 引用不要变化
            geometry.scales = this.getGeometryScales();
            var cfg = {
                coordinate: coordinate,
                scaleDefs: scaleDefs,
                data: this.filteredData,
                theme: this.themeObject,
                isDataChanged: this.isDataChanged,
                isCoordinateChanged: this.isCoordinateChanged,
            };
            if (isUpdate) {
                // 数据发生更新
                geometry.update(cfg);
            }
            else {
                geometry.init(cfg);
            }
        }
        // Geometry 初始化之后，生成了 scale，然后进行调整 scale 配置
        this.adjustScales();
    };
    /**
     * 根据 Geometry 的所有字段创建 scales
     * 如果存在，则更新，不存在则创建
     */
    View.prototype.createOrUpdateScales = function () {
        var fields = this.getScaleFields();
        var groupedFields = this.getGroupedFields();
        var _a = this.getOptions(), data = _a.data, _b = _a.scales, scales = _b === void 0 ? {} : _b;
        var filteredData = this.filteredData;
        for (var i = 0, len = fields.length; i < len; i++) {
            var field = fields[i];
            var scaleDef = scales[field];
            // 调用方法，递归去创建
            var key = this.getScaleKey(field);
            this.createScale(field, 
            // 分组字段的 scale 使用未过滤的数据创建
            groupedFields.includes(field) ? data : filteredData, scaleDef, key);
            // 缓存从当前 view 创建的 scale key
            this.createdScaleKeys.set(key, true);
        }
    };
    /**
     * 处理 scale 同步逻辑
     */
    View.prototype.syncScale = function () {
        // 最终调用 root view 的
        this.getRootView().scalePool.sync(this.getCoordinate(), this.theme);
    };
    /**
     * 获得 Geometry 中的 scale 对象
     */
    View.prototype.getGeometryScales = function () {
        var fields = this.getScaleFields();
        var scales = {};
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            scales[field] = this.getScaleByField(field);
        }
        return scales;
    };
    View.prototype.getScaleFields = function () {
        var fields = [];
        var tmpMap = new Map();
        var geometries = this.geometries;
        for (var i = 0; i < geometries.length; i++) {
            var geometry = geometries[i];
            var geometryScales = geometry.getScaleFields();
            uniq(geometryScales, fields, tmpMap);
        }
        return fields;
    };
    View.prototype.getGroupedFields = function () {
        var fields = [];
        var tmpMap = new Map();
        var geometries = this.geometries;
        for (var i = 0; i < geometries.length; i++) {
            var geometry = geometries[i];
            var groupFields = geometry.getGroupFields();
            uniq(groupFields, fields, tmpMap);
        }
        return fields;
    };
    /**
     * 调整 scale 配置
     * @private
     */
    View.prototype.adjustScales = function () {
        // 调整目前包括：
        // 分类 scale，调整 range 范围
        this.adjustCategoryScaleRange();
    };
    /**
     * 调整分类 scale 的 range，防止超出坐标系外面
     * @private
     */
    View.prototype.adjustCategoryScaleRange = function () {
        var _this = this;
        var xyScales = __spreadArray([this.getXScale()], __read(this.getYScales()), false).filter(function (e) { return !!e; });
        var coordinate = this.getCoordinate();
        var scaleOptions = this.options.scales;
        each(xyScales, function (scale) {
            var field = scale.field, values = scale.values, isCategory = scale.isCategory, isIdentity = scale.isIdentity;
            // 分类或者 identity 的 scale 才进行处理
            if (isCategory || isIdentity) {
                // 存在 value 值，且用户没有配置 range 配置
                if (values && !get(scaleOptions, [field, 'range'])) {
                    // 更新 range
                    scale.range = getDefaultCategoryScaleRange(scale, coordinate, _this.theme);
                }
            }
        });
    };
    /**
     * 根据 options 配置、Geometry 字段配置，自动生成 components
     * @param isUpdate 是否是更新
     * @private
     */
    View.prototype.initComponents = function (isUpdate) {
        // 先全部清空，然后 render
        var controllers = this.controllers;
        for (var i = 0; i < controllers.length; i++) {
            var controller = controllers[i];
            // 更新则走更新逻辑；否则清空载重绘
            if (isUpdate) {
                controller.update();
            }
            else {
                controller.clear();
                controller.render();
            }
        }
    };
    View.prototype.doLayout = function () {
        this.layoutFunc(this);
    };
    /**
     * 创建坐标系
     * @private
     */
    View.prototype.createCoordinate = function () {
        var start = this.coordinateBBox.bl;
        var end = this.coordinateBBox.tr;
        this.coordinateInstance = this.coordinateController.create(start, end);
    };
    /**
     * 根据 options 配置自动渲染 geometry
     * @private
     */
    View.prototype.paintGeometries = function (isUpdate) {
        var doAnimation = this.options.animate;
        // geometry 的 paint 阶段
        var coordinate = this.getCoordinate();
        var canvasRegion = {
            x: this.viewBBox.x,
            y: this.viewBBox.y,
            minX: this.viewBBox.minX,
            minY: this.viewBBox.minY,
            maxX: this.viewBBox.maxX,
            maxY: this.viewBBox.maxY,
            width: this.viewBBox.width,
            height: this.viewBBox.height,
        };
        var geometries = this.geometries;
        for (var i = 0; i < geometries.length; i++) {
            var geometry = geometries[i];
            geometry.coordinate = coordinate;
            geometry.canvasRegion = canvasRegion;
            if (!doAnimation) {
                // 如果 view 不执行动画，那么 view 下所有的 geometry 都不执行动画
                geometry.animate(false);
            }
            geometry.paint(isUpdate);
        }
    };
    /**
     * 最后的绘制组件
     * @param isUpdate
     */
    View.prototype.renderComponents = function (isUpdate) {
        var components = this.getComponents();
        // 先全部清空，然后 render
        for (var i = 0; i < components.length; i++) {
            var co = components[i];
            co.component.render();
        }
    };
    /**
     * 渲染分面，会在其中进行数据分面，然后进行子 view 创建
     * @param isUpdate
     */
    View.prototype.renderFacet = function (isUpdate) {
        if (this.facetInstance) {
            if (isUpdate) {
                this.facetInstance.update();
            }
            else {
                this.facetInstance.clear();
                // 计算分面数据
                this.facetInstance.init();
                // 渲染组件和 views
                this.facetInstance.render();
            }
        }
    };
    View.prototype.initOptions = function () {
        var _this = this;
        var _a = this.options, _b = _a.geometries, geometries = _b === void 0 ? [] : _b, _c = _a.interactions, interactions = _c === void 0 ? [] : _c, _d = _a.views, views = _d === void 0 ? [] : _d, _e = _a.annotations, annotations = _e === void 0 ? [] : _e, coordinate = _a.coordinate, events = _a.events, facets = _a.facets;
        // 设置坐标系
        if (this.coordinateController) {
            // 更新 coordinate controller
            coordinate && this.coordinateController.update(coordinate);
        }
        else {
            // 创建 coordinate controller
            this.coordinateController = new CoordinateController(coordinate);
        }
        // 创建 geometry 实例
        for (var i = 0; i < geometries.length; i++) {
            var geometryOption = geometries[i];
            this.createGeometry(geometryOption);
        }
        // 创建 interactions 实例
        for (var j = 0; j < interactions.length; j++) {
            var interactionOption = interactions[j];
            var type = interactionOption.type, cfg = interactionOption.cfg;
            this.interaction(type, cfg);
        }
        // 创建 view 实例
        for (var k = 0; k < views.length; k++) {
            var viewOption = views[k];
            this.createView(viewOption);
        }
        // 设置 annotation
        var annotationComponent = this.getController('annotation');
        for (var l = 0; l < annotations.length; l++) {
            var annotationOption = annotations[l];
            annotationComponent.annotation(annotationOption);
        }
        // 设置 events
        if (events) {
            each(events, function (eventCallback, eventName) {
                _this.on(eventName, eventCallback);
            });
        }
        if (facets) {
            each(facets, function (facet) {
                var type = facet.type, rest = __rest(facet, ["type"]);
                _this.facet(type, rest);
            });
        }
    };
    View.prototype.createGeometry = function (geometryOption) {
        var type = geometryOption.type, _a = geometryOption.cfg, cfg = _a === void 0 ? {} : _a;
        if (this[type]) {
            var geometry_1 = this[type](cfg);
            each(geometryOption, function (v, k) {
                if (isFunction(geometry_1[k])) {
                    geometry_1[k](v);
                }
            });
        }
    };
    /**
     * scale key 的创建方式
     * @param field
     */
    View.prototype.getScaleKey = function (field) {
        return "".concat(this.id, "-").concat(field);
    };
    return View;
}(Base));
export { View };
/**
 * 注册 geometry 组件
 * @param name
 * @param Ctor
 * @returns Geometry
 */
export function registerGeometry(name, Ctor) {
    // 语法糖，在 view API 上增加原型方法
    View.prototype[name.toLowerCase()] = function (cfg) {
        if (cfg === void 0) { cfg = {}; }
        var props = __assign({ 
            /** 图形容器 */
            container: this.middleGroup.addGroup(), labelsContainer: this.foregroundGroup.addGroup() }, cfg);
        var geometry = new Ctor(props);
        this.geometries.push(geometry);
        return geometry;
    };
}
export default View;
//# sourceMappingURL=view.js.map