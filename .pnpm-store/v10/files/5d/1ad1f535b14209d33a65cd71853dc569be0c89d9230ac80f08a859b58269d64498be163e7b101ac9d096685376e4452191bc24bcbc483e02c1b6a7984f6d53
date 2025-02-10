import { __extends } from "tslib";
import { each, isEqual, isFunction, isNumber, isObject, isArray, noop, mix, upperFirst, uniqueId } from '@antv/util';
import { ext } from '@antv/matrix-util';
import { removeFromArray, isParent } from '../util/util';
import { multiplyMatrix, multiplyVec2, invert } from '../util/matrix';
import Base from './base';
var transform = ext.transform;
var MATRIX = 'matrix';
var CLONE_CFGS = ['zIndex', 'capture', 'visible', 'type'];
// 可以在 toAttrs 中设置，但不属于绘图属性的字段
var RESERVED_PORPS = ['repeat'];
var DELEGATION_SPLIT = ':';
var WILDCARD = '*';
// 需要考虑数组嵌套数组的场景
// 数组嵌套对象的场景不考虑
function _cloneArrayAttr(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (isArray(arr[i])) {
            result.push([].concat(arr[i]));
        }
        else {
            result.push(arr[i]);
        }
    }
    return result;
}
function getFormatFromAttrs(toAttrs, shape) {
    var fromAttrs = {};
    var attrs = shape.attrs;
    for (var k in toAttrs) {
        fromAttrs[k] = attrs[k];
    }
    return fromAttrs;
}
function getFormatToAttrs(props, shape) {
    var toAttrs = {};
    var attrs = shape.attr();
    each(props, function (v, k) {
        if (RESERVED_PORPS.indexOf(k) === -1 && !isEqual(attrs[k], v)) {
            toAttrs[k] = v;
        }
    });
    return toAttrs;
}
function checkExistedAttrs(animations, animation) {
    if (animation.onFrame) {
        return animations;
    }
    var startTime = animation.startTime, delay = animation.delay, duration = animation.duration;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    each(animations, function (item) {
        // 后一个动画开始执行的时间 < 前一个动画的结束时间 && 后一个动画的执行时间 > 前一个动画的延迟
        if (startTime + delay < item.startTime + item.delay + item.duration && duration > item.delay) {
            each(animation.toAttrs, function (v, k) {
                if (hasOwnProperty.call(item.toAttrs, k)) {
                    delete item.toAttrs[k];
                    delete item.fromAttrs[k];
                }
            });
        }
    });
    return animations;
}
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element(cfg) {
        var _this = _super.call(this, cfg) || this;
        /**
         * @protected
         * 图形属性
         * @type {ShapeAttrs}
         */
        _this.attrs = {};
        var attrs = _this.getDefaultAttrs();
        mix(attrs, cfg.attrs);
        _this.attrs = attrs;
        _this.initAttrs(attrs);
        _this.initAnimate(); // 初始化动画
        return _this;
    }
    // override
    Element.prototype.getDefaultCfg = function () {
        return {
            visible: true,
            capture: true,
            zIndex: 0,
        };
    };
    /**
     * @protected
     * 获取默认的属相
     */
    Element.prototype.getDefaultAttrs = function () {
        return {
            matrix: this.getDefaultMatrix(),
            opacity: 1,
        };
    };
    /**
     * @protected
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    Element.prototype.onCanvasChange = function (changeType) { };
    /**
     * @protected
     * 初始化属性，有些属性需要加工
     * @param {object} attrs 属性值
     */
    Element.prototype.initAttrs = function (attrs) { };
    /**
     * @protected
     * 初始化动画
     */
    Element.prototype.initAnimate = function () {
        this.set('animable', true);
        this.set('animating', false);
    };
    Element.prototype.isGroup = function () {
        return false;
    };
    Element.prototype.getParent = function () {
        return this.get('parent');
    };
    Element.prototype.getCanvas = function () {
        return this.get('canvas');
    };
    Element.prototype.attr = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var name = args[0], value = args[1];
        if (!name)
            return this.attrs;
        if (isObject(name)) {
            for (var k in name) {
                this.setAttr(k, name[k]);
            }
            this.afterAttrsChange(name);
            return this;
        }
        if (args.length === 2) {
            this.setAttr(name, value);
            this.afterAttrsChange((_a = {},
                _a[name] = value,
                _a));
            return this;
        }
        return this.attrs[name];
    };
    // 是否被裁剪，被裁剪则不显示，不参与拾取
    Element.prototype.isClipped = function (refX, refY) {
        var clip = this.getClip();
        return clip && !clip.isHit(refX, refY);
    };
    /**
     * 内部设置属性值的接口
     * @param {string} name 属性名
     * @param {any} value 属性值
     */
    Element.prototype.setAttr = function (name, value) {
        var originValue = this.attrs[name];
        if (originValue !== value) {
            this.attrs[name] = value;
            this.onAttrChange(name, value, originValue);
        }
    };
    /**
     * @protected
     * 属性值发生改变
     * @param {string} name 属性名
     * @param {any} value 属性值
     * @param {any} originValue 属性值
     */
    Element.prototype.onAttrChange = function (name, value, originValue) {
        if (name === 'matrix') {
            this.set('totalMatrix', null);
        }
    };
    /**
     * 属性更改后需要做的事情
     * @protected
     */
    Element.prototype.afterAttrsChange = function (targetAttrs) {
        if (this.cfg.isClipShape) {
            var applyTo = this.cfg.applyTo;
            if (applyTo) {
                applyTo.onCanvasChange('clip');
            }
        }
        else {
            this.onCanvasChange('attr');
        }
    };
    Element.prototype.show = function () {
        // 不是高频操作直接使用 set
        this.set('visible', true);
        this.onCanvasChange('show');
        return this;
    };
    Element.prototype.hide = function () {
        // 不是高频操作直接使用 set
        this.set('visible', false);
        this.onCanvasChange('hide');
        return this;
    };
    Element.prototype.setZIndex = function (zIndex) {
        this.set('zIndex', zIndex);
        var parent = this.getParent();
        if (parent) {
            // 改变 zIndex 不应该立即触发渲染 (调用 onCanvasChange('zIndex'))，需要经过 sort 再触发
            parent.sort();
        }
        return this;
    };
    Element.prototype.toFront = function () {
        var parent = this.getParent();
        if (!parent) {
            return;
        }
        var children = parent.getChildren();
        var el = this.get('el');
        var index = children.indexOf(this);
        children.splice(index, 1);
        children.push(this);
        this.onCanvasChange('zIndex');
    };
    Element.prototype.toBack = function () {
        var parent = this.getParent();
        if (!parent) {
            return;
        }
        var children = parent.getChildren();
        var el = this.get('el');
        var index = children.indexOf(this);
        children.splice(index, 1);
        children.unshift(this);
        this.onCanvasChange('zIndex');
    };
    Element.prototype.remove = function (destroy) {
        if (destroy === void 0) { destroy = true; }
        var parent = this.getParent();
        if (parent) {
            removeFromArray(parent.getChildren(), this);
            if (!parent.get('clearing')) {
                // 如果父元素正在清理，当前元素不触发 remove
                this.onCanvasChange('remove');
            }
        }
        else {
            this.onCanvasChange('remove');
        }
        if (destroy) {
            this.destroy();
        }
    };
    Element.prototype.resetMatrix = function () {
        this.attr(MATRIX, this.getDefaultMatrix());
        this.onCanvasChange('matrix');
    };
    Element.prototype.getMatrix = function () {
        return this.attr(MATRIX);
    };
    Element.prototype.setMatrix = function (m) {
        this.attr(MATRIX, m);
        this.onCanvasChange('matrix');
    };
    // 获取总的 matrix
    Element.prototype.getTotalMatrix = function () {
        var totalMatrix = this.cfg.totalMatrix;
        if (!totalMatrix) {
            var currentMatrix = this.attr('matrix');
            var parentMatrix = this.cfg.parentMatrix;
            if (parentMatrix && currentMatrix) {
                totalMatrix = multiplyMatrix(parentMatrix, currentMatrix);
            }
            else {
                totalMatrix = currentMatrix || parentMatrix;
            }
            this.set('totalMatrix', totalMatrix);
        }
        return totalMatrix;
    };
    // 上层分组设置 matrix
    Element.prototype.applyMatrix = function (matrix) {
        var currentMatrix = this.attr('matrix');
        var totalMatrix = null;
        if (matrix && currentMatrix) {
            totalMatrix = multiplyMatrix(matrix, currentMatrix);
        }
        else {
            totalMatrix = currentMatrix || matrix;
        }
        this.set('totalMatrix', totalMatrix);
        this.set('parentMatrix', matrix);
    };
    /**
     * @protected
     * 获取默认的矩阵
     * @returns {number[]|null} 默认的矩阵
     */
    Element.prototype.getDefaultMatrix = function () {
        return null;
    };
    // 将向量应用设置的矩阵
    Element.prototype.applyToMatrix = function (v) {
        var matrix = this.attr('matrix');
        if (matrix) {
            return multiplyVec2(matrix, v);
        }
        return v;
    };
    // 根据设置的矩阵，将向量转换相对于图形/分组的位置
    Element.prototype.invertFromMatrix = function (v) {
        var matrix = this.attr('matrix');
        if (matrix) {
            var invertMatrix = invert(matrix);
            if (invertMatrix) {
                return multiplyVec2(invertMatrix, v);
            }
        }
        return v;
    };
    // 设置 clip
    Element.prototype.setClip = function (clipCfg) {
        var canvas = this.getCanvas();
        // 应该只设置当前元素的 clip，不应该去修改 clip 本身，方便 clip 被复用
        // TODO: setClip 的传参既 shape 配置，也支持 shape 对象
        // const preShape = this.get('clipShape');
        // if (preShape) {
        //   // 将之前的 clipShape 销毁
        //   preShape.destroy();
        // }
        var clipShape = null;
        // 如果配置项为 null，则不移除 clipShape
        if (clipCfg) {
            var ShapeBase = this.getShapeBase();
            var shapeType = upperFirst(clipCfg.type);
            var Cons = ShapeBase[shapeType];
            if (Cons) {
                clipShape = new Cons({
                    type: clipCfg.type,
                    isClipShape: true,
                    applyTo: this,
                    attrs: clipCfg.attrs,
                    canvas: canvas,
                });
            }
        }
        this.set('clipShape', clipShape);
        this.onCanvasChange('clip');
        return clipShape;
    };
    Element.prototype.getClip = function () {
        // 高频率调用的地方直接使用 this.cfg.xxx
        var clipShape = this.cfg.clipShape;
        // 未设置时返回 Null，保证一致性
        if (!clipShape) {
            return null;
        }
        return clipShape;
    };
    Element.prototype.clone = function () {
        var _this = this;
        var originAttrs = this.attrs;
        var attrs = {};
        each(originAttrs, function (i, k) {
            if (isArray(originAttrs[k])) {
                attrs[k] = _cloneArrayAttr(originAttrs[k]);
            }
            else {
                attrs[k] = originAttrs[k];
            }
        });
        var cons = this.constructor;
        // @ts-ignore
        var clone = new cons({ attrs: attrs });
        each(CLONE_CFGS, function (cfgName) {
            clone.set(cfgName, _this.get(cfgName));
        });
        return clone;
    };
    Element.prototype.destroy = function () {
        var destroyed = this.destroyed;
        if (destroyed) {
            return;
        }
        this.attrs = {};
        _super.prototype.destroy.call(this);
        // this.onCanvasChange('destroy');
    };
    /**
     * 是否处于动画暂停状态
     * @return {boolean} 是否处于动画暂停状态
     */
    Element.prototype.isAnimatePaused = function () {
        return this.get('_pause').isPaused;
    };
    /**
     * 执行动画，支持多种函数签名
     * 1. animate(toAttrs: ElementAttrs, duration: number, easing?: string, callback?: () => void, delay?: number)
     * 2. animate(onFrame: OnFrame, duration: number, easing?: string, callback?: () => void, delay?: number)
     * 3. animate(toAttrs: ElementAttrs, cfg: AnimateCfg)
     * 4. animate(onFrame: OnFrame, cfg: AnimateCfg)
     * 各个参数的含义为:
     *   toAttrs  动画最终状态
     *   onFrame  自定义帧动画函数
     *   duration 动画执行时间
     *   easing   动画缓动效果
     *   callback 动画执行后的回调
     *   delay    动画延迟时间
     */
    Element.prototype.animate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.get('timeline') && !this.get('canvas')) {
            return;
        }
        this.set('animating', true);
        var timeline = this.get('timeline');
        if (!timeline) {
            timeline = this.get('canvas').get('timeline');
            this.set('timeline', timeline);
        }
        var animations = this.get('animations') || [];
        // 初始化 tick
        if (!timeline.timer) {
            timeline.initTimer();
        }
        var toAttrs = args[0], duration = args[1], _a = args[2], easing = _a === void 0 ? 'easeLinear' : _a, _b = args[3], callback = _b === void 0 ? noop : _b, _c = args[4], delay = _c === void 0 ? 0 : _c;
        var onFrame;
        var repeat;
        var pauseCallback;
        var resumeCallback;
        var animateCfg;
        // 第二个参数，既可以是动画最终状态 toAttrs，也可以是自定义帧动画函数 onFrame
        if (isFunction(toAttrs)) {
            onFrame = toAttrs;
            toAttrs = {};
        }
        else if (isObject(toAttrs) && toAttrs.onFrame) {
            // 兼容 3.0 中的写法，onFrame 和 repeat 可在 toAttrs 中设置
            onFrame = toAttrs.onFrame;
            repeat = toAttrs.repeat;
        }
        // 第二个参数，既可以是执行时间 duration，也可以是动画参数 animateCfg
        if (isObject(duration)) {
            animateCfg = duration;
            duration = animateCfg.duration;
            easing = animateCfg.easing || 'easeLinear';
            delay = animateCfg.delay || 0;
            // animateCfg 中的设置优先级更高
            repeat = animateCfg.repeat || repeat || false;
            callback = animateCfg.callback || noop;
            pauseCallback = animateCfg.pauseCallback || noop;
            resumeCallback = animateCfg.resumeCallback || noop;
        }
        else {
            // 第四个参数，既可以是回调函数 callback，也可以是延迟时间 delay
            if (isNumber(callback)) {
                delay = callback;
                callback = null;
            }
            // 第三个参数，既可以是缓动参数 easing，也可以是回调函数 callback
            if (isFunction(easing)) {
                callback = easing;
                easing = 'easeLinear';
            }
            else {
                easing = easing || 'easeLinear';
            }
        }
        var formatToAttrs = getFormatToAttrs(toAttrs, this);
        var animation = {
            fromAttrs: getFormatFromAttrs(formatToAttrs, this),
            toAttrs: formatToAttrs,
            duration: duration,
            easing: easing,
            repeat: repeat,
            callback: callback,
            pauseCallback: pauseCallback,
            resumeCallback: resumeCallback,
            delay: delay,
            startTime: timeline.getTime(),
            id: uniqueId(),
            onFrame: onFrame,
            pathFormatted: false,
        };
        // 如果动画元素队列中已经有这个图形了
        if (animations.length > 0) {
            // 先检查是否需要合并属性。若有相同的动画，将该属性从前一个动画中删除,直接用后一个动画中
            animations = checkExistedAttrs(animations, animation);
        }
        else {
            // 否则将图形添加到动画元素队列
            timeline.addAnimator(this);
        }
        animations.push(animation);
        this.set('animations', animations);
        this.set('_pause', { isPaused: false });
    };
    /**
     * 停止动画
     * @param {boolean} toEnd 是否到动画的最终状态
     */
    Element.prototype.stopAnimate = function (toEnd) {
        var _this = this;
        if (toEnd === void 0) { toEnd = true; }
        var animations = this.get('animations');
        each(animations, function (animation) {
            // 将动画执行到最后一帧
            if (toEnd) {
                if (animation.onFrame) {
                    _this.attr(animation.onFrame(1));
                }
                else {
                    _this.attr(animation.toAttrs);
                }
            }
            if (animation.callback) {
                // 动画停止时的回调
                animation.callback();
            }
        });
        this.set('animating', false);
        this.set('animations', []);
    };
    /**
     * 暂停动画
     */
    Element.prototype.pauseAnimate = function () {
        var timeline = this.get('timeline');
        var animations = this.get('animations');
        var pauseTime = timeline.getTime();
        each(animations, function (animation) {
            animation._paused = true;
            animation._pauseTime = pauseTime;
            if (animation.pauseCallback) {
                // 动画暂停时的回调
                animation.pauseCallback();
            }
        });
        // 记录下是在什么时候暂停的
        this.set('_pause', {
            isPaused: true,
            pauseTime: pauseTime,
        });
        return this;
    };
    /**
     * 恢复动画
     */
    Element.prototype.resumeAnimate = function () {
        var timeline = this.get('timeline');
        var current = timeline.getTime();
        var animations = this.get('animations');
        var pauseTime = this.get('_pause').pauseTime;
        // 之后更新属性需要计算动画已经执行的时长，如果暂停了，就把初始时间调后
        each(animations, function (animation) {
            animation.startTime = animation.startTime + (current - pauseTime);
            animation._paused = false;
            animation._pauseTime = null;
            if (animation.resumeCallback) {
                animation.resumeCallback();
            }
        });
        this.set('_pause', {
            isPaused: false,
        });
        this.set('animations', animations);
        return this;
    };
    /**
     * 触发委托事件
     * @param  {string}     type 事件类型
     * @param  {GraphEvent} eventObj 事件对象
     */
    Element.prototype.emitDelegation = function (type, eventObj) {
        var _this = this;
        var paths = eventObj.propagationPath;
        var events = this.getEvents();
        var relativeShape;
        if (type === 'mouseenter') {
            relativeShape = eventObj.fromShape;
        }
        else if (type === 'mouseleave') {
            relativeShape = eventObj.toShape;
        }
        var _loop_1 = function (i) {
            var element = paths[i];
            // 暂定跟 name 绑定
            var name_1 = element.get('name');
            if (name_1) {
                // 第一个 mouseenter 和 mouseleave 的停止即可，因为后面的都是前面的 Parent
                if (
                // 只有 element 是 Group 或者 Canvas 的时候，才需要判断 isParent
                (element.isGroup() || (element.isCanvas && element.isCanvas())) &&
                    relativeShape &&
                    isParent(element, relativeShape)) {
                    return "break";
                }
                if (isArray(name_1)) {
                    each(name_1, function (subName) {
                        _this.emitDelegateEvent(element, subName, eventObj);
                    });
                }
                else {
                    this_1.emitDelegateEvent(element, name_1, eventObj);
                }
            }
        };
        var this_1 = this;
        // 至少有一个对象，且第一个对象为 shape
        for (var i = 0; i < paths.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
    };
    Element.prototype.emitDelegateEvent = function (element, name, eventObj) {
        var events = this.getEvents();
        // 事件委托的形式 name:type
        var eventName = name + DELEGATION_SPLIT + eventObj.type;
        if (events[eventName] || events[WILDCARD]) {
            // 对于通配符 *，事件名称 = 委托事件名称
            eventObj.name = eventName;
            eventObj.currentTarget = element;
            eventObj.delegateTarget = this;
            // 将委托事件的监听对象 delegateObject 挂载到事件对象上
            eventObj.delegateObject = element.get('delegateObject');
            this.emit(eventName, eventObj);
        }
    };
    /**
     * 移动元素
     * @param {number} translateX 水平移动距离
     * @param {number} translateY 垂直移动距离
     * @return {IElement} 元素
     */
    Element.prototype.translate = function (translateX, translateY) {
        if (translateX === void 0) { translateX = 0; }
        if (translateY === void 0) { translateY = 0; }
        var matrix = this.getMatrix();
        var newMatrix = transform(matrix, [['t', translateX, translateY]]);
        this.setMatrix(newMatrix);
        return this;
    };
    /**
     * 移动元素到目标位置
     * @param {number} targetX 目标位置的水平坐标
     * @param {number} targetX 目标位置的垂直坐标
     * @return {IElement} 元素
     */
    Element.prototype.move = function (targetX, targetY) {
        var x = this.attr('x') || 0;
        var y = this.attr('y') || 0;
        this.translate(targetX - x, targetY - y);
        return this;
    };
    /**
     * 移动元素到目标位置，等价于 move 方法。由于 moveTo 的语义性更强，因此在文档中推荐使用 moveTo 方法
     * @param {number} targetX 目标位置的 x 轴坐标
     * @param {number} targetY 目标位置的 y 轴坐标
     * @return {IElement} 元素
     */
    Element.prototype.moveTo = function (targetX, targetY) {
        return this.move(targetX, targetY);
    };
    /**
     * 缩放元素
     * @param {number} ratioX 水平缩放比例
     * @param {number} ratioY 垂直缩放比例
     * @return {IElement} 元素
     */
    Element.prototype.scale = function (ratioX, ratioY) {
        var matrix = this.getMatrix();
        var newMatrix = transform(matrix, [['s', ratioX, ratioY || ratioX]]);
        this.setMatrix(newMatrix);
        return this;
    };
    /**
     * 以画布左上角 (0, 0) 为中心旋转元素
     * @param {number} radian 旋转角度(弧度值)
     * @return {IElement} 元素
     */
    Element.prototype.rotate = function (radian) {
        var matrix = this.getMatrix();
        var newMatrix = transform(matrix, [['r', radian]]);
        this.setMatrix(newMatrix);
        return this;
    };
    /**
     * 以起始点为中心旋转元素
     * @param {number} radian 旋转角度(弧度值)
     * @return {IElement} 元素
     */
    Element.prototype.rotateAtStart = function (rotate) {
        var _a = this.attr(), x = _a.x, y = _a.y;
        var matrix = this.getMatrix();
        var newMatrix = transform(matrix, [
            ['t', -x, -y],
            ['r', rotate],
            ['t', x, y],
        ]);
        this.setMatrix(newMatrix);
        return this;
    };
    /**
     * 以任意点 (x, y) 为中心旋转元素
     * @param {number} radian 旋转角度(弧度值)
     * @return {IElement} 元素
     */
    Element.prototype.rotateAtPoint = function (x, y, rotate) {
        var matrix = this.getMatrix();
        var newMatrix = transform(matrix, [
            ['t', -x, -y],
            ['r', rotate],
            ['t', x, y],
        ]);
        this.setMatrix(newMatrix);
        return this;
    };
    return Element;
}(Base));
export default Element;
//# sourceMappingURL=element.js.map