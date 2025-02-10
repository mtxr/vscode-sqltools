import { __assign, __extends, __values } from "tslib";
import { deepMix, find, get, isEqual, isFunction, mix, isString, isBoolean, flatten, isArray } from '@antv/util';
import { Crosshair, HtmlTooltip } from '../../dependents';
import { getAngleByPoint, getDistanceToCenter, getCoordinateClipCfg } from '../../util/coordinate';
import { polarToCartesian } from '../../util/graphics';
import { findItemsFromView } from '../../util/tooltip';
import { BBox } from '../../util/bbox';
import { Controller } from './base';
import Event from '../event';
// Filter duplicates, use `name`, `color`, `value` and `title` property values as condition
function uniq(items) {
    var uniqItems = [];
    var _loop_1 = function (index) {
        var item = items[index];
        var result = find(uniqItems, function (subItem) {
            return (subItem.color === item.color &&
                subItem.name === item.name &&
                subItem.value === item.value &&
                subItem.title === item.title);
        });
        if (!result) {
            uniqItems.push(item);
        }
    };
    for (var index = 0; index < items.length; index++) {
        _loop_1(index);
    }
    return uniqItems;
}
/** @ignore */
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isLocked = false;
        return _this;
    }
    Object.defineProperty(Tooltip.prototype, "name", {
        get: function () {
            return 'tooltip';
        },
        enumerable: false,
        configurable: true
    });
    Tooltip.prototype.init = function () { };
    Tooltip.prototype.isVisible = function () {
        var option = this.view.getOptions().tooltip;
        return option !== false;
    };
    Tooltip.prototype.render = function () { };
    /**
     * Shows tooltip
     * @param point
     */
    Tooltip.prototype.showTooltip = function (point) {
        this.point = point;
        if (!this.isVisible()) {
            // 如果设置 tooltip(false) 则始终不显示
            return;
        }
        var view = this.view;
        var items = this.getTooltipItems(point);
        if (!items.length) {
            // 无内容则不展示，同时 tooltip 需要隐藏
            this.hideTooltip();
            return;
        }
        var title = this.getTitle(items);
        var dataPoint = {
            x: items[0].x,
            y: items[0].y,
        }; // 数据点位置
        view.emit('tooltip:show', Event.fromData(view, 'tooltip:show', __assign({ items: items, title: title }, point)));
        var cfg = this.getTooltipCfg();
        var follow = cfg.follow, showMarkers = cfg.showMarkers, showCrosshairs = cfg.showCrosshairs, showContent = cfg.showContent, marker = cfg.marker;
        var lastItems = this.items;
        var lastTitle = this.title;
        if (!isEqual(lastTitle, title) || !isEqual(lastItems, items)) {
            // 内容发生变化了更新 tooltip
            view.emit('tooltip:change', Event.fromData(view, 'tooltip:change', __assign({ items: items, title: title }, point)));
            if (isFunction(showContent) ? showContent(items) : showContent) {
                // 展示 tooltip 内容框才渲染 tooltip
                if (!this.tooltip) {
                    // 延迟生成
                    this.renderTooltip();
                }
                this.tooltip.update(mix({}, cfg, {
                    items: this.getItemsAfterProcess(items),
                    title: title,
                }, follow ? point : {}));
                this.tooltip.show();
            }
            if (showMarkers) {
                // 展示 tooltipMarkers，tooltipMarkers 跟随数据
                this.renderTooltipMarkers(items, marker);
            }
        }
        else {
            // 内容未发生变化，则更新位置
            if (this.tooltip && follow) {
                this.tooltip.update(point);
                this.tooltip.show(); // tooltip 有可能被隐藏，需要保证显示状态
            }
            if (this.tooltipMarkersGroup) {
                this.tooltipMarkersGroup.show();
            }
        }
        this.items = items;
        this.title = title;
        if (showCrosshairs) {
            // 展示 tooltip 辅助线
            var isCrosshairsFollowCursor = get(cfg, ['crosshairs', 'follow'], false); // 辅助线是否要跟随鼠标
            this.renderCrosshairs(isCrosshairsFollowCursor ? point : dataPoint, cfg);
        }
    };
    Tooltip.prototype.hideTooltip = function () {
        var follow = this.getTooltipCfg().follow;
        if (!follow) {
            this.point = null;
            return;
        }
        // hide the tooltipMarkers
        var tooltipMarkersGroup = this.tooltipMarkersGroup;
        if (tooltipMarkersGroup) {
            tooltipMarkersGroup.hide();
        }
        // hide crosshairs
        var xCrosshair = this.xCrosshair;
        var yCrosshair = this.yCrosshair;
        if (xCrosshair) {
            xCrosshair.hide();
        }
        if (yCrosshair) {
            yCrosshair.hide();
        }
        var tooltip = this.tooltip;
        if (tooltip) {
            tooltip.hide();
        }
        this.view.emit('tooltip:hide', Event.fromData(this.view, 'tooltip:hide', {}));
        this.point = null;
    };
    /**
     * lockTooltip
     */
    Tooltip.prototype.lockTooltip = function () {
        this.isLocked = true;
        if (this.tooltip) {
            // tooltip contianer 可捕获事件
            this.tooltip.setCapture(true);
        }
    };
    /**
     * unlockTooltip
     */
    Tooltip.prototype.unlockTooltip = function () {
        this.isLocked = false;
        var cfg = this.getTooltipCfg();
        if (this.tooltip) {
            // 重置 capture 属性
            this.tooltip.setCapture(cfg.capture);
        }
    };
    /**
     * isTooltipLocked
     */
    Tooltip.prototype.isTooltipLocked = function () {
        return this.isLocked;
    };
    Tooltip.prototype.clear = function () {
        var _a = this, tooltip = _a.tooltip, xCrosshair = _a.xCrosshair, yCrosshair = _a.yCrosshair, tooltipMarkersGroup = _a.tooltipMarkersGroup;
        if (tooltip) {
            tooltip.hide();
            tooltip.clear();
        }
        if (xCrosshair) {
            xCrosshair.clear();
        }
        if (yCrosshair) {
            yCrosshair.clear();
        }
        if (tooltipMarkersGroup) {
            tooltipMarkersGroup.clear();
        }
        // 如果 customContent 不为空，就重新生成 tooltip
        if (tooltip === null || tooltip === void 0 ? void 0 : tooltip.get('customContent')) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
        // title 和 items 需要清空, 否则 tooltip 内容会出现置空的情况
        // 即：需要走进 !isEqual(lastTitle, title) || !isEqual(lastItems, items) 的逻辑，更新 tooltip 的内容
        this.title = null;
        this.items = null;
    };
    Tooltip.prototype.destroy = function () {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
        if (this.xCrosshair) {
            this.xCrosshair.destroy();
        }
        if (this.yCrosshair) {
            this.yCrosshair.destroy();
        }
        if (this.guideGroup) {
            this.guideGroup.remove(true);
        }
        this.reset();
    };
    Tooltip.prototype.reset = function () {
        this.items = null;
        this.title = null;
        this.tooltipMarkersGroup = null;
        this.tooltipCrosshairsGroup = null;
        this.xCrosshair = null;
        this.yCrosshair = null;
        this.tooltip = null;
        this.guideGroup = null;
        this.isLocked = false;
        this.point = null;
    };
    Tooltip.prototype.changeVisible = function (visible) {
        if (this.visible === visible) {
            return;
        }
        var _a = this, tooltip = _a.tooltip, tooltipMarkersGroup = _a.tooltipMarkersGroup, xCrosshair = _a.xCrosshair, yCrosshair = _a.yCrosshair;
        if (visible) {
            if (tooltip) {
                tooltip.show();
            }
            if (tooltipMarkersGroup) {
                tooltipMarkersGroup.show();
            }
            if (xCrosshair) {
                xCrosshair.show();
            }
            if (yCrosshair) {
                yCrosshair.show();
            }
        }
        else {
            if (tooltip) {
                tooltip.hide();
            }
            if (tooltipMarkersGroup) {
                tooltipMarkersGroup.hide();
            }
            if (xCrosshair) {
                xCrosshair.hide();
            }
            if (yCrosshair) {
                yCrosshair.hide();
            }
        }
        this.visible = visible;
    };
    Tooltip.prototype.getTooltipItems = function (point) {
        var e_1, _a, e_2, _b, e_3, _c;
        var items = this.findItemsFromView(this.view, point);
        if (items.length) {
            // 三层
            items = flatten(items);
            try {
                for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                    var itemArr = items_1_1.value;
                    try {
                        for (var itemArr_1 = (e_2 = void 0, __values(itemArr)), itemArr_1_1 = itemArr_1.next(); !itemArr_1_1.done; itemArr_1_1 = itemArr_1.next()) {
                            var item = itemArr_1_1.value;
                            var _d = item.mappingData, x = _d.x, y = _d.y;
                            item.x = isArray(x) ? x[x.length - 1] : x;
                            item.y = isArray(y) ? y[y.length - 1] : y;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (itemArr_1_1 && !itemArr_1_1.done && (_b = itemArr_1.return)) _b.call(itemArr_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var shared = this.getTooltipCfg().shared;
            // shared: false 代表只显示当前拾取到的 shape 的数据，但是一个 view 会有多个 Geometry，所以有可能会拾取到多个 shape
            if (shared === false && items.length > 1) {
                var snapItem = items[0];
                var min = Math.abs(point.y - snapItem[0].y);
                try {
                    for (var items_2 = __values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                        var aItem = items_2_1.value;
                        var yDistance = Math.abs(point.y - aItem[0].y);
                        if (yDistance <= min) {
                            snapItem = aItem;
                            min = yDistance;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (items_2_1 && !items_2_1.done && (_c = items_2.return)) _c.call(items_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                items = [snapItem];
            }
            return uniq(flatten(items));
        }
        return [];
    };
    Tooltip.prototype.layout = function () { };
    Tooltip.prototype.update = function () {
        if (this.point) {
            this.showTooltip(this.point);
        }
        if (this.tooltip) {
            // #2279 修复resize之后tooltip越界的问题
            // 确保tooltip已经创建的情况下
            var canvas = this.view.getCanvas();
            // TODO 逍为 tooltip 的区域不应该是 canvas，而应该是整个 特别是在图比较小的时候
            // 更新 region
            this.tooltip.set('region', {
                start: { x: 0, y: 0 },
                end: { x: canvas.get('width'), y: canvas.get('height') },
            });
        }
    };
    /**
     * 当前鼠标点是在 enter tooltip 中
     * @param point
     */
    Tooltip.prototype.isCursorEntered = function (point) {
        // 是可捕获的，并且点在 tooltip dom 上
        if (this.tooltip) {
            var el = this.tooltip.getContainer();
            var capture = this.tooltip.get('capture');
            if (el && capture) {
                var _a = el.getBoundingClientRect(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                return new BBox(x, y, width, height).isPointIn(point);
            }
        }
        return false;
    };
    // 获取 tooltip 配置，因为用户可能会通过 view.tooltip() 重新配置 tooltip，所以就不做缓存，每次直接读取
    Tooltip.prototype.getTooltipCfg = function () {
        var view = this.view;
        var option = view.getOptions().tooltip;
        var processOption = this.processCustomContent(option);
        var theme = view.getTheme();
        var defaultCfg = get(theme, ['components', 'tooltip'], {});
        var enterable = get(processOption, 'enterable', defaultCfg.enterable);
        return deepMix({}, defaultCfg, processOption, {
            capture: enterable || this.isLocked ? true : false,
        });
    };
    // process customContent
    Tooltip.prototype.processCustomContent = function (option) {
        if (isBoolean(option) || !get(option, 'customContent')) {
            return option;
        }
        var currentCustomContent = option.customContent;
        var customContent = function (title, items) {
            var content = currentCustomContent(title, items) || '';
            return isString(content) ? '<div class="g2-tooltip">' + content + '</div>' : content;
        };
        return __assign(__assign({}, option), { customContent: customContent });
    };
    Tooltip.prototype.getTitle = function (items) {
        var title = items[0].title || items[0].name;
        this.title = title;
        return title;
    };
    Tooltip.prototype.renderTooltip = function () {
        var canvas = this.view.getCanvas();
        var region = {
            start: { x: 0, y: 0 },
            end: { x: canvas.get('width'), y: canvas.get('height') },
        };
        var cfg = this.getTooltipCfg();
        var tooltip = new HtmlTooltip(__assign(__assign({ parent: canvas.get('el').parentNode, region: region }, cfg), { visible: false, crosshairs: null }));
        tooltip.init();
        this.tooltip = tooltip;
    };
    Tooltip.prototype.renderTooltipMarkers = function (items, marker) {
        var e_4, _a;
        var tooltipMarkersGroup = this.getTooltipMarkersGroup();
        var rootView = this.view.getRootView();
        var limitInPlot = rootView.limitInPlot;
        try {
            for (var items_3 = __values(items), items_3_1 = items_3.next(); !items_3_1.done; items_3_1 = items_3.next()) {
                var item = items_3_1.value;
                var x = item.x, y = item.y;
                // 有裁剪就剪切
                if (limitInPlot || (tooltipMarkersGroup === null || tooltipMarkersGroup === void 0 ? void 0 : tooltipMarkersGroup.getClip())) {
                    var _b = getCoordinateClipCfg(rootView.getCoordinate()), type = _b.type, attrs_1 = _b.attrs;
                    tooltipMarkersGroup === null || tooltipMarkersGroup === void 0 ? void 0 : tooltipMarkersGroup.setClip({
                        type: type,
                        attrs: attrs_1,
                    });
                }
                else {
                    // 清除已有的 clip
                    tooltipMarkersGroup === null || tooltipMarkersGroup === void 0 ? void 0 : tooltipMarkersGroup.setClip(undefined);
                }
                var theme = this.view.getTheme();
                var markerDefaultCfg = get(theme, ['components', 'tooltip', 'marker'], {});
                var attrs = __assign(__assign({ fill: item.color, symbol: 'circle', shadowColor: item.color }, (isFunction(marker) ? __assign(__assign({}, markerDefaultCfg), marker(item)) : marker)), { x: x, y: y });
                tooltipMarkersGroup.addShape('marker', {
                    attrs: attrs,
                });
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (items_3_1 && !items_3_1.done && (_a = items_3.return)) _a.call(items_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    Tooltip.prototype.renderCrosshairs = function (point, cfg) {
        var crosshairsType = get(cfg, ['crosshairs', 'type'], 'x'); // 默认展示 x 轴上的辅助线
        if (crosshairsType === 'x') {
            if (this.yCrosshair) {
                this.yCrosshair.hide();
            }
            this.renderXCrosshairs(point, cfg);
        }
        else if (crosshairsType === 'y') {
            if (this.xCrosshair) {
                this.xCrosshair.hide();
            }
            this.renderYCrosshairs(point, cfg);
        }
        else if (crosshairsType === 'xy') {
            this.renderXCrosshairs(point, cfg);
            this.renderYCrosshairs(point, cfg);
        }
    };
    // 渲染 x 轴上的 tooltip 辅助线
    Tooltip.prototype.renderXCrosshairs = function (point, tooltipCfg) {
        var coordinate = this.getViewWithGeometry(this.view).getCoordinate();
        var start;
        var end;
        if (coordinate.isRect) {
            if (coordinate.isTransposed) {
                start = {
                    x: coordinate.start.x,
                    y: point.y,
                };
                end = {
                    x: coordinate.end.x,
                    y: point.y,
                };
            }
            else {
                start = {
                    x: point.x,
                    y: coordinate.end.y,
                };
                end = {
                    x: point.x,
                    y: coordinate.start.y,
                };
            }
        }
        else {
            // 极坐标下 x 轴上的 crosshairs 表现为半径
            var angle = getAngleByPoint(coordinate, point);
            var center = coordinate.getCenter();
            var radius = coordinate.getRadius();
            end = polarToCartesian(center.x, center.y, radius, angle);
            start = center;
        }
        var cfg = deepMix({
            start: start,
            end: end,
            container: this.getTooltipCrosshairsGroup(),
        }, get(tooltipCfg, 'crosshairs', {}), this.getCrosshairsText('x', point, tooltipCfg));
        delete cfg.type; // 与 Crosshairs 组件的 type 冲突故删除
        var xCrosshair = this.xCrosshair;
        if (xCrosshair) {
            xCrosshair.update(cfg);
        }
        else {
            xCrosshair = new Crosshair.Line(cfg);
            xCrosshair.init();
        }
        xCrosshair.render();
        xCrosshair.show();
        this.xCrosshair = xCrosshair;
    };
    // 渲染 y 轴上的辅助线
    Tooltip.prototype.renderYCrosshairs = function (point, tooltipCfg) {
        var coordinate = this.getViewWithGeometry(this.view).getCoordinate();
        var cfg;
        var type;
        if (coordinate.isRect) {
            var start = void 0;
            var end = void 0;
            if (coordinate.isTransposed) {
                start = {
                    x: point.x,
                    y: coordinate.end.y,
                };
                end = {
                    x: point.x,
                    y: coordinate.start.y,
                };
            }
            else {
                start = {
                    x: coordinate.start.x,
                    y: point.y,
                };
                end = {
                    x: coordinate.end.x,
                    y: point.y,
                };
            }
            cfg = {
                start: start,
                end: end,
            };
            type = 'Line';
        }
        else {
            // 极坐标下 y 轴上的 crosshairs 表现为圆弧
            cfg = {
                center: coordinate.getCenter(),
                // @ts-ignore
                radius: getDistanceToCenter(coordinate, point),
                startAngle: coordinate.startAngle,
                endAngle: coordinate.endAngle,
            };
            type = 'Circle';
        }
        cfg = deepMix({
            container: this.getTooltipCrosshairsGroup(),
        }, cfg, get(tooltipCfg, 'crosshairs', {}), this.getCrosshairsText('y', point, tooltipCfg));
        delete cfg.type; // 与 Crosshairs 组件的 type 冲突故删除
        var yCrosshair = this.yCrosshair;
        if (yCrosshair) {
            // 如果坐标系发生直角坐标系与极坐标的切换操作
            if ((coordinate.isRect && yCrosshair.get('type') === 'circle') ||
                (!coordinate.isRect && yCrosshair.get('type') === 'line')) {
                yCrosshair = new Crosshair[type](cfg);
                yCrosshair.init();
            }
            else {
                yCrosshair.update(cfg);
            }
        }
        else {
            yCrosshair = new Crosshair[type](cfg);
            yCrosshair.init();
        }
        yCrosshair.render();
        yCrosshair.show();
        this.yCrosshair = yCrosshair;
    };
    Tooltip.prototype.getCrosshairsText = function (type, point, tooltipCfg) {
        var textCfg = get(tooltipCfg, ['crosshairs', 'text']);
        var follow = get(tooltipCfg, ['crosshairs', 'follow']);
        var items = this.items;
        if (textCfg) {
            var view = this.getViewWithGeometry(this.view);
            // 需要展示文本
            var firstItem = items[0];
            var xScale = view.getXScale();
            var yScale = view.getYScales()[0];
            var xValue = void 0;
            var yValue = void 0;
            if (follow) {
                // 如果需要跟随鼠标移动，就需要将当前鼠标坐标点转换为对应的数值
                var invertPoint = this.view.getCoordinate().invert(point);
                xValue = xScale.invert(invertPoint.x); // 转换为原始值
                yValue = yScale.invert(invertPoint.y); // 转换为原始值
            }
            else {
                xValue = firstItem.data[xScale.field];
                yValue = firstItem.data[yScale.field];
            }
            var content = type === 'x' ? xValue : yValue;
            if (isFunction(textCfg)) {
                textCfg = textCfg(type, content, items, point);
            }
            else {
                textCfg.content = content;
            }
            return {
                text: textCfg,
            };
        }
    };
    // 获取存储 tooltipMarkers 和 crosshairs 的容器
    Tooltip.prototype.getGuideGroup = function () {
        if (!this.guideGroup) {
            var foregroundGroup = this.view.foregroundGroup;
            this.guideGroup = foregroundGroup.addGroup({
                name: 'tooltipGuide',
                capture: false,
            });
        }
        return this.guideGroup;
    };
    // 获取 tooltipMarkers 存储的容器
    Tooltip.prototype.getTooltipMarkersGroup = function () {
        var tooltipMarkersGroup = this.tooltipMarkersGroup;
        if (tooltipMarkersGroup && !tooltipMarkersGroup.destroyed) {
            tooltipMarkersGroup.clear();
            tooltipMarkersGroup.show();
        }
        else {
            tooltipMarkersGroup = this.getGuideGroup().addGroup({
                name: 'tooltipMarkersGroup',
            });
            tooltipMarkersGroup.toFront();
            this.tooltipMarkersGroup = tooltipMarkersGroup;
        }
        return tooltipMarkersGroup;
    };
    // 获取 tooltip crosshairs 存储的容器
    Tooltip.prototype.getTooltipCrosshairsGroup = function () {
        var tooltipCrosshairsGroup = this.tooltipCrosshairsGroup;
        if (!tooltipCrosshairsGroup) {
            tooltipCrosshairsGroup = this.getGuideGroup().addGroup({
                name: 'tooltipCrosshairsGroup',
                capture: false,
            });
            tooltipCrosshairsGroup.toBack();
            this.tooltipCrosshairsGroup = tooltipCrosshairsGroup;
        }
        return tooltipCrosshairsGroup;
    };
    Tooltip.prototype.findItemsFromView = function (view, point) {
        var e_5, _a;
        if (view.getOptions().tooltip === false) {
            // 如果 view 关闭了 tooltip
            return [];
        }
        var tooltipCfg = this.getTooltipCfg();
        var result = findItemsFromView(view, point, tooltipCfg);
        try {
            // 递归查找，并合并结果
            for (var _b = __values(view.views), _c = _b.next(); !_c.done; _c = _b.next()) {
                var childView = _c.value;
                result = result.concat(this.findItemsFromView(childView, point));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    };
    // FIXME: hack 方法
    // 因为 tooltip 的交互是挂载在 Chart 上，所以当chart 上没有绘制 Geometry 的时候，就查找不到数据，并且绘图区域同子 View 的区域不同
    Tooltip.prototype.getViewWithGeometry = function (view) {
        var _this = this;
        if (view.geometries.length) {
            return view;
        }
        return find(view.views, function (childView) { return _this.getViewWithGeometry(childView); });
    };
    /**
     * 根据用户配置的 items 配置，来进行用户自定义的处理，并返回最终的 items
     * 默认不做任何处理
     */
    Tooltip.prototype.getItemsAfterProcess = function (originalItems) {
        var customItems = this.getTooltipCfg().customItems;
        var fn = customItems ? customItems : function (v) { return v; };
        return fn(originalItems);
    };
    return Tooltip;
}(Controller));
export default Tooltip;
//# sourceMappingURL=tooltip.js.map