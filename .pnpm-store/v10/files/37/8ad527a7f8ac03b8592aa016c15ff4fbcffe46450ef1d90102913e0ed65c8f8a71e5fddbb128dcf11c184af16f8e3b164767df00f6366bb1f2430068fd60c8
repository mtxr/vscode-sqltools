import { __assign, __extends } from "tslib";
import { deepMix, each, get, isUndefined } from '@antv/util';
import { DIRECTION, COMPONENT_TYPE, LAYER } from '../../constant';
import { CircleAxis, CircleGrid, LineAxis, LineGrid } from '../../dependents';
import { DEFAULT_ANIMATE_CFG } from '../../animate/';
import { getAxisDirection, getAxisFactorByRegion, getAxisRegion, getAxisThemeCfg, getAxisTitleOptions, getAxisTitleText, getCircleAxisCenterRadius, isVertical, } from '../../util/axis';
import { getAxisOption } from '../../util/axis';
import { getCircleGridItems, getGridThemeCfg, getLineGridItems, showGrid } from '../../util/grid';
import { omit } from '../../util/helper';
import { Controller } from './base';
// update 组件的时候，忽略的数据更新
var OMIT_CFG = ['container'];
// 坐标轴默认动画配置
var AXIS_DEFAULT_ANIMATE_CFG = __assign(__assign({}, DEFAULT_ANIMATE_CFG), { appear: null });
/**
 * @ignore
 * G2 Axis controller, will:
 *  - create component
 *    - axis
 *    - grid
 *  - life circle
 */
var Axis = /** @class */ (function (_super) {
    __extends(Axis, _super);
    function Axis(view) {
        var _this = _super.call(this, view) || this;
        /** 使用 object 存储组件 */
        _this.cache = new Map();
        // 先创建 gridContainer，将 grid 放到 axis 底层
        _this.gridContainer = _this.view.getLayer(LAYER.BG).addGroup();
        _this.gridForeContainer = _this.view.getLayer(LAYER.FORE).addGroup();
        _this.axisContainer = _this.view.getLayer(LAYER.BG).addGroup();
        _this.axisForeContainer = _this.view.getLayer(LAYER.FORE).addGroup();
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
        each(this.getComponents(), function (co) {
            var component = co.component, direction = co.direction, type = co.type, extra = co.extra;
            var dim = extra.dim, scale = extra.scale, alignTick = extra.alignTick;
            var updated;
            if (type === COMPONENT_TYPE.AXIS) {
                if (coordinate.isPolar) {
                    if (dim === 'x') {
                        updated = coordinate.isTransposed
                            ? getAxisRegion(coordinate, direction)
                            : getCircleAxisCenterRadius(coordinate);
                    }
                    else if (dim === 'y') {
                        updated = coordinate.isTransposed
                            ? getCircleAxisCenterRadius(coordinate)
                            : getAxisRegion(coordinate, direction);
                    }
                }
                else {
                    updated = getAxisRegion(coordinate, direction);
                }
            }
            else if (type === COMPONENT_TYPE.GRID) {
                if (coordinate.isPolar) {
                    var items = void 0;
                    if (coordinate.isTransposed) {
                        items =
                            dim === 'x'
                                ? getCircleGridItems(coordinate, _this.view.getYScales()[0], scale, alignTick, dim)
                                : getLineGridItems(coordinate, scale, dim, alignTick);
                    }
                    else {
                        items =
                            dim === 'x'
                                ? getLineGridItems(coordinate, scale, dim, alignTick)
                                : getCircleGridItems(coordinate, _this.view.getXScale(), scale, alignTick, dim);
                    }
                    updated = {
                        items: items,
                        // coordinate 更新之后，center 也变化了
                        center: _this.view.getCoordinate().getCenter(),
                    };
                }
                else {
                    updated = { items: getLineGridItems(coordinate, scale, dim, alignTick) };
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
        var xAxisOption = getAxisOption(this.option, scale.field);
        if (xAxisOption === false) {
            return;
        }
        var direction = getAxisDirection(xAxisOption, DIRECTION.BOTTOM);
        var layer = LAYER.BG;
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
                omit(cfg, OMIT_CFG);
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
                omit(cfg, OMIT_CFG);
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
                    ? this.getLineAxisCfg(scale, xAxisOption, DIRECTION.RADIUS)
                    : this.getCircleAxisCfg(scale, xAxisOption, direction);
                omit(cfg, OMIT_CFG);
                axis.component.update(cfg);
                updatedCache.set(axisId, axis);
            }
            else {
                // 不存在，则创建
                if (coordinate.isTransposed) {
                    if (isUndefined(xAxisOption)) {
                        // 默认不渲染转置极坐标下的坐标轴
                        return;
                    }
                    else {
                        // 如果用户打开了隐藏的坐标轴 chart.axis(true)/chart.axis('x', true)
                        // 那么对于转置了的极坐标，半径轴显示的是 x 轴对应的数据
                        axis = this.createLineAxis(scale, xAxisOption, layer, DIRECTION.RADIUS, dim);
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
                    ? this.getCircleGridCfg(scale, xAxisOption, DIRECTION.RADIUS, dim)
                    : this.getLineGridCfg(scale, xAxisOption, DIRECTION.CIRCLE, dim);
                omit(cfg, OMIT_CFG);
                grid.component.update(cfg);
                updatedCache.set(gridId, grid);
            }
            else {
                // 不存在则创建
                if (coordinate.isTransposed) {
                    if (isUndefined(xAxisOption)) {
                        return;
                    }
                    else {
                        grid = this.createCircleGrid(scale, xAxisOption, layer, DIRECTION.RADIUS, dim);
                    }
                }
                else {
                    // grid，极坐标下的 x 轴网格线沿着半径方向绘制
                    grid = this.createLineGrid(scale, xAxisOption, layer, DIRECTION.CIRCLE, dim);
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
        each(yScales, function (scale, idx) {
            // @ts-ignore
            if (!scale || scale.isIdentity) {
                return;
            }
            var field = scale.field;
            var yAxisOption = getAxisOption(_this.option, field);
            if (yAxisOption !== false) {
                var layer = LAYER.BG;
                var dim = 'y';
                var axisId = _this.getId('axis', field);
                var gridId = _this.getId('grid', field);
                var coordinate = _this.view.getCoordinate();
                if (coordinate.isRect) {
                    var direction = getAxisDirection(yAxisOption, idx === 0 ? DIRECTION.LEFT : DIRECTION.RIGHT);
                    // 1. do axis update
                    var axis = _this.cache.get(axisId);
                    // 存在则更新
                    if (axis) {
                        var cfg = _this.getLineAxisCfg(scale, yAxisOption, direction);
                        omit(cfg, OMIT_CFG);
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
                        omit(cfg, OMIT_CFG);
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
                            ? _this.getCircleAxisCfg(scale, yAxisOption, DIRECTION.CIRCLE)
                            : _this.getLineAxisCfg(scale, yAxisOption, DIRECTION.RADIUS);
                        // @ts-ignore
                        omit(cfg, OMIT_CFG);
                        axis.component.update(cfg);
                        updatedCache.set(axisId, axis);
                    }
                    else {
                        // 不存在，则创建
                        if (coordinate.isTransposed) {
                            if (isUndefined(yAxisOption)) {
                                return;
                            }
                            else {
                                axis = _this.createCircleAxis(scale, yAxisOption, layer, DIRECTION.CIRCLE, dim);
                            }
                        }
                        else {
                            axis = _this.createLineAxis(scale, yAxisOption, layer, DIRECTION.RADIUS, dim);
                        }
                        _this.cache.set(axisId, axis);
                        updatedCache.set(axisId, axis);
                    }
                    // 2. do grid update
                    var grid = _this.cache.get(gridId);
                    // 存在则更新
                    if (grid) {
                        var cfg = coordinate.isTransposed
                            ? _this.getLineGridCfg(scale, yAxisOption, DIRECTION.CIRCLE, dim)
                            : _this.getCircleGridCfg(scale, yAxisOption, DIRECTION.RADIUS, dim);
                        omit(cfg, OMIT_CFG);
                        grid.component.update(cfg);
                        updatedCache.set(gridId, grid);
                    }
                    else {
                        // 不存在则创建
                        if (coordinate.isTransposed) {
                            if (isUndefined(yAxisOption)) {
                                return;
                            }
                            else {
                                grid = _this.createLineGrid(scale, yAxisOption, layer, DIRECTION.CIRCLE, dim);
                            }
                        }
                        else {
                            grid = _this.createCircleGrid(scale, yAxisOption, layer, DIRECTION.RADIUS, dim);
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
            component: new LineAxis(this.getLineAxisCfg(scale, option, direction)),
            layer: layer,
            direction: direction === DIRECTION.RADIUS ? DIRECTION.NONE : direction,
            type: COMPONENT_TYPE.AXIS,
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
                component: new LineGrid(cfg),
                layer: layer,
                direction: DIRECTION.NONE,
                type: COMPONENT_TYPE.GRID,
                extra: {
                    dim: dim,
                    scale: scale,
                    alignTick: get(cfg, 'alignTick', true),
                },
            };
            grid.component.init();
            return grid;
        }
    };
    Axis.prototype.createCircleAxis = function (scale, option, layer, direction, dim) {
        var axis = {
            component: new CircleAxis(this.getCircleAxisCfg(scale, option, direction)),
            layer: layer,
            direction: direction,
            type: COMPONENT_TYPE.AXIS,
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
                component: new CircleGrid(cfg),
                layer: layer,
                direction: DIRECTION.NONE,
                type: COMPONENT_TYPE.GRID,
                extra: {
                    dim: dim,
                    scale: scale,
                    alignTick: get(cfg, 'alignTick', true),
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
        var container = get(axisOption, ['top']) ? this.axisForeContainer : this.axisContainer;
        var coordinate = this.view.getCoordinate();
        var region = getAxisRegion(coordinate, direction);
        var titleText = getAxisTitleText(scale, axisOption);
        var axisThemeCfg = getAxisThemeCfg(this.view.getTheme(), direction);
        // the cfg order should be ensure
        var optionWithTitle = get(axisOption, ['title'])
            ? deepMix({ title: { style: { text: titleText } } }, { title: getAxisTitleOptions(this.view.getTheme(), direction, axisOption.title) }, axisOption)
            : axisOption;
        var cfg = deepMix(__assign(__assign({ container: container }, region), { ticks: scale.getTicks().map(function (tick) { return ({ id: "".concat(tick.tickValue), name: tick.text, value: tick.value }); }), verticalFactor: coordinate.isPolar
                ? getAxisFactorByRegion(region, coordinate.getCenter()) * -1
                : getAxisFactorByRegion(region, coordinate.getCenter()), theme: axisThemeCfg }), axisThemeCfg, optionWithTitle);
        var _a = this.getAnimateCfg(cfg), animate = _a.animate, animateOption = _a.animateOption;
        cfg.animateOption = animateOption;
        cfg.animate = animate;
        // 计算 verticalLimitLength
        var isAxisVertical = isVertical(region);
        // TODO: 1 / 3 等默认值需要有一个全局的配置的地方
        var verticalLimitLength = get(cfg, 'verticalLimitLength', isAxisVertical ? 1 / 3 : 1 / 2);
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
        if (!showGrid(getAxisThemeCfg(this.view.getTheme(), direction), axisOption)) {
            return undefined;
        }
        var gridThemeCfg = getGridThemeCfg(this.view.getTheme(), direction);
        // the cfg order should be ensure
        // grid 动画以 axis 为准
        var gridCfg = deepMix({
            container: get(axisOption, ['top']) ? this.gridForeContainer : this.gridContainer,
        }, gridThemeCfg, get(axisOption, 'grid'), this.getAnimateCfg(axisOption));
        gridCfg.items = getLineGridItems(this.view.getCoordinate(), scale, dim, get(gridCfg, 'alignTick', true));
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
        var container = get(axisOption, ['top']) ? this.axisForeContainer : this.axisContainer;
        var coordinate = this.view.getCoordinate();
        var ticks = scale.getTicks().map(function (tick) { return ({ id: "".concat(tick.tickValue), name: tick.text, value: tick.value }); });
        if (!scale.isCategory && Math.abs(coordinate.endAngle - coordinate.startAngle) === Math.PI * 2) {
            // x 轴对应的值如果是非 cat 类型，在整圆的情况下坐标轴第一个和最后一个文本会重叠，默认只展示第一个文本
            if (ticks.length)
                ticks[ticks.length - 1].name = '';
        }
        var titleText = getAxisTitleText(scale, axisOption);
        var axisThemeCfg = getAxisThemeCfg(this.view.getTheme(), DIRECTION.CIRCLE);
        // the cfg order should be ensure
        var optionWithTitle = get(axisOption, ['title'])
            ? deepMix({ title: { style: { text: titleText } } }, { title: getAxisTitleOptions(this.view.getTheme(), direction, axisOption.title) }, axisOption)
            : axisOption;
        var cfg = deepMix(__assign(__assign({ container: container }, getCircleAxisCenterRadius(this.view.getCoordinate())), { ticks: ticks, verticalFactor: 1, theme: axisThemeCfg }), axisThemeCfg, optionWithTitle);
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
        if (!showGrid(getAxisThemeCfg(this.view.getTheme(), direction), axisOption)) {
            return undefined;
        }
        // the cfg order should be ensure
        // grid 动画以 axis 为准
        var gridThemeCfg = getGridThemeCfg(this.view.getTheme(), DIRECTION.RADIUS);
        var gridCfg = deepMix({
            container: get(axisOption, ['top']) ? this.gridForeContainer : this.gridContainer,
            center: this.view.getCoordinate().getCenter(),
        }, gridThemeCfg, get(axisOption, 'grid'), this.getAnimateCfg(axisOption));
        var alignTick = get(gridCfg, 'alignTick', true);
        var verticalScale = dim === 'x' ? this.view.getYScales()[0] : this.view.getXScale();
        gridCfg.items = getCircleGridItems(this.view.getCoordinate(), verticalScale, scale, alignTick, dim);
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
            animate: this.view.getOptions().animate && get(cfg, 'animate'),
            animateOption: cfg && cfg.animateOption ? deepMix({}, AXIS_DEFAULT_ANIMATE_CFG, cfg.animateOption) : AXIS_DEFAULT_ANIMATE_CFG,
        };
    };
    return Axis;
}(Controller));
export default Axis;
//# sourceMappingURL=axis.js.map