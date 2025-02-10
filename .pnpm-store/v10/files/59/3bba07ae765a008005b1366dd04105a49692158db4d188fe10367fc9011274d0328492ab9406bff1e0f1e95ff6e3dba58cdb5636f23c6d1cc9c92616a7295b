import { IElement, IShape, IGroup, ICanvas, ICtor } from '../interfaces';
import { ClipCfg, ChangeType, ShapeAttrs, BBox, ShapeBase } from '../types';
import Base from './base';
import GraphEvent from '../event/graph-event';
declare abstract class Element extends Base implements IElement {
    /**
     * @protected
     * 图形属性
     * @type {ShapeAttrs}
     */
    attrs: ShapeAttrs;
    constructor(cfg: any);
    getDefaultCfg(): {
        visible: boolean;
        capture: boolean;
        zIndex: number;
    };
    /**
     * @protected
     * 获取默认的属相
     */
    getDefaultAttrs(): {
        matrix: any;
        opacity: number;
    };
    abstract getShapeBase(): ShapeBase;
    abstract getGroupBase(): ICtor<IGroup>;
    /**
     * @protected
     * 一些方法调用会引起画布变化
     * @param {ChangeType} changeType 改变的类型
     */
    onCanvasChange(changeType: ChangeType): void;
    /**
     * @protected
     * 初始化属性，有些属性需要加工
     * @param {object} attrs 属性值
     */
    initAttrs(attrs: ShapeAttrs): void;
    /**
     * @protected
     * 初始化动画
     */
    initAnimate(): void;
    isGroup(): boolean;
    getParent(): IGroup;
    getCanvas(): ICanvas;
    attr(...args: any[]): any;
    abstract getBBox(): BBox;
    abstract getCanvasBBox(): BBox;
    isClipped(refX: any, refY: any): boolean;
    /**
     * 内部设置属性值的接口
     * @param {string} name 属性名
     * @param {any} value 属性值
     */
    setAttr(name: string, value: any): void;
    /**
     * @protected
     * 属性值发生改变
     * @param {string} name 属性名
     * @param {any} value 属性值
     * @param {any} originValue 属性值
     */
    onAttrChange(name: string, value: any, originValue: any): void;
    /**
     * 属性更改后需要做的事情
     * @protected
     */
    afterAttrsChange(targetAttrs: any): void;
    show(): this;
    hide(): this;
    setZIndex(zIndex: number): this;
    toFront(): void;
    toBack(): void;
    remove(destroy?: boolean): void;
    resetMatrix(): void;
    getMatrix(): number[];
    setMatrix(m: number[]): void;
    getTotalMatrix(): any;
    applyMatrix(matrix: number[]): void;
    /**
     * @protected
     * 获取默认的矩阵
     * @returns {number[]|null} 默认的矩阵
     */
    getDefaultMatrix(): any;
    applyToMatrix(v: number[]): number[];
    invertFromMatrix(v: number[]): number[];
    setClip(clipCfg: ClipCfg): any;
    getClip(): IShape;
    clone(): any;
    destroy(): void;
    /**
     * 是否处于动画暂停状态
     * @return {boolean} 是否处于动画暂停状态
     */
    isAnimatePaused(): any;
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
    animate(...args: any[]): void;
    /**
     * 停止动画
     * @param {boolean} toEnd 是否到动画的最终状态
     */
    stopAnimate(toEnd?: boolean): void;
    /**
     * 暂停动画
     */
    pauseAnimate(): this;
    /**
     * 恢复动画
     */
    resumeAnimate(): this;
    /**
     * 触发委托事件
     * @param  {string}     type 事件类型
     * @param  {GraphEvent} eventObj 事件对象
     */
    emitDelegation(type: string, eventObj: GraphEvent): void;
    private emitDelegateEvent;
    /**
     * 移动元素
     * @param {number} translateX 水平移动距离
     * @param {number} translateY 垂直移动距离
     * @return {IElement} 元素
     */
    translate(translateX?: number, translateY?: number): this;
    /**
     * 移动元素到目标位置
     * @param {number} targetX 目标位置的水平坐标
     * @param {number} targetX 目标位置的垂直坐标
     * @return {IElement} 元素
     */
    move(targetX: number, targetY: number): this;
    /**
     * 移动元素到目标位置，等价于 move 方法。由于 moveTo 的语义性更强，因此在文档中推荐使用 moveTo 方法
     * @param {number} targetX 目标位置的 x 轴坐标
     * @param {number} targetY 目标位置的 y 轴坐标
     * @return {IElement} 元素
     */
    moveTo(targetX: number, targetY: number): this;
    /**
     * 缩放元素
     * @param {number} ratioX 水平缩放比例
     * @param {number} ratioY 垂直缩放比例
     * @return {IElement} 元素
     */
    scale(ratioX: number, ratioY?: number): this;
    /**
     * 以画布左上角 (0, 0) 为中心旋转元素
     * @param {number} radian 旋转角度(弧度值)
     * @return {IElement} 元素
     */
    rotate(radian: number): this;
    /**
     * 以起始点为中心旋转元素
     * @param {number} radian 旋转角度(弧度值)
     * @return {IElement} 元素
     */
    rotateAtStart(rotate: number): IElement;
    /**
     * 以任意点 (x, y) 为中心旋转元素
     * @param {number} radian 旋转角度(弧度值)
     * @return {IElement} 元素
     */
    rotateAtPoint(x: number, y: number, rotate: number): IElement;
}
export default Element;
