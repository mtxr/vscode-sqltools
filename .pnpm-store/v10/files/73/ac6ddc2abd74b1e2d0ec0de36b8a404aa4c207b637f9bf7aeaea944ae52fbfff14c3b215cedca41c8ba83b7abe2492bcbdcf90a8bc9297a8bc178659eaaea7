"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var dependents_1 = require("../../dependents");
var animate_1 = require("../../animate/");
var constant_1 = require("../../constant");
var coordinate_1 = require("../../util/coordinate");
var helper_1 = require("../../util/helper");
var annotation_1 = require("../../util/annotation");
var base_1 = require("./base");
/** 需要在图形绘制完成后才渲染的辅助组件类型列表 */
var ANNOTATIONS_AFTER_RENDER = ['regionFilter', 'shape'];
/**
 * Annotation controller, 主要作用:
 * 1. 创建 Annotation: line、text、arc ...
 * 2. 生命周期: init、layout、render、clear、destroy
 */
var Annotation = /** @class */ (function (_super) {
    tslib_1.__extends(Annotation, _super);
    function Annotation(view) {
        var _this = _super.call(this, view) || this;
        /* 组件更新的 cache，组件配置 object : 组件 */
        _this.cache = new Map();
        _this.foregroundContainer = _this.view.getLayer(constant_1.LAYER.FORE).addGroup();
        _this.backgroundContainer = _this.view.getLayer(constant_1.LAYER.BG).addGroup();
        _this.option = [];
        return _this;
    }
    Object.defineProperty(Annotation.prototype, "name", {
        get: function () {
            return 'annotation';
        },
        enumerable: false,
        configurable: true
    });
    Annotation.prototype.init = function () { };
    /**
     * 因为 annotation 需要依赖坐标系信息，所以 render 阶段为空方法，实际的创建逻辑都在 layout 中
     */
    Annotation.prototype.layout = function () {
        this.update();
    };
    // 因为 Annotation 不参与布局，但是渲染的位置依赖于坐标系，所以可以将绘制阶段延迟到 layout() 进行
    Annotation.prototype.render = function () { };
    /**
     * 更新
     */
    Annotation.prototype.update = function () {
        var _this = this;
        // 1. 先处理需要在图形渲染之后的辅助组件 需要在 Geometry 完成之后，拿到图形信息
        this.onAfterRender(function () {
            var updated = new Map();
            // 先看是否有 regionFilter/shape 要更新
            (0, util_1.each)(_this.option, function (option) {
                if ((0, util_1.includes)(ANNOTATIONS_AFTER_RENDER, option.type)) {
                    var co = _this.updateOrCreate(option);
                    // 存储已经处理过的
                    if (co) {
                        updated.set(_this.getCacheKey(option), co);
                    }
                }
            });
            // 处理完成之后，更新 cache
            // 处理完成之后，销毁删除的
            _this.cache = _this.syncCache(updated);
        });
        // 2. 处理非 regionFilter
        var updateCache = new Map();
        (0, util_1.each)(this.option, function (option) {
            if (!(0, util_1.includes)(ANNOTATIONS_AFTER_RENDER, option.type)) {
                var co = _this.updateOrCreate(option);
                // 存储已经处理过的
                if (co) {
                    updateCache.set(_this.getCacheKey(option), co);
                }
            }
        });
        this.cache = this.syncCache(updateCache);
    };
    /**
     * 清空
     * @param includeOption 是否清空 option 配置项
     */
    Annotation.prototype.clear = function (includeOption) {
        if (includeOption === void 0) { includeOption = false; }
        _super.prototype.clear.call(this);
        this.clearComponents();
        this.foregroundContainer.clear();
        this.backgroundContainer.clear();
        // clear all option
        if (includeOption) {
            this.option = [];
        }
    };
    Annotation.prototype.destroy = function () {
        this.clear(true);
        this.foregroundContainer.remove(true);
        this.backgroundContainer.remove(true);
    };
    /**
     * 复写基类的方法
     */
    Annotation.prototype.getComponents = function () {
        var co = [];
        this.cache.forEach(function (value) {
            co.push(value);
        });
        return co;
    };
    /**
     * 清除当前的组件
     */
    Annotation.prototype.clearComponents = function () {
        this.getComponents().forEach(function (co) {
            co.component.destroy();
        });
        this.cache.clear();
    };
    /**
     * region filter 比较特殊的渲染时机
     * @param doWhat
     */
    Annotation.prototype.onAfterRender = function (doWhat) {
        var done = false;
        if (this.view.getOptions().animate) {
            this.view.geometries.forEach(function (g) {
                // 如果 geometry 开启，则监听
                if (g.animateOption) {
                    g.once(constant_1.GEOMETRY_LIFE_CIRCLE.AFTER_DRAW_ANIMATE, function () {
                        doWhat();
                    });
                    done = true;
                }
            });
        }
        if (!done) {
            this.view.getRootView().once(constant_1.VIEW_LIFE_CIRCLE.AFTER_RENDER, function () {
                doWhat();
            });
        }
    };
    Annotation.prototype.createAnnotation = function (option) {
        var type = option.type;
        var Ctor = dependents_1.Annotation[(0, util_1.upperFirst)(type)];
        if (Ctor) {
            var theme = this.getAnnotationTheme(type);
            var cfg = this.getAnnotationCfg(type, option, theme);
            // 不创建
            if (!cfg) {
                return null;
            }
            var annotation = new Ctor(cfg);
            return {
                component: annotation,
                layer: this.isTop(cfg) ? constant_1.LAYER.FORE : constant_1.LAYER.BG,
                direction: constant_1.DIRECTION.NONE,
                type: constant_1.COMPONENT_TYPE.ANNOTATION,
                extra: option,
            };
        }
    };
    // APIs for creating annotation component
    Annotation.prototype.annotation = function (option) {
        this.option.push(option);
    };
    /**
     * 创建 Arc
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.arc = function (option) {
        this.annotation(tslib_1.__assign({ type: 'arc' }, option));
        return this;
    };
    /**
     * 创建 image
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.image = function (option) {
        this.annotation(tslib_1.__assign({ type: 'image' }, option));
        return this;
    };
    /**
     * 创建 Line
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.line = function (option) {
        this.annotation(tslib_1.__assign({ type: 'line' }, option));
        return this;
    };
    /**
     * 创建 Region
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.region = function (option) {
        this.annotation(tslib_1.__assign({ type: 'region' }, option));
        return this;
    };
    /**
     * 创建 Text
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.text = function (option) {
        this.annotation(tslib_1.__assign({ type: 'text' }, option));
        return this;
    };
    /**
     * 创建 DataMarker
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.dataMarker = function (option) {
        this.annotation(tslib_1.__assign({ type: 'dataMarker' }, option));
        return this;
    };
    /**
     * 创建 DataRegion
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.dataRegion = function (option) {
        this.annotation(tslib_1.__assign({ type: 'dataRegion' }, option));
    };
    /**
     * 创建 RegionFilter
     * @param option
     * @returns AnnotationController
     */
    Annotation.prototype.regionFilter = function (option) {
        this.annotation(tslib_1.__assign({ type: 'regionFilter' }, option));
    };
    /**
     * 创建 ShapeAnnotation
     * @param option
     */
    Annotation.prototype.shape = function (option) {
        this.annotation(tslib_1.__assign({ type: 'shape' }, option));
    };
    /**
     * 创建 HtmlAnnotation
     * @param option
     */
    Annotation.prototype.html = function (option) {
        this.annotation(tslib_1.__assign({ type: 'html' }, option));
    };
    // end API
    /**
     * parse the point position to [x, y]
     * @param p Position
     * @returns { x, y }
     */
    Annotation.prototype.parsePosition = function (p) {
        var e_1, _a;
        var xScale = this.view.getXScale();
        // 转成 object
        var yScales = this.view.getScalesByDim('y');
        var position = (0, util_1.isFunction)(p) ? p.call(null, xScale, yScales) : p;
        var x = 0;
        var y = 0;
        // 入参是 [24, 24] 这类时
        if ((0, util_1.isArray)(position)) {
            var _b = tslib_1.__read(position, 2), xPos = _b[0], yPos = _b[1];
            // 如果数据格式是 ['50%', '50%'] 的格式
            // fix: 原始数据中可能会包含 'xxx5%xxx' 这样的数据，需要判断下 https://github.com/antvis/f2/issues/590
            // @ts-ignore
            if ((0, util_1.isString)(xPos) && xPos.indexOf('%') !== -1 && !isNaN(xPos.slice(0, -1))) {
                return this.parsePercentPosition(position);
            }
            x = (0, annotation_1.getNormalizedValue)(xPos, xScale);
            y = (0, annotation_1.getNormalizedValue)(yPos, Object.values(yScales)[0]);
        }
        else if (!(0, util_1.isNil)(position)) {
            try {
                // 入参是 object 结构，数据点
                for (var _c = tslib_1.__values((0, util_1.keys)(position)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var key = _d.value;
                    var value = position[key];
                    if (key === xScale.field) {
                        x = (0, annotation_1.getNormalizedValue)(value, xScale);
                    }
                    if (yScales[key]) {
                        y = (0, annotation_1.getNormalizedValue)(value, yScales[key]);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (isNaN(x) || isNaN(y)) {
            return null;
        }
        return this.view.getCoordinate().convert({ x: x, y: y });
    };
    /**
     * parse all the points between start and end
     * @param start
     * @param end
     * @return Point[]
     */
    Annotation.prototype.getRegionPoints = function (start, end) {
        var _this = this;
        var xScale = this.view.getXScale();
        var yScales = this.view.getScalesByDim('y');
        var yScale = Object.values(yScales)[0];
        var xField = xScale.field;
        var viewData = this.view.getData();
        var startXValue = (0, util_1.isArray)(start) ? start[0] : start[xField];
        var endXValue = (0, util_1.isArray)(end) ? end[0] : end[xField];
        var arr = [];
        var startIndex;
        (0, util_1.each)(viewData, function (item, idx) {
            if (item[xField] === startXValue) {
                startIndex = idx;
            }
            if (idx >= startIndex) {
                var point = _this.parsePosition([item[xField], item[yScale.field]]);
                if (point) {
                    arr.push(point);
                }
            }
            if (item[xField] === endXValue) {
                return false;
            }
        });
        return arr;
    };
    /**
     * parse percent position
     * @param position
     */
    Annotation.prototype.parsePercentPosition = function (position) {
        var xPercent = parseFloat(position[0]) / 100;
        var yPercent = parseFloat(position[1]) / 100;
        var coordinate = this.view.getCoordinate();
        var start = coordinate.start, end = coordinate.end;
        var topLeft = {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
        };
        var x = coordinate.getWidth() * xPercent + topLeft.x;
        var y = coordinate.getHeight() * yPercent + topLeft.y;
        return { x: x, y: y };
    };
    /**
     * get coordinate bbox
     */
    Annotation.prototype.getCoordinateBBox = function () {
        var coordinate = this.view.getCoordinate();
        var start = coordinate.start, end = coordinate.end;
        var width = coordinate.getWidth();
        var height = coordinate.getHeight();
        var topLeft = {
            x: Math.min(start.x, end.x),
            y: Math.min(start.y, end.y),
        };
        return {
            x: topLeft.x,
            y: topLeft.y,
            minX: topLeft.x,
            minY: topLeft.y,
            maxX: topLeft.x + width,
            maxY: topLeft.y + height,
            width: width,
            height: height,
        };
    };
    /**
     * get annotation component config by different type
     * @param type
     * @param option 用户的配置
     * @param theme
     */
    Annotation.prototype.getAnnotationCfg = function (type, option, theme) {
        var _this = this;
        var coordinate = this.view.getCoordinate();
        var canvas = this.view.getCanvas();
        var o = {};
        if ((0, util_1.isNil)(option)) {
            return null;
        }
        var start = option.start, end = option.end, position = option.position;
        var sp = this.parsePosition(start);
        var ep = this.parsePosition(end);
        var textPoint = this.parsePosition(position);
        if (['arc', 'image', 'line', 'region', 'regionFilter'].includes(type) && (!sp || !ep)) {
            return null;
        }
        else if (['text', 'dataMarker', 'html'].includes(type) && !textPoint) {
            return null;
        }
        if (type === 'arc') {
            var _a = option, start_1 = _a.start, end_1 = _a.end, rest = tslib_1.__rest(_a, ["start", "end"]);
            var startAngle = (0, coordinate_1.getAngleByPoint)(coordinate, sp);
            var endAngle = (0, coordinate_1.getAngleByPoint)(coordinate, ep);
            if (startAngle > endAngle) {
                endAngle = Math.PI * 2 + endAngle;
            }
            o = tslib_1.__assign(tslib_1.__assign({}, rest), { center: coordinate.getCenter(), radius: (0, coordinate_1.getDistanceToCenter)(coordinate, sp), startAngle: startAngle, endAngle: endAngle });
        }
        else if (type === 'image') {
            var _b = option, start_2 = _b.start, end_2 = _b.end, rest = tslib_1.__rest(_b, ["start", "end"]);
            o = tslib_1.__assign(tslib_1.__assign({}, rest), { start: sp, end: ep, src: option.src });
        }
        else if (type === 'line') {
            var _c = option, start_3 = _c.start, end_3 = _c.end, rest = tslib_1.__rest(_c, ["start", "end"]);
            o = tslib_1.__assign(tslib_1.__assign({}, rest), { start: sp, end: ep, text: (0, util_1.get)(option, 'text', null) });
        }
        else if (type === 'region') {
            var _d = option, start_4 = _d.start, end_4 = _d.end, rest = tslib_1.__rest(_d, ["start", "end"]);
            o = tslib_1.__assign(tslib_1.__assign({}, rest), { start: sp, end: ep });
        }
        else if (type === 'text') {
            var filteredData = this.view.getData();
            var _e = option, position_1 = _e.position, content = _e.content, rest = tslib_1.__rest(_e, ["position", "content"]);
            var textContent = content;
            if ((0, util_1.isFunction)(content)) {
                textContent = content(filteredData);
            }
            o = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, textPoint), rest), { content: textContent });
        }
        else if (type === 'dataMarker') {
            var _f = option, position_2 = _f.position, point = _f.point, line = _f.line, text = _f.text, autoAdjust = _f.autoAdjust, direction = _f.direction, rest = tslib_1.__rest(_f, ["position", "point", "line", "text", "autoAdjust", "direction"]);
            o = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, rest), textPoint), { coordinateBBox: this.getCoordinateBBox(), point: point, line: line, text: text, autoAdjust: autoAdjust, direction: direction });
        }
        else if (type === 'dataRegion') {
            var _g = option, start_5 = _g.start, end_5 = _g.end, region = _g.region, text = _g.text, lineLength = _g.lineLength, rest = tslib_1.__rest(_g, ["start", "end", "region", "text", "lineLength"]);
            o = tslib_1.__assign(tslib_1.__assign({}, rest), { points: this.getRegionPoints(start_5, end_5), region: region, text: text, lineLength: lineLength });
        }
        else if (type === 'regionFilter') {
            var _h = option, start_6 = _h.start, end_6 = _h.end, apply_1 = _h.apply, color = _h.color, rest = tslib_1.__rest(_h, ["start", "end", "apply", "color"]);
            var geometries = this.view.geometries;
            var shapes_1 = [];
            var addShapes_1 = function (item) {
                if (!item) {
                    return;
                }
                if (item.isGroup()) {
                    item.getChildren().forEach(function (child) { return addShapes_1(child); });
                }
                else {
                    shapes_1.push(item);
                }
            };
            (0, util_1.each)(geometries, function (geom) {
                if (apply_1) {
                    if ((0, util_1.contains)(apply_1, geom.type)) {
                        (0, util_1.each)(geom.elements, function (elem) {
                            addShapes_1(elem.shape);
                        });
                    }
                }
                else {
                    (0, util_1.each)(geom.elements, function (elem) {
                        addShapes_1(elem.shape);
                    });
                }
            });
            o = tslib_1.__assign(tslib_1.__assign({}, rest), { color: color, shapes: shapes_1, start: sp, end: ep });
        }
        else if (type === 'shape') {
            var _j = option, render_1 = _j.render, restOptions = tslib_1.__rest(_j, ["render"]);
            var wrappedRender = function (container) {
                if ((0, util_1.isFunction)(option.render)) {
                    return render_1(container, _this.view, { parsePosition: _this.parsePosition.bind(_this) });
                }
            };
            o = tslib_1.__assign(tslib_1.__assign({}, restOptions), { render: wrappedRender });
        }
        else if (type === 'html') {
            var _k = option, html_1 = _k.html, position_3 = _k.position, restOptions = tslib_1.__rest(_k, ["html", "position"]);
            var wrappedHtml = function (container) {
                if ((0, util_1.isFunction)(html_1)) {
                    return html_1(container, _this.view);
                }
                return html_1;
            };
            o = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, restOptions), textPoint), { 
                // html 组件需要指定 parent
                parent: canvas.get('el').parentNode, html: wrappedHtml });
        }
        // 合并主题，用户配置优先级高于默认主题
        var cfg = (0, util_1.deepMix)({}, theme, tslib_1.__assign(tslib_1.__assign({}, o), { top: option.top, style: option.style, offsetX: option.offsetX, offsetY: option.offsetY }));
        if (type !== 'html') {
            // html 类型不使用 G container
            cfg.container = this.getComponentContainer(cfg);
        }
        cfg.animate = this.view.getOptions().animate && cfg.animate && (0, util_1.get)(option, 'animate', cfg.animate); // 如果 view 关闭动画，则不执行
        cfg.animateOption = (0, util_1.deepMix)({}, animate_1.DEFAULT_ANIMATE_CFG, cfg.animateOption, option.animateOption);
        return cfg;
    };
    /**
     * is annotation render on top
     * @param option
     * @return whethe on top
     */
    Annotation.prototype.isTop = function (option) {
        return (0, util_1.get)(option, 'top', true);
    };
    /**
     * get the container by option.top
     * default is on top
     * @param option
     * @returns the container
     */
    Annotation.prototype.getComponentContainer = function (option) {
        return this.isTop(option) ? this.foregroundContainer : this.backgroundContainer;
    };
    Annotation.prototype.getAnnotationTheme = function (type) {
        return (0, util_1.get)(this.view.getTheme(), ['components', 'annotation', type], {});
    };
    /**
     * 创建或者更新 annotation
     * @param option
     */
    Annotation.prototype.updateOrCreate = function (option) {
        // 拿到缓存的内容
        var co = this.cache.get(this.getCacheKey(option));
        // 存在则更新，不存在在创建
        if (co) {
            var type = option.type;
            var theme = this.getAnnotationTheme(type);
            var cfg = this.getAnnotationCfg(type, option, theme);
            // 忽略掉一些配置
            if (cfg) {
                (0, helper_1.omit)(cfg, ['container']);
            }
            co.component.update(tslib_1.__assign(tslib_1.__assign({}, (cfg || {})), { visible: !!cfg }));
            // 对于 regionFilter/shape，因为生命周期的原因，需要额外 render
            if ((0, util_1.includes)(ANNOTATIONS_AFTER_RENDER, option.type)) {
                co.component.render();
            }
        }
        else {
            // 不存在，创建
            co = this.createAnnotation(option);
            if (co) {
                co.component.init();
                // Note：regionFilter/shape 特殊处理，regionFilter/shape 需要取到 Geometry 中的 Shape，需要在 view render 之后处理
                // 其他组件使用外层的统一 render 逻辑
                if ((0, util_1.includes)(ANNOTATIONS_AFTER_RENDER, option.type)) {
                    co.component.render();
                }
            }
        }
        return co;
    };
    /**
     * 更新缓存，以及销毁组件
     * @param updated 更新或者创建的组件
     */
    Annotation.prototype.syncCache = function (updated) {
        var _this = this;
        var newCache = new Map(this.cache); // clone 一份
        // 将 update 更新到 cache
        updated.forEach(function (co, key) {
            newCache.set(key, co);
        });
        // 另外和 options 进行对比，删除
        newCache.forEach(function (co, key) {
            // option 中已经找不到，那么就是删除的
            if (!(0, util_1.find)(_this.option, function (option) {
                return key === _this.getCacheKey(option);
            })) {
                co.component.destroy();
                newCache.delete(key);
            }
        });
        return newCache;
    };
    /**
     * 获得缓存组件的 key
     * @param option
     */
    Annotation.prototype.getCacheKey = function (option) {
        // 如果存在 id，则使用 id string，否则直接使用 option 引用作为 key
        return option;
        // 后续扩展 id 用
        // const id = get(option, 'id');
        // return id ? id : option;
    };
    return Annotation;
}(base_1.Controller));
exports.default = Annotation;
//# sourceMappingURL=annotation.js.map