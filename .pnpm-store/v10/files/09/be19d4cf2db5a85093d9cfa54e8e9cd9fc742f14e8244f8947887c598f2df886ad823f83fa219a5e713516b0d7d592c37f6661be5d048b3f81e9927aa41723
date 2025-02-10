import { __extends, __read } from "tslib";
import { deepMix, each, find, get, head, isBoolean, last } from '@antv/util';
import { COMPONENT_MAX_VIEW_PERCENTAGE, COMPONENT_TYPE, DIRECTION, LAYER } from '../../constant';
import { CategoryLegend, ContinuousLegend } from '../../dependents';
import { DEFAULT_ANIMATE_CFG } from '../../animate';
import { BBox } from '../../util/bbox';
import { directionToPosition } from '../../util/direction';
import { omit } from '../../util/helper';
import { getCustomLegendItems, getLegendItems, getLegendLayout, getLegendThemeCfg } from '../../util/legend';
import { getName } from '../../util/scale';
import { Controller } from './base';
/**
 * 从配置中获取单个字段的 legend 配置
 * @param legends
 * @param field
 * @returns the option of one legend field
 */
function getLegendOption(legends, field) {
    if (isBoolean(legends)) {
        return legends === false ? false : {};
    }
    return get(legends, [field], legends);
}
function getDirection(legendOption) {
    return get(legendOption, 'position', DIRECTION.BOTTOM);
}
/**
 * @ignore
 * legend Controller
 */
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    function Legend(view) {
        var _this = _super.call(this, view) || this;
        _this.container = _this.view.getLayer(LAYER.FORE).addGroup();
        return _this;
    }
    Object.defineProperty(Legend.prototype, "name", {
        get: function () {
            return 'legend';
        },
        enumerable: false,
        configurable: true
    });
    Legend.prototype.init = function () { };
    /**
     * render the legend component by legend options
     */
    Legend.prototype.render = function () {
        // 和 update 逻辑保持一致
        this.update();
    };
    /**
     * layout legend
     * 计算出 legend 的 direction 位置 x, y
     */
    Legend.prototype.layout = function () {
        var _this = this;
        this.layoutBBox = this.view.viewBBox;
        each(this.components, function (co) {
            var component = co.component, direction = co.direction;
            var layout = getLegendLayout(direction);
            var maxWidthRatio = component.get('maxWidthRatio');
            var maxHeightRatio = component.get('maxHeightRatio');
            var maxSize = _this.getCategoryLegendSizeCfg(layout, maxWidthRatio, maxHeightRatio);
            var maxWidth = component.get('maxWidth');
            var maxHeight = component.get('maxHeight');
            // 先更新 maxSize，更新 layoutBBox，以便计算正确的 x y
            component.update({
                maxWidth: Math.min(maxSize.maxWidth, maxWidth || 0),
                maxHeight: Math.min(maxSize.maxHeight, maxHeight || 0),
            });
            var padding = component.get('padding');
            var bboxObject = component.getLayoutBBox(); // 这里只需要他的 width、height 信息做位置调整
            var bbox = new BBox(bboxObject.x, bboxObject.y, bboxObject.width, bboxObject.height).expand(padding);
            var _a = __read(directionToPosition(_this.view.viewBBox, bbox, direction), 2), x1 = _a[0], y1 = _a[1];
            var _b = __read(directionToPosition(_this.layoutBBox, bbox, direction), 2), x2 = _b[0], y2 = _b[1];
            var x = 0;
            var y = 0;
            // 因为 legend x y 要和 coordinateBBox 对齐，所以要做一个简单的判断
            if (direction.startsWith('top') || direction.startsWith('bottom')) {
                x = x1;
                y = y2;
            }
            else {
                x = x2;
                y = y1;
            }
            // 更新位置
            component.setLocation({ x: x + padding[3], y: y + padding[0] });
            _this.layoutBBox = _this.layoutBBox.cut(bbox, direction);
        });
    };
    /**
     * legend 的更新逻辑
     */
    Legend.prototype.update = function () {
        var _this = this;
        this.option = this.view.getOptions().legends;
        // 已经处理过的 legend
        var updated = {};
        var eachLegend = function (geometry, attr, scale) {
            var id = _this.getId(scale.field);
            var existCo = _this.getComponentById(id);
            // 存在则 update
            if (existCo) {
                var cfg = void 0;
                var legendOption = getLegendOption(_this.option, scale.field);
                // if the legend option is not false, means legend should be created.
                if (legendOption !== false) {
                    if (get(legendOption, 'custom')) {
                        cfg = _this.getCategoryCfg(geometry, attr, scale, legendOption, true);
                    }
                    else {
                        if (scale.isLinear) {
                            // linear field, create continuous legend
                            cfg = _this.getContinuousCfg(geometry, attr, scale, legendOption);
                        }
                        else if (scale.isCategory) {
                            // category field, create category legend
                            cfg = _this.getCategoryCfg(geometry, attr, scale, legendOption);
                        }
                    }
                }
                // 如果 cfg 为空，则不在 updated 标记，那么会在后面逻辑中删除
                if (cfg) {
                    // omit 掉一些属性，比如 container 等
                    omit(cfg, ['container']);
                    existCo.direction = getDirection(legendOption);
                    existCo.component.update(cfg);
                    // 标记为新的
                    updated[id] = true;
                }
            }
            else {
                // 不存在则 create
                var legend = _this.createFieldLegend(geometry, attr, scale);
                if (legend) {
                    legend.component.init();
                    _this.components.push(legend);
                    // 标记为新的
                    updated[id] = true;
                }
            }
        };
        // 全局自定义图例
        if (get(this.option, 'custom')) {
            var id = 'global-custom';
            var existCo = this.getComponentById(id);
            if (existCo) {
                var customCfg = this.getCategoryCfg(undefined, undefined, undefined, this.option, true);
                omit(customCfg, ['container']);
                existCo.component.update(customCfg);
                updated[id] = true;
            }
            else {
                var component = this.createCustomLegend(undefined, undefined, undefined, this.option);
                if (component) {
                    component.init();
                    var layer = LAYER.FORE;
                    var direction = getDirection(this.option);
                    this.components.push({
                        id: id,
                        component: component,
                        layer: layer,
                        direction: direction,
                        type: COMPONENT_TYPE.LEGEND,
                        extra: undefined,
                    });
                    // 标记为更新
                    updated[id] = true;
                }
            }
        }
        else {
            // 遍历处理每一个创建逻辑
            this.loopLegends(eachLegend);
        }
        // 处理完成之后，销毁删除的
        // 不在处理中的
        var components = [];
        each(this.getComponents(), function (co) {
            if (updated[co.id]) {
                components.push(co);
            }
            else {
                co.component.destroy();
            }
        });
        // 更新当前已有的 components
        this.components = components;
    };
    Legend.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.container.clear();
    };
    Legend.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.container.remove(true);
    };
    /**
     * 递归获取所有的 Geometry
     */
    Legend.prototype.getGeometries = function (view) {
        var _this = this;
        var geometries = view.geometries;
        each(view.views, function (v) {
            geometries = geometries.concat(_this.getGeometries(v));
        });
        return geometries;
    };
    /**
     * 遍历 Geometry，处理 legend 逻辑
     * @param doEach 每个 loop 中的处理方法
     */
    Legend.prototype.loopLegends = function (doEach) {
        var isRootView = this.view.getRootView() === this.view;
        // 非根 view，不处理 legend
        if (!isRootView) {
            return;
        }
        // 递归 view 中所有的 Geometry，进行创建 legend
        var geometries = this.getGeometries(this.view);
        var looped = {}; // 防止一个字段创建两个 legend
        each(geometries, function (geometry) {
            var attributes = geometry.getGroupAttributes();
            each(attributes, function (attr) {
                var scale = attr.getScale(attr.type);
                // 如果在视觉通道上映射常量值，如 size(2) shape('circle') 不创建 legend
                if (!scale || scale.type === 'identity' || looped[scale.field]) {
                    return;
                }
                doEach(geometry, attr, scale);
                looped[scale.field] = true;
            });
        });
    };
    /**
     * 创建一个 legend
     * @param geometry
     * @param attr
     * @param scale
     */
    Legend.prototype.createFieldLegend = function (geometry, attr, scale) {
        var component;
        var legendOption = getLegendOption(this.option, scale.field);
        var layer = LAYER.FORE;
        var direction = getDirection(legendOption);
        // if the legend option is not false, means legend should be created.
        if (legendOption !== false) {
            if (get(legendOption, 'custom')) {
                component = this.createCustomLegend(geometry, attr, scale, legendOption);
            }
            else {
                if (scale.isLinear) {
                    // linear field, create continuous legend
                    component = this.createContinuousLegend(geometry, attr, scale, legendOption);
                }
                else if (scale.isCategory) {
                    // category field, create category legend
                    component = this.createCategoryLegend(geometry, attr, scale, legendOption);
                }
            }
        }
        if (component) {
            component.set('field', scale.field);
            return {
                id: this.getId(scale.field),
                component: component,
                layer: layer,
                direction: direction,
                type: COMPONENT_TYPE.LEGEND,
                extra: { scale: scale },
            };
        }
    };
    /**
     * 自定义图例使用 category 图例去渲染
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    Legend.prototype.createCustomLegend = function (geometry, attr, scale, legendOption) {
        // 直接使用 分类图例渲染
        var cfg = this.getCategoryCfg(geometry, attr, scale, legendOption, true);
        return new CategoryLegend(cfg);
    };
    /**
     * 创建连续图例
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    Legend.prototype.createContinuousLegend = function (geometry, attr, scale, legendOption) {
        var cfg = this.getContinuousCfg(geometry, attr, scale, omit(legendOption, ['value']));
        return new ContinuousLegend(cfg);
    };
    /**
     * 创建分类图例
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    Legend.prototype.createCategoryLegend = function (geometry, attr, scale, legendOption) {
        var cfg = this.getCategoryCfg(geometry, attr, scale, legendOption);
        return new CategoryLegend(cfg);
    };
    /**
     * 获得连续图例的配置
     * @param geometry
     * @param attr
     * @param scale
     * @param legendOption
     */
    Legend.prototype.getContinuousCfg = function (geometry, attr, scale, legendOption) {
        var ticks = scale.getTicks();
        var containMin = find(ticks, function (tick) { return tick.value === 0; });
        var containMax = find(ticks, function (tick) { return tick.value === 1; });
        var items = ticks.map(function (tick) {
            var value = tick.value, tickValue = tick.tickValue;
            var attrValue = attr.mapping(scale.invert(value)).join('');
            return {
                value: tickValue,
                attrValue: attrValue,
                color: attrValue,
                scaleValue: value,
            };
        });
        if (!containMin) {
            items.push({
                value: scale.min,
                attrValue: attr.mapping(scale.invert(0)).join(''),
                color: attr.mapping(scale.invert(0)).join(''),
                scaleValue: 0,
            });
        }
        if (!containMax) {
            items.push({
                value: scale.max,
                attrValue: attr.mapping(scale.invert(1)).join(''),
                color: attr.mapping(scale.invert(1)).join(''),
                scaleValue: 1,
            });
        }
        // 排序
        items.sort(function (a, b) { return a.value - b.value; });
        // 跟 attr 相关的配置
        // size color 区别的配置
        var attrLegendCfg = {
            min: head(items).value,
            max: last(items).value,
            colors: [],
            rail: {
                type: attr.type,
            },
            track: {},
        };
        if (attr.type === 'size') {
            attrLegendCfg.track = {
                style: {
                    // size 的选中前景色，对于 color，则直接使用 color 标识
                    // @ts-ignore
                    fill: attr.type === 'size' ? this.view.getTheme().defaultColor : undefined,
                },
            };
        }
        if (attr.type === 'color') {
            attrLegendCfg.colors = items.map(function (item) { return item.attrValue; });
        }
        var container = this.container;
        // if position is not set, use top as default
        var direction = getDirection(legendOption);
        var layout = getLegendLayout(direction);
        var title = get(legendOption, 'title');
        if (title) {
            title = deepMix({
                text: getName(scale),
            }, title);
        }
        // 基础配置，从当前数据中读到的配置
        attrLegendCfg.container = container;
        attrLegendCfg.layout = layout;
        attrLegendCfg.title = title;
        attrLegendCfg.animateOption = DEFAULT_ANIMATE_CFG;
        // @ts-ignore
        return this.mergeLegendCfg(attrLegendCfg, legendOption, 'continuous');
    };
    /**
     * 获取分类图例的配置项
     * @param geometry
     * @param attr
     * @param scale
     * @param custom
     * @param legendOption
     */
    Legend.prototype.getCategoryCfg = function (geometry, attr, scale, legendOption, custom) {
        var container = this.container;
        // if position is not set, use top as default
        var direction = get(legendOption, 'position', DIRECTION.BOTTOM);
        var legendTheme = getLegendThemeCfg(this.view.getTheme(), direction);
        // the default marker style
        var themeMarker = get(legendTheme, ['marker']);
        var userMarker = get(legendOption, 'marker');
        var layout = getLegendLayout(direction);
        var themePageNavigator = get(legendTheme, ['pageNavigator']);
        var userPageNavigator = get(legendOption, 'pageNavigator');
        var items = custom
            ? getCustomLegendItems(themeMarker, userMarker, legendOption.items)
            : getLegendItems(this.view, geometry, attr, themeMarker, userMarker);
        var title = get(legendOption, 'title');
        if (title) {
            title = deepMix({
                text: scale ? getName(scale) : '',
            }, title);
        }
        var maxWidthRatio = get(legendOption, 'maxWidthRatio');
        var maxHeightRatio = get(legendOption, 'maxHeightRatio');
        var baseCfg = this.getCategoryLegendSizeCfg(layout, maxWidthRatio, maxHeightRatio);
        baseCfg.container = container;
        baseCfg.layout = layout;
        baseCfg.items = items;
        baseCfg.title = title;
        baseCfg.animateOption = DEFAULT_ANIMATE_CFG;
        baseCfg.pageNavigator = deepMix({}, themePageNavigator, userPageNavigator);
        var categoryCfg = this.mergeLegendCfg(baseCfg, legendOption, direction);
        if (categoryCfg.reversed) {
            // 图例项需要逆序
            categoryCfg.items.reverse();
        }
        var maxItemWidth = get(categoryCfg, 'maxItemWidth');
        if (maxItemWidth && maxItemWidth <= 1) {
            // 转换成像素值
            categoryCfg.maxItemWidth = this.view.viewBBox.width * maxItemWidth;
        }
        return categoryCfg;
    };
    /**
     * get legend config, use option > suggestion > theme
     * @param baseCfg
     * @param legendOption
     * @param direction
     */
    Legend.prototype.mergeLegendCfg = function (baseCfg, legendOption, direction) {
        var position = direction.split('-')[0];
        var themeObject = getLegendThemeCfg(this.view.getTheme(), position);
        return deepMix({}, themeObject, baseCfg, legendOption);
    };
    /**
     * 生成 id
     * @param key
     */
    Legend.prototype.getId = function (key) {
        return "".concat(this.name, "-").concat(key);
    };
    /**
     * 根据 id 来获取组件
     * @param id
     */
    Legend.prototype.getComponentById = function (id) {
        return find(this.components, function (co) { return co.id === id; });
    };
    Legend.prototype.getCategoryLegendSizeCfg = function (layout, maxWidthRatio, maxHeightRatio) {
        if (maxWidthRatio === void 0) { maxWidthRatio = COMPONENT_MAX_VIEW_PERCENTAGE; }
        if (maxHeightRatio === void 0) { maxHeightRatio = COMPONENT_MAX_VIEW_PERCENTAGE; }
        var _a = this.view.viewBBox, vw = _a.width, vh = _a.height;
        // 目前 legend 的布局是以 viewBBox 为参照
        // const { width: cw, height: ch } = this.view.coordinateBBox;
        return layout === 'vertical'
            ? {
                maxWidth: vw * maxWidthRatio,
                maxHeight: vh,
            }
            : {
                maxWidth: vw,
                maxHeight: vh * maxHeightRatio,
            };
    };
    return Legend;
}(Controller));
export default Legend;
//# sourceMappingURL=legend.js.map