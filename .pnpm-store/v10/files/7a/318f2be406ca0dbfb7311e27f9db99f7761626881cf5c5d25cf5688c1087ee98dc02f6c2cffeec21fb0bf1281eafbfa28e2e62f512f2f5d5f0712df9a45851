import { __assign, __extends } from "tslib";
import { deepMix, each, get, isArray, isEmpty, isEqual, isFunction, isString } from '@antv/util';
// 暂未发包
// @ts-ignore
import { propagationDelegate } from '@antv/component';
import { doAnimate } from '../../animate';
import Base from '../../base';
import { getReplaceAttrs } from '../../util/graphics';
import { GEOMETRY_LIFE_CIRCLE } from '../../constant';
import { BACKGROUND_SHAPE } from '../shape/constant';
/**
 * Element 图形元素。
 * 定义：在 G2 中，我们会将数据通过图形语法映射成不同的图形，比如点图，数据集中的每条数据会对应一个点，柱状图每条数据对应一个柱子，线图则是一组数据对应一条折线，Element 即一条/一组数据对应的图形元素，它代表一条数据或者一个数据集，在图形层面，它可以是单个 Shape 也可以是多个 Shape，我们称之为图形元素。
 */
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element(cfg) {
        var _this = _super.call(this, cfg) || this;
        /** 保存 shape 对应的 label */
        _this.labelShape = [];
        // 存储当前开启的状态
        _this.states = [];
        var shapeFactory = cfg.shapeFactory, container = cfg.container, offscreenGroup = cfg.offscreenGroup, elementIndex = cfg.elementIndex, _a = cfg.visible, visible = _a === void 0 ? true : _a;
        _this.shapeFactory = shapeFactory;
        _this.container = container;
        _this.offscreenGroup = offscreenGroup;
        _this.visible = visible;
        _this.elementIndex = elementIndex;
        return _this;
    }
    /**
     * 绘制图形。
     * @param model 绘制数据。
     * @param isUpdate 可选，是否是更新发生后的绘制。
     */
    Element.prototype.draw = function (model, isUpdate) {
        if (isUpdate === void 0) { isUpdate = false; }
        this.model = model;
        this.data = model.data; // 存储原始数据
        this.shapeType = this.getShapeType(model);
        // 绘制图形
        this.drawShape(model, isUpdate);
        if (this.visible === false) {
            // 用户在初始化的时候声明 visible: false
            this.changeVisible(false);
        }
    };
    /**
     * 更新图形。
     * @param model 更新的绘制数据。
     */
    Element.prototype.update = function (model) {
        var _a = this, shapeFactory = _a.shapeFactory, shape = _a.shape;
        if (!shape) {
            return;
        }
        // 更新数据
        this.model = model;
        this.data = model.data;
        this.shapeType = this.getShapeType(model);
        // step 1: 更新 shape 携带的信息
        this.setShapeInfo(shape, model);
        // step 2: 使用虚拟 Group 重新绘制 shape，然后更新当前 shape
        var offscreenGroup = this.getOffscreenGroup();
        var newShape = shapeFactory.drawShape(this.shapeType, model, offscreenGroup);
        // @ts-ignore
        newShape.cfg.data = this.data;
        // @ts-ignore
        newShape.cfg.origin = model;
        // label 需要使用
        newShape.cfg.element = this;
        // step 3: 同步 shape 样式
        this.syncShapeStyle(shape, newShape, this.getStates(), this.getAnimateCfg('update'));
    };
    /**
     * 销毁 element 实例。
     */
    Element.prototype.destroy = function () {
        var _a = this, shapeFactory = _a.shapeFactory, shape = _a.shape;
        if (shape) {
            var animateCfg = this.getAnimateCfg('leave');
            if (animateCfg) {
                // 指定了动画配置则执行销毁动画
                doAnimate(shape, animateCfg, {
                    coordinate: shapeFactory.coordinate,
                    toAttrs: __assign({}, shape.attr()),
                });
            }
            else {
                // 否则直接销毁
                shape.remove(true);
            }
        }
        // reset
        this.states = [];
        this.shapeFactory = undefined;
        this.container = undefined;
        this.shape = undefined;
        this.animate = undefined;
        this.geometry = undefined;
        this.labelShape = [];
        this.model = undefined;
        this.data = undefined;
        this.offscreenGroup = undefined;
        this.statesStyle = undefined;
        _super.prototype.destroy.call(this);
    };
    /**
     * 显示或者隐藏 element。
     * @param visible 是否可见。
     */
    Element.prototype.changeVisible = function (visible) {
        _super.prototype.changeVisible.call(this, visible);
        if (visible) {
            if (this.shape) {
                this.shape.show();
            }
            if (this.labelShape) {
                this.labelShape.forEach(function (label) {
                    label.show();
                });
            }
        }
        else {
            if (this.shape) {
                this.shape.hide();
            }
            if (this.labelShape) {
                this.labelShape.forEach(function (label) {
                    label.hide();
                });
            }
        }
    };
    /**
     * 设置 Element 的状态。
     *
     * 目前 Element 开放三种状态：
     * 1. active
     * 2. selected
     * 3. inactive
     *
     * 这三种状态相互独立，可以进行叠加。
     *
     * 这三种状态的样式可在 [[Theme]] 主题中或者通过 `geometry.state()` 接口进行配置。
     *
     * ```ts
     * // 激活 active 状态
     * setState('active', true);
     * ```
     *
     * @param stateName 状态名
     * @param stateStatus 是否开启状态
     */
    Element.prototype.setState = function (stateName, stateStatus) {
        var _a = this, states = _a.states, shapeFactory = _a.shapeFactory, model = _a.model, shape = _a.shape, shapeType = _a.shapeType;
        var index = states.indexOf(stateName);
        if (stateStatus) {
            // 开启状态
            if (index > -1) {
                // 该状态已经开启，则返回
                return;
            }
            states.push(stateName);
            if (stateName === 'active' || stateName === 'selected') {
                shape === null || shape === void 0 ? void 0 : shape.toFront();
            }
        }
        else {
            if (index === -1) {
                // 关闭状态，但是状态未设置过
                return;
            }
            states.splice(index, 1);
            if (stateName === 'active' || stateName === 'selected') {
                var _b = this.geometry, sortZIndex = _b.sortZIndex, zIndexReversed = _b.zIndexReversed;
                var idx = zIndexReversed ? this.geometry.elements.length - this.elementIndex : this.elementIndex;
                sortZIndex ? shape.setZIndex(idx) : shape.set('zIndex', idx);
            }
        }
        // 使用虚拟 group 重新绘制 shape，然后对这个 shape 应用状态样式后，更新当前 shape。
        var offscreenShape = shapeFactory.drawShape(shapeType, model, this.getOffscreenGroup());
        if (states.length) {
            // 应用当前状态
            this.syncShapeStyle(shape, offscreenShape, states, null);
        }
        else {
            // 如果没有状态，则需要恢复至原始状态
            this.syncShapeStyle(shape, offscreenShape, ['reset'], null);
        }
        offscreenShape.remove(true); // 销毁，减少内存占用
        var eventObject = {
            state: stateName,
            stateStatus: stateStatus,
            element: this,
            target: this.container,
        };
        this.container.emit('statechange', eventObject);
        // @ts-ignore
        propagationDelegate(this.shape, 'statechange', eventObject);
    };
    /**
     * 清空状量态，恢复至初始状态。
     */
    Element.prototype.clearStates = function () {
        var _this = this;
        var states = this.states;
        each(states, function (state) {
            _this.setState(state, false);
        });
        this.states = [];
    };
    /**
     * 查询当前 Element 上是否已设置 `stateName` 对应的状态。
     * @param stateName 状态名称。
     * @returns true 表示存在，false 表示不存在。
     */
    Element.prototype.hasState = function (stateName) {
        return this.states.includes(stateName);
    };
    /**
     * 获取当前 Element 上所有的状态。
     * @returns 当前 Element 上所有的状态数组。
     */
    Element.prototype.getStates = function () {
        return this.states;
    };
    /**
     * 获取 Element 对应的原始数据。
     * @returns 原始数据。
     */
    Element.prototype.getData = function () {
        return this.data;
    };
    /**
     * 获取 Element 对应的图形绘制数据。
     * @returns 图形绘制数据。
     */
    Element.prototype.getModel = function () {
        return this.model;
    };
    /**
     * 返回 Element 元素整体的 bbox，包含文本及文本连线（有的话）。
     * @returns 整体包围盒。
     */
    Element.prototype.getBBox = function () {
        var _a = this, shape = _a.shape, labelShape = _a.labelShape;
        var bbox = {
            x: 0,
            y: 0,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            width: 0,
            height: 0,
        };
        if (shape) {
            bbox = shape.getCanvasBBox();
        }
        if (labelShape) {
            labelShape.forEach(function (label) {
                var labelBBox = label.getCanvasBBox();
                bbox.x = Math.min(labelBBox.x, bbox.x);
                bbox.y = Math.min(labelBBox.y, bbox.y);
                bbox.minX = Math.min(labelBBox.minX, bbox.minX);
                bbox.minY = Math.min(labelBBox.minY, bbox.minY);
                bbox.maxX = Math.max(labelBBox.maxX, bbox.maxX);
                bbox.maxY = Math.max(labelBBox.maxY, bbox.maxY);
            });
        }
        bbox.width = bbox.maxX - bbox.minX;
        bbox.height = bbox.maxY - bbox.minY;
        return bbox;
    };
    Element.prototype.getStatesStyle = function () {
        if (!this.statesStyle) {
            var _a = this, shapeType = _a.shapeType, geometry = _a.geometry, shapeFactory = _a.shapeFactory;
            var stateOption = geometry.stateOption;
            var defaultShapeType = shapeFactory.defaultShapeType;
            var stateTheme = shapeFactory.theme[shapeType] || shapeFactory.theme[defaultShapeType];
            this.statesStyle = deepMix({}, stateTheme, stateOption);
        }
        return this.statesStyle;
    };
    // 从主题中获取对应状态量的样式
    Element.prototype.getStateStyle = function (stateName, shapeKey) {
        var statesStyle = this.getStatesStyle();
        var stateCfg = get(statesStyle, [stateName, 'style'], {});
        var shapeStyle = stateCfg[shapeKey] || stateCfg;
        if (isFunction(shapeStyle)) {
            return shapeStyle(this);
        }
        return shapeStyle;
    };
    // 获取动画配置
    Element.prototype.getAnimateCfg = function (animateType) {
        var _this = this;
        var animate = this.animate;
        if (animate) {
            var cfg_1 = animate[animateType];
            if (cfg_1) {
                // 增加动画的回调函数，如果外部传入了，则先执行外部，然后发射 geometry 的 animate 事件
                return __assign(__assign({}, cfg_1), { callback: function () {
                        var _a;
                        isFunction(cfg_1.callback) && cfg_1.callback();
                        (_a = _this.geometry) === null || _a === void 0 ? void 0 : _a.emit(GEOMETRY_LIFE_CIRCLE.AFTER_DRAW_ANIMATE);
                    } });
            }
            return cfg_1;
        }
        return null;
    };
    // 绘制图形
    Element.prototype.drawShape = function (model, isUpdate) {
        var _a;
        if (isUpdate === void 0) { isUpdate = false; }
        var _b = this, shapeFactory = _b.shapeFactory, container = _b.container, shapeType = _b.shapeType;
        // 自定义 shape 有可能返回空 shape
        this.shape = shapeFactory.drawShape(shapeType, model, container);
        if (this.shape) {
            this.setShapeInfo(this.shape, model); // 存储绘图数据
            // @ts-ignore
            var name_1 = this.shape.cfg.name;
            // 附加 element 的 name, name 现在支持数组了，很好用了
            if (!name_1) {
                // 这个地方如果用户添加了 name, 则附加 name ，否则就添加自己的 name
                // @ts-ignore
                this.shape.cfg.name = ['element', this.shapeFactory.geometryType];
            }
            else if (isString(name_1)) {
                // @ts-ignore
                this.shape.cfg.name = ['element', name_1];
            }
            // 执行入场动画
            var animateType = isUpdate ? 'enter' : 'appear';
            var animateCfg = this.getAnimateCfg(animateType);
            if (animateCfg) {
                // 开始执行动画的生命周期
                (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.emit(GEOMETRY_LIFE_CIRCLE.BEFORE_DRAW_ANIMATE);
                doAnimate(this.shape, animateCfg, {
                    coordinate: shapeFactory.coordinate,
                    toAttrs: __assign({}, this.shape.attr()),
                });
            }
        }
    };
    // 获取虚拟 Group
    Element.prototype.getOffscreenGroup = function () {
        if (!this.offscreenGroup) {
            var GroupCtor = this.container.getGroupBase(); // 获取分组的构造函数
            this.offscreenGroup = new GroupCtor({});
        }
        return this.offscreenGroup;
    };
    // 设置 shape 上需要携带的信息
    Element.prototype.setShapeInfo = function (shape, data) {
        var _this = this;
        // @ts-ignore
        shape.cfg.origin = data;
        // @ts-ignore
        shape.cfg.element = this;
        if (shape.isGroup()) {
            var children = shape.get('children');
            children.forEach(function (child) {
                _this.setShapeInfo(child, data);
            });
        }
    };
    // 更新当前 shape 的样式
    Element.prototype.syncShapeStyle = function (sourceShape, targetShape, states, animateCfg, index) {
        var _this = this;
        var _a;
        if (states === void 0) { states = []; }
        if (index === void 0) { index = 0; }
        if (!sourceShape || !targetShape) {
            return;
        }
        // 所有的 shape 都需要同步 clip
        var clip = sourceShape.get('clipShape');
        var newClip = targetShape.get('clipShape');
        this.syncShapeStyle(clip, newClip, states, animateCfg);
        if (sourceShape.isGroup()) {
            var children = sourceShape.get('children');
            var newChildren = targetShape.get('children');
            for (var i = 0; i < children.length; i++) {
                this.syncShapeStyle(children[i], newChildren[i], states, animateCfg, index + i);
            }
        }
        else {
            if (!isEmpty(states) && !isEqual(states, ['reset'])) {
                var name_2 = sourceShape.get('name');
                if (isArray(name_2)) {
                    // 会附加 element 的 name
                    name_2 = name_2[1];
                }
                each(states, function (state) {
                    // background shape 不进行状态样式设置
                    if (targetShape.get('name') !== BACKGROUND_SHAPE) {
                        var style = _this.getStateStyle(state, name_2 || index); // 如果用户没有设置 name，则默认根据索引值
                        targetShape.attr(style);
                    }
                });
            }
            var newAttrs = getReplaceAttrs(sourceShape, targetShape);
            if (this.animate) {
                if (animateCfg) {
                    (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.emit(GEOMETRY_LIFE_CIRCLE.BEFORE_DRAW_ANIMATE);
                    // 需要进行动画
                    doAnimate(sourceShape, animateCfg, {
                        coordinate: this.shapeFactory.coordinate,
                        toAttrs: newAttrs,
                        shapeModel: this.model,
                    });
                }
                else if (!isEmpty(states)) {
                    sourceShape.stopAnimate();
                    sourceShape.animate(newAttrs, {
                        duration: 300,
                    });
                }
                else {
                    sourceShape.attr(newAttrs);
                }
            }
            else {
                sourceShape.attr(newAttrs);
            }
        }
    };
    Element.prototype.getShapeType = function (model) {
        var shape = get(model, 'shape');
        return isArray(shape) ? shape[0] : shape;
    };
    return Element;
}(Base));
export default Element;
//# sourceMappingURL=index.js.map