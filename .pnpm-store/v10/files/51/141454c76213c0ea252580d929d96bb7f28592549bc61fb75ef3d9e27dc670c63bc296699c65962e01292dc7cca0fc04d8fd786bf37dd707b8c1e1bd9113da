import * as d3Timer from 'd3-timer';
import { ICanvas, IElement } from '../interfaces';
declare class Timeline {
    /**
     * 画布
     * @type {ICanvas}
     */
    canvas: ICanvas;
    /**
     * 执行动画的元素列表
     * @type {IElement[]}
     */
    animators: IElement[];
    /**
     * 当前时间
     * @type {number}
     */
    current: number;
    /**
     * 定时器
     * @type {d3Timer.Timer}
     */
    timer: d3Timer.Timer;
    /**
     * 时间轴构造函数，依赖于画布
     * @param {}
     */
    constructor(canvas: ICanvas);
    /**
     * 初始化定时器
     */
    initTimer(): void;
    /**
     * 增加动画元素
     */
    addAnimator(shape: any): void;
    /**
     * 移除动画元素
     */
    removeAnimator(index: any): void;
    /**
     * 是否有动画在执行
     */
    isAnimating(): boolean;
    /**
     * 停止定时器
     */
    stop(): void;
    /**
     * 停止时间轴上所有元素的动画，并置空动画元素列表
     * @param {boolean} toEnd 是否到动画的最终状态，用来透传给动画元素的 stopAnimate 方法
     */
    stopAllAnimations(toEnd?: boolean): void;
    /**
     * 获取当前时间
     */
    getTime(): number;
}
export default Timeline;
