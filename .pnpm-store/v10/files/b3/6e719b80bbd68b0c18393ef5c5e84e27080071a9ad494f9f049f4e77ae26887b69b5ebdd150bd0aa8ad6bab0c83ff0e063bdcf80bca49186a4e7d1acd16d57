import { isEqual, isNumber, isFunction } from '@antv/util';
import * as d3Timer from 'd3-timer';
import { interpolate, interpolateArray } from 'd3-interpolate'; // 目前整体动画只需要数值和数组的差值计算
import { getEasing } from './register';
import * as PathUtil from '../util/path';
import { isColorProp, isGradientColor } from '../util/color';
var IDENTITY_MATRIX = [1, 0, 0, 0, 1, 0, 0, 0, 1];
/**
 * 使用 ratio 进行插值计算来更新属性
 * @param {IElement}  shape    元素
 * @param {Animation} animation 动画
 * @param {number}    ratio    比例
 * @return {boolean}  动画是否执行完成
 */
function _update(shape, animation, ratio) {
    var cProps = {}; // 此刻属性
    var fromAttrs = animation.fromAttrs, toAttrs = animation.toAttrs;
    if (shape.destroyed) {
        return;
    }
    var interf; //  差值函数
    for (var k in toAttrs) {
        if (!isEqual(fromAttrs[k], toAttrs[k])) {
            if (k === 'path') {
                var toPath = toAttrs[k];
                var fromPath = fromAttrs[k];
                if (toPath.length > fromPath.length) {
                    toPath = PathUtil.parsePathString(toAttrs[k]); // 终点状态
                    fromPath = PathUtil.parsePathString(fromAttrs[k]); // 起始状态
                    fromPath = PathUtil.fillPathByDiff(fromPath, toPath);
                    fromPath = PathUtil.formatPath(fromPath, toPath);
                    animation.fromAttrs.path = fromPath;
                    animation.toAttrs.path = toPath;
                }
                else if (!animation.pathFormatted) {
                    toPath = PathUtil.parsePathString(toAttrs[k]);
                    fromPath = PathUtil.parsePathString(fromAttrs[k]);
                    fromPath = PathUtil.formatPath(fromPath, toPath);
                    animation.fromAttrs.path = fromPath;
                    animation.toAttrs.path = toPath;
                    animation.pathFormatted = true;
                }
                cProps[k] = [];
                for (var i = 0; i < toPath.length; i++) {
                    var toPathPoint = toPath[i];
                    var fromPathPoint = fromPath[i];
                    var cPathPoint = [];
                    for (var j = 0; j < toPathPoint.length; j++) {
                        if (isNumber(toPathPoint[j]) && fromPathPoint && isNumber(fromPathPoint[j])) {
                            interf = interpolate(fromPathPoint[j], toPathPoint[j]);
                            cPathPoint.push(interf(ratio));
                        }
                        else {
                            cPathPoint.push(toPathPoint[j]);
                        }
                    }
                    cProps[k].push(cPathPoint);
                }
            }
            else if (k === 'matrix') {
                /*
                 对矩阵进行插值时，需要保证矩阵不为空，为空则使用单位矩阵
                 TODO: 二维和三维场景下单位矩阵不同，之后 WebGL 版需要做进一步处理
                 */
                var matrixFn = interpolateArray(fromAttrs[k] || IDENTITY_MATRIX, toAttrs[k] || IDENTITY_MATRIX);
                var currentMatrix = matrixFn(ratio);
                cProps[k] = currentMatrix;
            }
            else if (isColorProp(k) && isGradientColor(toAttrs[k])) {
                cProps[k] = toAttrs[k];
            }
            else if (!isFunction(toAttrs[k])) {
                // 非函数类型的值才能做插值
                interf = interpolate(fromAttrs[k], toAttrs[k]);
                cProps[k] = interf(ratio);
            }
        }
    }
    shape.attr(cProps);
}
/**
 * 根据自定义帧动画函数 onFrame 来更新属性
 * @param {IElement}  shape    元素
 * @param {Animation} animation 动画
 * @param {number}    elapsed  动画执行时间(毫秒)
 * @return {boolean}  动画是否执行完成
 */
function update(shape, animation, elapsed) {
    var startTime = animation.startTime, delay = animation.delay;
    // 如果还没有开始执行或暂停，先不更新
    if (elapsed < startTime + delay || animation._paused) {
        return false;
    }
    var ratio;
    var duration = animation.duration;
    var easing = animation.easing;
    var easeFn = getEasing(easing);
    // 已执行时间
    elapsed = elapsed - startTime - animation.delay;
    if (animation.repeat) {
        // 如果动画重复执行，则 elapsed > duration，计算 ratio 时需取模
        ratio = (elapsed % duration) / duration;
        ratio = easeFn(ratio);
    }
    else {
        ratio = elapsed / duration;
        if (ratio < 1) {
            // 动画未执行完
            ratio = easeFn(ratio);
        }
        else {
            // 动画已执行完
            if (animation.onFrame) {
                shape.attr(animation.onFrame(1));
            }
            else {
                shape.attr(animation.toAttrs);
            }
            return true;
        }
    }
    if (animation.onFrame) {
        var attrs = animation.onFrame(ratio);
        shape.attr(attrs);
    }
    else {
        _update(shape, animation, ratio);
    }
    return false;
}
var Timeline = /** @class */ (function () {
    /**
     * 时间轴构造函数，依赖于画布
     * @param {}
     */
    function Timeline(canvas) {
        /**
         * 执行动画的元素列表
         * @type {IElement[]}
         */
        this.animators = [];
        /**
         * 当前时间
         * @type {number}
         */
        this.current = 0;
        /**
         * 定时器
         * @type {d3Timer.Timer}
         */
        this.timer = null;
        this.canvas = canvas;
    }
    /**
     * 初始化定时器
     */
    Timeline.prototype.initTimer = function () {
        var _this = this;
        var isFinished = false;
        var shape;
        var animations;
        var animation;
        this.timer = d3Timer.timer(function (elapsed) {
            _this.current = elapsed;
            if (_this.animators.length > 0) {
                for (var i = _this.animators.length - 1; i >= 0; i--) {
                    shape = _this.animators[i];
                    if (shape.destroyed) {
                        // 如果已经被销毁，直接移出队列
                        _this.removeAnimator(i);
                        continue;
                    }
                    if (!shape.isAnimatePaused()) {
                        animations = shape.get('animations');
                        for (var j = animations.length - 1; j >= 0; j--) {
                            animation = animations[j];
                            isFinished = update(shape, animation, elapsed);
                            if (isFinished) {
                                animations.splice(j, 1);
                                isFinished = false;
                                if (animation.callback) {
                                    animation.callback();
                                }
                            }
                        }
                    }
                    if (animations.length === 0) {
                        _this.removeAnimator(i);
                    }
                }
                var autoDraw = _this.canvas.get('autoDraw');
                // 非自动渲染模式下，手动调用 canvas.draw() 重新渲染
                if (!autoDraw) {
                    _this.canvas.draw();
                }
            }
        });
    };
    /**
     * 增加动画元素
     */
    Timeline.prototype.addAnimator = function (shape) {
        this.animators.push(shape);
    };
    /**
     * 移除动画元素
     */
    Timeline.prototype.removeAnimator = function (index) {
        this.animators.splice(index, 1);
    };
    /**
     * 是否有动画在执行
     */
    Timeline.prototype.isAnimating = function () {
        return !!this.animators.length;
    };
    /**
     * 停止定时器
     */
    Timeline.prototype.stop = function () {
        if (this.timer) {
            this.timer.stop();
        }
    };
    /**
     * 停止时间轴上所有元素的动画，并置空动画元素列表
     * @param {boolean} toEnd 是否到动画的最终状态，用来透传给动画元素的 stopAnimate 方法
     */
    Timeline.prototype.stopAllAnimations = function (toEnd) {
        if (toEnd === void 0) { toEnd = true; }
        this.animators.forEach(function (animator) {
            animator.stopAnimate(toEnd);
        });
        this.animators = [];
        this.canvas.draw();
    };
    /**
     * 获取当前时间
     */
    Timeline.prototype.getTime = function () {
        return this.current;
    };
    return Timeline;
}());
export default Timeline;
//# sourceMappingURL=timeline.js.map