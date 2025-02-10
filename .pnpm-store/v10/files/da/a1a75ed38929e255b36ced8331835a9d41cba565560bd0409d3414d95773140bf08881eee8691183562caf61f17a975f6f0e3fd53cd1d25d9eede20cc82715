"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var constant_1 = require("../../constant");
var dependents_1 = require("../../dependents");
var animate_1 = require("../../animate/");
var axis_1 = require("../../util/axis");
var axis_2 = require("../../util/axis");
var grid_1 = require("../../util/grid");
var helper_1 = require("../../util/helper");
var base_1 = require("./base");
// update 组件的时候，忽略的数据更新
var OMIT_CFG = ['container'];
// 坐标轴默认动画配置
var AXIS_DEFAULT_ANIMATE_CFG = tslib_1.__assign(tslib_1.__assign({}, animate_1.DEFAULT_ANIMATE_CFG), { appear: null });
/**
 * @ignore
 * G2 Axis controller, will:
 *  - create component
 *    - axis
 *    - grid
 *  - life circle
 */
var Axis = /** @class */ (function (_super) {
    tslib_1.__extends(Axis, _super);
    function Axis(view) {
        var _this = _super.call(this, view) || this;
        /** 使用 object 存储组件 */
        _this.cache = new Map();
        // 先创建 gridContainer，将 grid 放到 axis 底层
        _this.gridContainer = _this.view.getLayer(constant_1.LAYER.BG).addGroup();
        _this.gridForeContainer = _this.view.getLayer(constant_1.LAYER.FORE).addGroup();
        _this.axisContainer = _this.view.getLayer(constant_1.LAYER.BG).addGroup();
        _this.axisForeContainer = _this.view.getLayer(constant_1.LAYER.FORE).addGroup();
        return _this;
    }
    Object.defineProperty(Axis.prototype, "name", {
        get: function () {
            return 'axis';
        },
        enumerable: false,
        configurable: true
    });
    Axis.prototype.init = function () { };
    Axis.prototype.render = function () {
        this.update();
    };
    /**
     * 更新组件布局，位置大小
     */
    Axis.prototype.layout = function () {
        var _this = this;
        var coordinate = this.view.getCoordinate();
        (0, util_1.each)(this.getComponents(), function (co) {
            var component = co.component, direction = co.direction, type = co.type, extra = co.extra;
            var dim = extra.dim, scale = extra.scale, alignTick = extra.alignTick;
            var updated;
            if (type === constant_1.COMPONENT_TYPE.AXIS) {
                if (coordinate.isPolar) {
                    if (dim === 'x') {
                        updated = coordinate.isTransposed
                            ? (0, axis_1.getAxisRegion)(coordinate, direction)
                            : (0, axis_1.getCircleAxisCenterRadius)(coordinate);
                    }
                    else if (dim === 'y') {
                        updated = coordinate.isTransposed
                            ? (0, axis_1.getCircleAxisCenterRadius)(coordinate)
                            : (0, axis_1.getAxisRegion)(coordinate, direction);
                    }
                }
                else {
                    updated = (0, axis_1.getAxisRegion)(coordinate, direction);
                }
            }
            else if (type === constant_1.COMPONENT_TYPE.GRID) {
                if (coordinate.isPolar) {
                    var items = void 0;
                    if (coordinate.isTransposed) {
                        items =
                            dim === 'x'
                                ? (0, grid_1.getCircleGridItems)(coordinate, _this.view.getYScales()[0], scale, alignTick, dim)
                                : (0, grid_1.getLineGridItems)(coordinate, scale, dim, alignTick);
                    }
                    else {
                        items =
                            dim === 'x'
                                ? (0, grid_1.getLineGridItems)(coordinate, scale, dim, alignTick)
                                : (0, grid_1.getCircleGridItems)(coordinate, _this.view.getXScale(), scale, alignTick, dim);
                    }
                    updated = {
                        items: items,
                        // coordinate 更新之后，center 也变化了
                        center: _this.view.getCoordinate().getCenter(),
                    };
                }
                else {
                    updated = { items: (0, grid_1.getLineGridItems)(coordinate, scale, dim, alignTick) };
                }
            }
            component.update(updated);
        });
    };
    /**
     * 更新 axis 组件
     */
    Axis.prototype.update = function () {
        this.option = this.view.getOptions().axes;
        var updatedCache = new Map();
        this.updateXAxes(updatedCache);
        this.updateYAxes(updatedCache);
        // 处理完成之后，销毁删除的
        // 不在处理中的
        var newCache = new Map();
        this.cache.forEach(function (co, key) {
            if (updatedCache.has(key)) {
                newCache.set(key, co);
            }
            else {
                // 不存在，则是所有需要被销毁的组件
                co.component.destroy();
            }
        });
        // 更新缓存
        this.cache = newCache;
    };
    Axis.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.cache.clear();
        this.gridContainer.clear();
        this.gridForeContainer.clear();
        this.axisContainer.clear();
        this.axisForeContainer.clear();
    };
    Axis.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.gridContainer.remove(true);
        this.gridForeContainer.remove(true);
        this.axisContainer.remove(true);
        this.axisForeContainer.remove(true);
    };
    /**
     * @override
     */
    Axis.prototype.getComponents = function () {
        var co = [];
        this.cache.forEach(function (value) {
            co.push(value);
        });
        return co;
    };
    /**
     * 更新 x axis
     * @param updatedCache
     */
    Axis.prototype.updateXAxes = function (updatedCache) {
        // x axis
        var scale = this.view.getXScale();
        if (!scale || scale.isIdentity) {
            return;
        }
        var xAxisOption = (0, axis_2.getAxisOption)(this.option, scale.field);
        if (xAxisOption === false) {
            return;
        }
        var direction = (0, axis_1.getAxisDirection)(xAxisOption, constant_1.DIRECTION.BOTTOM);
        var layer = constant_1.LAYER.BG;
        var dim = 'x';
        var coordinate = this.view.getCoordinate();
        var axisId = this.getId('axis', scale.field);
        var gridId = this.getId('grid', scale.field);
        if (coordinate.isRect) {
            // 1. do axis update
            var axis = this.cache.get(axisId);
            // 存在则更新
            if (axis) {
                var cfg = this.getLineAxisCfg(scale, xAxisOption, direction);
                (0, helper_1.omit)(cfg, OMIT_CFG);
                axis.component.update(cfg);
                updatedCache.set(axisId, axis);
            }
            else {
                // 不存在，则创建
                axis = this.createLineAxis(scale, xAxisOption, layer, direction, dim);
                this.cache.set(axisId, axis);
                updatedCache.set(axisId, axis);
            }
            // 2. do grid update
            var grid = this.cache.get(gridId);
            // 存在则更新
            if (grid) {
                var cfg = this.getLineGridCfg(scale, xAxisOption, direction, dim);
                (0, helper_1.omit)(cfg, OMIT_CFG);
                grid.component.update(cfg);
                updatedCache.set(gridId, grid);
            }
            else {
                // 不存在则创建
                grid = this.createLineGrid(scale, xAxisOption, layer, direction, dim);
                if (grid) {
                    this.cache.set(gridId, grid);
                    updatedCache.set(gridId, grid);
                }
            }
        }
        else if (coordinate.isPolar) {
            // 1. do axis update
            var axis = this.cache.get(axisId);
            // 存在则更新
            if (axis) {
                var cfg = coordinate.isTransposed
                    ? this.getLineAxisCfg(scale, xAxisOption, constant_1.DIRECTION.RADIUS)
                    : this.getCircleAxisCfg(scale, xAxisOption, direction);
                (0, helper_1.omit)(cfg, OMIT_CFG);
                axis.component.update(cfg);
                updatedCache.set(axisId, axis);
            }
            else {
                // 不存在，则创建
                if (coordinate.isTransposed) {
                    if ((0, util_1.isUndefined)(xAxisOption)) {
                        // 默认不渲染转置极坐标下的坐标轴
                        return;
                    }
                    else {
                        // 如果用户打开了隐藏的坐标轴 chart.axis(true)/chart.axis('x', true)
                        // 那么对于转置了的极坐标，半径轴显示的是 x 轴对应的数据
                        axis = this.createLineAxis(scale, xAxisOption, layer, constant_1.DIRECTION.RADIUS, dim);
                    }
                }
                else {
                    axis = this.createCircleAxis(scale, xAxisOption, layer, direction, dim);
                }
                this.cache.set(axisId, axis);
                updatedCache.set(axisId, axis);
            }
            // 2. do grid update
            var grid = this.cache.get(gridId);
            // 存在则更新
            if (grid) {
                var cfg = coordinate.isTransposed
                    ? this.getCircleGridCfg(scale, xAxisOption, constant_1.DIRECTION.RADIUS, dim)
                    : this.getLineGridCfg(scale, xAxisOption, constant_1.DIRECTION.CIRCLE, dim);
                (0, helper_1.omit)(cfg, OMIT_CFG);
                grid.component.update(cfg);
                updatedCache.set(gridId, grid);
            }
            else {
                // 不存在则创建
                if (coordinate.isTransposed) {
                    if ((0, util_1.isUndefined)(xAxisOption)) {
                        return;
                    }
                    else {
                        grid = this.createCircleGrid(scale, xAxisOption, layer, constant_1.DIRECTION.RADIUS, dim);
                    }
                }
                else {
                    // grid，极坐标下的 x 轴网格线沿着半径方向绘制
                    grid = this.createLineGrid(scale, xAxisOption, layer, constant_1.DIRECTION.CIRCLE, dim);
                }
                if (grid) {
                    this.cache.set(gridId, grid);
                    updatedCache.set(gridId, grid);
                }
            }
        }
        else {
            // helix and other, do not draw axis
        }
    };
    Axis.prototype.updateYAxes = function (updatedCache) {
        var _this = this;
        // y axes
        var yScales = this.view.getYScales();
        (0, util_1.each)(yScales, function (scale, idx) {
            // @ts-ignore
            if (!scale || scale.isIdentity) {
                return;
            }
            var field = scale.field;
            var yAxisOption = (0, axis_2.getAxisOption)(_this.option, field);
            if (yAxisOption !== false) {
                var layer = constant_1.LAYER.BG;
                var dim = 'y';
                var axisId = _this.getId('axis', field);
                var gridId = _this.getId('grid', field);
                var coordinate = _this.view.getCoordinate();
                if (coordinate.isRect) {
                    var direction = (0, axis_1.getAxisDirection)(yAxisOption, idx === 0 ? constant_1.DIRECTION.LEFT : constant_1.DIRECTION.RIGHT);
                    // 1. do axis update
                    var axis = _this.cache.get(axisId);
                    // 存在则更新
                    if (axis) {
                        var cfg = _this.getLineAxisCfg(scale, yAxisOption, direction);
                        (0, helper_1.omit)(cfg, OMIT_CFG);
                        axis.component.update(cfg);
                        updatedCache.set(axisId, axis);
                    }
                    else {
                        // 不存在，则创建
                        axis = _this.createLineAxis(scale, yAxisOption, layer, direction, dim);
                        _this.cache.set(axisId, axis);
                        updatedCache.set(axisId, axis);
                    }
                    // 2. do grid update
                    var grid = _this.cache.get(gridId);
                    // 存在则更新
                    if (grid) {
                        var cfg = _this.getLineGridCfg(scale, yAxisOption, direction, dim);
                        (0, helper_1.omit)(cfg, OMIT_CFG);
                        grid.component.update(cfg);
                        updatedCache.set(gridId, grid);
                    }
                    else {
                        // 不存在则创建
                        grid = _this.createLineGrid(scale, yAxisOption, layer, direction, dim);
                        if (grid) {
                            _this.cache.set(gridId, grid);
                            updatedCache.set(gridId, grid);
                        }
                    }
                }
                else if (coordinate.isPolar) {
                    // 1. do axis update
                    var axis = _this.cache.get(axisId);
                    // 存在则更新
                    if (axis) {
                        var cfg = coordinate.isTransposed
                            ? _this.getCircleAxisCfg(scale, yAxisOption, constant_1.DIRECTION.CIRCLE)
                            : _this.getLineAxisCfg(scale, yAxisOption, constant_1.DIRECTION.RADIUS);
                        // @ts-ignore
                        (0, helper_1.omit)(cfg, OMIT_CFG);
                        axis.component.update(cfg);
                        updatedCache.set(axisId, axis);
                    }
                    else {
                        // 不存在，则创建
                        if (coordinate.isTransposed) {
                            if ((0, util_1.isUndefined)(yAxisOption)) {
                                return;
                            }
                            else {
                                axis = _this.createCircleAxis(scale, yAxisOption, layer, constant_1.DIRECTION.CIRCLE, dim);
                            }
                        }
                        else {
                            axis = _this.createLineAxis(scale, yAxisOption, layer, constant_1.DIRECTION.RADIUS, dim);
                        }
                        _this.cache.set(axisId, axis);
                        updatedCache.set(axisId, axis);
                    }
                    // 2. do grid update
                    var grid = _this.cache.get(gridId);
                    // 存在则更新
                    if (grid) {
                        var cfg = coordinate.isTransposed
                            ? _this.getLineGridCfg(scale, yAxisOption, constant_1.DIRECTION.CIRCLE, dim)
                            : _this.getCircleGridCfg(scale, yAxisOption, constant_1.DIRECTION.RADIUS, dim);
                        (0, helper_1.omit)(cfg, OMIT_CFG);
                        grid.component.update(cfg);
                        updatedCache.set(gridId, grid);
                    }
                    else {
                        // 不存在则创建
                        if (coordinate.isTransposed) {
                            if ((0, util_1.isUndefined)(yAxisOption)) {
                                return;
                            }
                            else {
                                grid = _this.createLineGrid(scale, yAxisOption, layer, constant_1.DIRECTION.CIRCLE, dim);
                            }
                        }
                        else {
                            grid = _this.createCircleGrid(scale, yAxisOption, layer, constant_1.DIRECTION.RADIUS, dim);
                        }
                        if (grid) {
                            _this.cache.set(gridId, grid);
                            updatedCache.set(gridId, grid);
                        }
                    }
                }
                else {
                    // helix and other, do not draw axis
                }
            }
        });
    };
    /**
     * 创建 line axis
     * @param scale
     * @param option
     * @param layer
     * @param direction
     * @param dim
     */
    Axis.prototype.createLineAxis = function (scale, option, layer, direction, dim) {
        // axis
        var axis = {
            component: new dependents_1.LineAxis(this.getLineAxisCfg(scale, option, direction)),
            layer: layer,
            direction: direction === constant_1.DIRECTION.RADIUS ? constant_1.DIRECTION.NONE : direction,
            type: constant_1.COMPONENT_TYPE.AXIS,
            extra: { dim: dim, scale: scale },
        };
        axis.component.set('field', scale.field);
        axis.component.init();
        return axis;
    };
    Axis.prototype.createLineGrid = function (scale, option, layer, direction, dim) {
        var cfg = this.getLineGridCfg(scale, option, direction, dim);
        if (cfg) {
            var grid = {
                component: new dependents_1.LineGrid(cfg),
                layer: layer,
                direction: constant_1.DIRECTION.NONE,
                type: constant_1.COMPONENT_TYPE.GRID,
                extra: {
                    dim: dim,
                    scale: scale,
                    alignTick: (0, util_1.get)(cfg, 'alignTick', true),
                },
            };
            grid.component.init();
            return grid;
        }
    };
    Axis.prototype.createCircleAxis = function (scale, option, layer, direction, dim) {
        var axis = {
            component: new dependents_1.CircleAxis(this.getCircleAxisCfg(scale, option, direction)),
            layer: layer,
            direction: direction,
            type: constant_1.COMPONENT_TYPE.AXIS,
            extra: { dim: dim, scale: scale },
        };
        axis.component.set('field', scale.field);
        axis.component.init();
        return axis;
    };
    Axis.prototype.createCircleGrid = function (scale, option, layer, direction, dim) {
        var cfg = this.getCircleGridCfg(scale, option, direction, dim);
        if (cfg) {
            var grid = {
                component: new dependents_1.CircleGrid(cfg),
                layer: layer,
                direction: constant_1.DIRECTION.NONE,
                type: constant_1.COMPONENT_TYPE.GRID,
                extra: {
                    dim: dim,
                    scale: scale,
                    alignTick: (0, util_1.get)(cfg, 'alignTick', true),
                },
            };
            grid.component.init();
            return grid;
        }
    };
    /**
     * generate line axis cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @return line axis cfg
     */
    Axis.prototype.getLineAxisCfg = function (scale, axisOption, direction) {
        var container = (0, util_1.get)(axisOption, ['top']) ? this.axisForeContainer : this.axisContainer;
        var coordinate = this.view.getCoordinate();
        var region = (0, axis_1.getAxisRegion)(coordinate, direction);
        var titleText = (0, axis_1.getAxisTitleText)(scale, axisOption);
        var axisThemeCfg = (0, axis_1.getAxisThemeCfg)(this.view.getTheme(), direction);
        // the cfg order should be ensure
        var optionWithTitle = (0, util_1.get)(axisOption, ['title'])
            ? (0, util_1.deepMix)({ title: { style: { text: titleText } } }, { title: (0, axis_1.getAxisTitleOptions)(this.view.getTheme(), direction, axisOption.title) }, axisOption)
            : axisOption;
        var cfg = (0, util_1.deepMix)(tslib_1.__assign(tslib_1.__assign({ container: container }, region), { ticks: scale.getTicks().map(function (tick) { return ({ id: "".concat(tick.tickValue), name: tick.text, value: tick.value }); }), verticalFactor: coordinate.isPolar
                ? (0, axis_1.getAxisFactorByRegion)(region, coordinate.getCenter()) * -1
                : (0, axis_1.getAxisFactorByRegion)(region, coordinate.getCenter()), theme: axisThemeCfg }), axisThemeCfg, optionWithTitle);
        var _a = this.getAnimateCfg(cfg), animate = _a.animate, animateOption = _a.animateOption;
        cfg.animateOption = animateOption;
        cfg.animate = animate;
        // 计算 verticalLimitLength
        var isAxisVertical = (0, axis_1.isVertical)(region);
        // TODO: 1 / 3 等默认值需要有一个全局的配置的地方
        var verticalLimitLength = (0, util_1.get)(cfg, 'verticalLimitLength', isAxisVertical ? 1 / 3 : 1 / 2);
        if (verticalLimitLength <= 1) {
            // 配置的相对值，相对于画布
            var canvasWidth = this.view.getCanvas().get('width');
            var canvasHeight = this.view.getCanvas().get('height');
            cfg.verticalLimitLength = verticalLimitLength * (isAxisVertical ? canvasWidth : canvasHeight);
        }
        return cfg;
    };
    /**
     * generate line grid cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @param dim
     * @return line grid cfg
     */
    Axis.prototype.getLineGridCfg = function (scale, axisOption, direction, dim) {
        if (!(0, grid_1.showGrid)((0, axis_1.getAxisThemeCfg)(this.view.getTheme(), direction), axisOption)) {
            return undefined;
        }
        var gridThemeCfg = (0, grid_1.getGridThemeCfg)(this.view.getTheme(), direction);
        // the cfg order should be ensure
        // grid 动画以 axis 为准
        var gridCfg = (0, util_1.deepMix)({
            container: (0, util_1.get)(axisOption, ['top']) ? this.gridForeContainer : this.gridContainer,
        }, gridThemeCfg, (0, util_1.get)(axisOption, 'grid'), this.getAnimateCfg(axisOption));
        gridCfg.items = (0, grid_1.getLineGridItems)(this.view.getCoordinate(), scale, dim, (0, util_1.get)(gridCfg, 'alignTick', true));
        return gridCfg;
    };
    /**
     * generate circle axis cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @return circle axis cfg
     */
    Axis.prototype.getCircleAxisCfg = function (scale, axisOption, direction) {
        var container = (0, util_1.get)(axisOption, ['top']) ? this.axisForeContainer : this.axisContainer;
        var coordinate = this.view.getCoordinate();
        var ticks = scale.getTicks().map(function (tick) { return ({ id: "".concat(tick.tickValue), name: tick.text, value: tick.value }); });
        if (!scale.isCategory && Math.abs(coordinate.endAngle - coordinate.startAngle) === Math.PI * 2) {
            // x 轴对应的值如果是非 cat 类型，在整圆的情况下坐标轴第一个和最后一个文本会重叠，默认只展示第一个文本
            if (ticks.length)
                ticks[ticks.length - 1].name = '';
        }
        var titleText = (0, axis_1.getAxisTitleText)(scale, axisOption);
        var axisThemeCfg = (0, axis_1.getAxisThemeCfg)(this.view.getTheme(), constant_1.DIRECTION.CIRCLE);
        // the cfg order should be ensure
        var optionWithTitle = (0, util_1.get)(axisOption, ['title'])
            ? (0, util_1.deepMix)({ title: { style: { text: titleText } } }, { title: (0, axis_1.getAxisTitleOptions)(this.view.getTheme(), direction, axisOption.title) }, axisOption)
            : axisOption;
        var cfg = (0, util_1.deepMix)(tslib_1.__assign(tslib_1.__assign({ container: container }, (0, axis_1.getCircleAxisCenterRadius)(this.view.getCoordinate())), { ticks: ticks, verticalFactor: 1, theme: axisThemeCfg }), axisThemeCfg, optionWithTitle);
        var _a = this.getAnimateCfg(cfg), animate = _a.animate, animateOption = _a.animateOption;
        cfg.animate = animate;
        cfg.animateOption = animateOption;
        return cfg;
    };
    /**
     * generate circle grid cfg
     * @param scale
     * @param axisOption
     * @param direction
     * @return circle grid cfg
     */
    Axis.prototype.getCircleGridCfg = function (scale, axisOption, direction, dim) {
        if (!(0, grid_1.showGrid)((0, axis_1.getAxisThemeCfg)(this.view.getTheme(), direction), axisOption)) {
            return undefined;
        }
        // the cfg order should be ensure
        // grid 动画以 axis 为准
        var gridThemeCfg = (0, grid_1.getGridThemeCfg)(this.view.getTheme(), constant_1.DIRECTION.RADIUS);
        var gridCfg = (0, util_1.deepMix)({
            container: (0, util_1.get)(axisOption, ['top']) ? this.gridForeContainer : this.gridContainer,
            center: this.view.getCoordinate().getCenter(),
        }, gridThemeCfg, (0, util_1.get)(axisOption, 'grid'), this.getAnimateCfg(axisOption));
        var alignTick = (0, util_1.get)(gridCfg, 'alignTick', true);
        var verticalScale = dim === 'x' ? this.view.getYScales()[0] : this.view.getXScale();
        gridCfg.items = (0, grid_1.getCircleGridItems)(this.view.getCoordinate(), verticalScale, scale, alignTick, dim);
        // the cfg order should be ensure
        // grid 动画以 axis 为准
        return gridCfg;
    };
    Axis.prototype.getId = function (name, key) {
        var coordinate = this.view.getCoordinate();
        // 坐标系类型也作为组件的 key
        return "".concat(name, "-").concat(key, "-").concat(coordinate.type);
    };
    Axis.prototype.getAnimateCfg = function (cfg) {
        return {
            animate: this.view.getOptions().animate && (0, util_1.get)(cfg, 'animate'),
            animateOption: cfg && cfg.animateOption ? (0, util_1.deepMix)({}, AXIS_DEFAULT_ANIMATE_CFG, cfg.animateOption) : AXIS_DEFAULT_ANIMATE_CFG,
        };
    };
    return Axis;
}(base_1.Controller));
exports.default = Axis;
//# sourceMappingURL=axis.js.map