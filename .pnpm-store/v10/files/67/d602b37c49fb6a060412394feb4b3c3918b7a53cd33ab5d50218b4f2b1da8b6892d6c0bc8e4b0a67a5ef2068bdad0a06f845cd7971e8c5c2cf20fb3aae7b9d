import { each, isEqual, isFunction, isNumber, isObject, isArray, noop, mix, upperFirst, uniqueId } from '@antv/util';
import { ext } from '@antv/matrix-util';
import { IElement, IShape, IGroup, ICanvas, ICtor } from '../interfaces';
import { ClipCfg, ChangeType, OnFrame, ShapeAttrs, AnimateCfg, Animation, BBox, ShapeBase } from '../types';
import { removeFromArray, isParent } from '../util/util';
import { multiplyMatrix, multiplyVec2, invert } from '../util/matrix';
import Base from './base';
import GraphEvent from '../event/graph-event';

const { transform } = ext;

const MATRIX = 'matrix';
const CLONE_CFGS = ['zIndex', 'capture', 'visible', 'type'];

// 可以在 toAttrs 中设置，但不属于绘图属性的字段
const RESERVED_PORPS = ['repeat'];

const DELEGATION_SPLIT = ':';
const WILDCARD = '*';

// 需要考虑数组嵌套数组的场景
// 数组嵌套对象的场景不考虑
function _cloneArrayAttr(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (isArray(arr[i])) {
      result.push([].concat(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

function getFormatFromAttrs(toAttrs, shape) {
  const fromAttrs = {};
  const attrs = shape.attrs;
  for (const k in toAttrs) {
    fromAttrs[k] = attrs[k];
  }
  return fromAttrs;
}

function getFormatToAttrs(props, shape) {
  const toAttrs = {};
  const attrs = shape.attr();
  each(props, (v, k) => {
    if (RESERVED_PORPS.indexOf(k) === -1 && !isEqual(attrs[k], v)) {
      toAttrs[k] = v;
    }
  });
  return toAttrs;
}

function checkExistedAttrs(animations: Animation[], animation: Animation) {
  if (animation.onFrame) {
    return animations;
  }
  const { startTime, delay, duration } = animation;
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  each(animations, (item) => {
    // 后一个动画开始执行的时间 < 前一个动画的结束时间 && 后一个动画的执行时间 > 前一个动画的延迟
    if (startTime + delay < item.startTime + item.delay + item.duration && duration > item.delay) {
      each(animation.toAttrs, (v, k) => {
        if (hasOwnProperty.call(item.toAttrs, k)) {
          delete item.toAttrs[k];
          delete item.fromAttrs[k];
        }
      });
    }
  });

  return animations;
}

abstract class Element extends Base implements IElement {
  /**
   * @protected
   * 图形属性
   * @type {ShapeAttrs}
   */
  attrs: ShapeAttrs = {};

  constructor(cfg) {
    super(cfg);
    const attrs = this.getDefaultAttrs();
    mix(attrs, cfg.attrs);
    this.attrs = attrs;
    this.initAttrs(attrs);
    this.initAnimate(); // 初始化动画
  }

  // override
  getDefaultCfg() {
    return {
      visible: true,
      capture: true,
      zIndex: 0,
    };
  }

  /**
   * @protected
   * 获取默认的属相
   */
  getDefaultAttrs() {
    return {
      matrix: this.getDefaultMatrix(),
      opacity: 1,
    };
  }

  abstract getShapeBase(): ShapeBase;
  abstract getGroupBase(): ICtor<IGroup>;

  /**
   * @protected
   * 一些方法调用会引起画布变化
   * @param {ChangeType} changeType 改变的类型
   */
  onCanvasChange(changeType: ChangeType) {}

  /**
   * @protected
   * 初始化属性，有些属性需要加工
   * @param {object} attrs 属性值
   */
  initAttrs(attrs: ShapeAttrs) {}

  /**
   * @protected
   * 初始化动画
   */
  initAnimate() {
    this.set('animable', true);
    this.set('animating', false);
  }

  isGroup() {
    return false;
  }

  getParent(): IGroup {
    return this.get('parent');
  }

  getCanvas(): ICanvas {
    return this.get('canvas');
  }

  attr(...args) {
    const [name, value] = args;
    if (!name) return this.attrs;
    if (isObject(name)) {
      for (const k in name) {
        this.setAttr(k, name[k]);
      }
      this.afterAttrsChange(name);
      return this;
    }
    if (args.length === 2) {
      this.setAttr(name, value);
      this.afterAttrsChange({
        [name]: value,
      });
      return this;
    }
    return this.attrs[name];
  }

  // 在子类上单独实现
  abstract getBBox(): BBox;
  // 子类上单独实现
  abstract getCanvasBBox(): BBox;

  // 是否被裁剪，被裁剪则不显示，不参与拾取
  isClipped(refX, refY): boolean {
    const clip = this.getClip();
    return clip && !clip.isHit(refX, refY);
  }

  /**
   * 内部设置属性值的接口
   * @param {string} name 属性名
   * @param {any} value 属性值
   */
  setAttr(name: string, value: any) {
    const originValue = this.attrs[name];
    if (originValue !== value) {
      this.attrs[name] = value;
      this.onAttrChange(name, value, originValue);
    }
  }

  /**
   * @protected
   * 属性值发生改变
   * @param {string} name 属性名
   * @param {any} value 属性值
   * @param {any} originValue 属性值
   */
  onAttrChange(name: string, value: any, originValue: any) {
    if (name === 'matrix') {
      this.set('totalMatrix', null);
    }
  }

  /**
   * 属性更改后需要做的事情
   * @protected
   */
  afterAttrsChange(targetAttrs) {
    if (this.cfg.isClipShape) {
      const applyTo = this.cfg.applyTo;
      if (applyTo) {
        applyTo.onCanvasChange('clip');
      }
    } else {
      this.onCanvasChange('attr');
    }
  }

  show() {
    // 不是高频操作直接使用 set
    this.set('visible', true);
    this.onCanvasChange('show');
    return this;
  }

  hide() {
    // 不是高频操作直接使用 set
    this.set('visible', false);
    this.onCanvasChange('hide');
    return this;
  }

  setZIndex(zIndex: number) {
    this.set('zIndex', zIndex);
    const parent = this.getParent();
    if (parent) {
      // 改变 zIndex 不应该立即触发渲染 (调用 onCanvasChange('zIndex'))，需要经过 sort 再触发
      parent.sort();
    }
    return this;
  }

  toFront() {
    const parent = this.getParent();
    if (!parent) {
      return;
    }
    const children = parent.getChildren();
    const el = this.get('el');
    const index = children.indexOf(this);
    children.splice(index, 1);
    children.push(this);
    this.onCanvasChange('zIndex');
  }

  toBack() {
    const parent = this.getParent();
    if (!parent) {
      return;
    }
    const children = parent.getChildren();
    const el = this.get('el');
    const index = children.indexOf(this);
    children.splice(index, 1);
    children.unshift(this);
    this.onCanvasChange('zIndex');
  }

  remove(destroy = true) {
    const parent = this.getParent();
    if (parent) {
      removeFromArray(parent.getChildren(), this);
      if (!parent.get('clearing')) {
        // 如果父元素正在清理，当前元素不触发 remove
        this.onCanvasChange('remove');
      }
    } else {
      this.onCanvasChange('remove');
    }
    if (destroy) {
      this.destroy();
    }
  }

  resetMatrix() {
    this.attr(MATRIX, this.getDefaultMatrix());
    this.onCanvasChange('matrix');
  }

  getMatrix(): number[] {
    return this.attr(MATRIX);
  }

  setMatrix(m: number[]) {
    this.attr(MATRIX, m);
    this.onCanvasChange('matrix');
  }

  // 获取总的 matrix
  getTotalMatrix() {
    let totalMatrix = this.cfg.totalMatrix;
    if (!totalMatrix) {
      const currentMatrix = this.attr('matrix');
      const parentMatrix = this.cfg.parentMatrix;
      if (parentMatrix && currentMatrix) {
        totalMatrix = multiplyMatrix(parentMatrix, currentMatrix);
      } else {
        totalMatrix = currentMatrix || parentMatrix;
      }
      this.set('totalMatrix', totalMatrix);
    }
    return totalMatrix;
  }

  // 上层分组设置 matrix
  applyMatrix(matrix: number[]) {
    const currentMatrix = this.attr('matrix');
    let totalMatrix = null;
    if (matrix && currentMatrix) {
      totalMatrix = multiplyMatrix(matrix, currentMatrix);
    } else {
      totalMatrix = currentMatrix || matrix;
    }
    this.set('totalMatrix', totalMatrix);
    this.set('parentMatrix', matrix);
  }

  /**
   * @protected
   * 获取默认的矩阵
   * @returns {number[]|null} 默认的矩阵
   */
  getDefaultMatrix() {
    return null;
  }

  // 将向量应用设置的矩阵
  applyToMatrix(v: number[]): number[] {
    const matrix = this.attr('matrix');
    if (matrix) {
      return multiplyVec2(matrix, v);
    }
    return v;
  }

  // 根据设置的矩阵，将向量转换相对于图形/分组的位置
  invertFromMatrix(v: number[]): number[] {
    const matrix = this.attr('matrix');
    if (matrix) {
      const invertMatrix = invert(matrix);
      if (invertMatrix) {
        return multiplyVec2(invertMatrix, v);
      }
    }
    return v;
  }

  // 设置 clip
  setClip(clipCfg: ClipCfg) {
    const canvas = this.getCanvas();
    // 应该只设置当前元素的 clip，不应该去修改 clip 本身，方便 clip 被复用
    // TODO: setClip 的传参既 shape 配置，也支持 shape 对象
    // const preShape = this.get('clipShape');
    // if (preShape) {
    //   // 将之前的 clipShape 销毁
    //   preShape.destroy();
    // }
    let clipShape = null;
    // 如果配置项为 null，则不移除 clipShape
    if (clipCfg) {
      const ShapeBase = this.getShapeBase();
      const shapeType = upperFirst(clipCfg.type);
      const Cons = ShapeBase[shapeType];
      if (Cons) {
        clipShape = new Cons({
          type: clipCfg.type,
          isClipShape: true, // 增加一个标记
          applyTo: this,
          attrs: clipCfg.attrs,
          canvas, // 设置 canvas
        });
      }
    }

    this.set('clipShape', clipShape);
    this.onCanvasChange('clip');
    return clipShape;
  }

  getClip(): IShape {
    // 高频率调用的地方直接使用 this.cfg.xxx
    const clipShape = this.cfg.clipShape;
    // 未设置时返回 Null，保证一致性
    if (!clipShape) {
      return null;
    }
    return clipShape;
  }

  clone() {
    const originAttrs = this.attrs;
    const attrs = {};
    each(originAttrs, (i, k) => {
      if (isArray(originAttrs[k])) {
        attrs[k] = _cloneArrayAttr(originAttrs[k]);
      } else {
        attrs[k] = originAttrs[k];
      }
    });
    const cons = this.constructor;
    // @ts-ignore
    const clone = new cons({ attrs });
    each(CLONE_CFGS, (cfgName) => {
      clone.set(cfgName, this.get(cfgName));
    });
    return clone;
  }

  destroy() {
    const destroyed = this.destroyed;
    if (destroyed) {
      return;
    }
    this.attrs = {};
    super.destroy();
    // this.onCanvasChange('destroy');
  }

  /**
   * 是否处于动画暂停状态
   * @return {boolean} 是否处于动画暂停状态
   */
  isAnimatePaused() {
    return this.get('_pause').isPaused;
  }

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
  animate(...args) {
    if (!this.get('timeline') && !this.get('canvas')) {
      return;
    }
    this.set('animating', true);
    let timeline = this.get('timeline');
    if (!timeline) {
      timeline = this.get('canvas').get('timeline');
      this.set('timeline', timeline);
    }
    let animations = this.get('animations') || [];
    // 初始化 tick
    if (!timeline.timer) {
      timeline.initTimer();
    }
    let [toAttrs, duration, easing = 'easeLinear', callback = noop, delay = 0] = args;
    let onFrame: OnFrame;
    let repeat: boolean;
    let pauseCallback;
    let resumeCallback;
    let animateCfg: AnimateCfg;
    // 第二个参数，既可以是动画最终状态 toAttrs，也可以是自定义帧动画函数 onFrame
    if (isFunction(toAttrs)) {
      onFrame = toAttrs as OnFrame;
      toAttrs = {};
    } else if (isObject(toAttrs) && (toAttrs as any).onFrame) {
      // 兼容 3.0 中的写法，onFrame 和 repeat 可在 toAttrs 中设置
      onFrame = (toAttrs as any).onFrame as OnFrame;
      repeat = (toAttrs as any).repeat;
    }
    // 第二个参数，既可以是执行时间 duration，也可以是动画参数 animateCfg
    if (isObject(duration)) {
      animateCfg = duration as AnimateCfg;
      duration = animateCfg.duration;
      easing = animateCfg.easing || 'easeLinear';
      delay = animateCfg.delay || 0;
      // animateCfg 中的设置优先级更高
      repeat = animateCfg.repeat || repeat || false;
      callback = animateCfg.callback || noop;
      pauseCallback = animateCfg.pauseCallback || noop;
      resumeCallback = animateCfg.resumeCallback || noop;
    } else {
      // 第四个参数，既可以是回调函数 callback，也可以是延迟时间 delay
      if (isNumber(callback)) {
        delay = callback;
        callback = null;
      }
      // 第三个参数，既可以是缓动参数 easing，也可以是回调函数 callback
      if (isFunction(easing)) {
        callback = easing;
        easing = 'easeLinear';
      } else {
        easing = easing || 'easeLinear';
      }
    }
    const formatToAttrs = getFormatToAttrs(toAttrs, this);
    const animation: Animation = {
      fromAttrs: getFormatFromAttrs(formatToAttrs, this),
      toAttrs: formatToAttrs,
      duration,
      easing,
      repeat,
      callback,
      pauseCallback,
      resumeCallback,
      delay,
      startTime: timeline.getTime(),
      id: uniqueId(),
      onFrame,
      pathFormatted: false,
    };
    // 如果动画元素队列中已经有这个图形了
    if (animations.length > 0) {
      // 先检查是否需要合并属性。若有相同的动画，将该属性从前一个动画中删除,直接用后一个动画中
      animations = checkExistedAttrs(animations, animation);
    } else {
      // 否则将图形添加到动画元素队列
      timeline.addAnimator(this);
    }
    animations.push(animation);
    this.set('animations', animations);
    this.set('_pause', { isPaused: false });
  }

  /**
   * 停止动画
   * @param {boolean} toEnd 是否到动画的最终状态
   */
  stopAnimate(toEnd = true) {
    const animations = this.get('animations');
    each(animations, (animation: Animation) => {
      // 将动画执行到最后一帧
      if (toEnd) {
        if (animation.onFrame) {
          this.attr(animation.onFrame(1));
        } else {
          this.attr(animation.toAttrs);
        }
      }
      if (animation.callback) {
        // 动画停止时的回调
        animation.callback();
      }
    });
    this.set('animating', false);
    this.set('animations', []);
  }

  /**
   * 暂停动画
   */
  pauseAnimate() {
    const timeline = this.get('timeline');
    const animations = this.get('animations');
    const pauseTime = timeline.getTime();
    each(animations, (animation: Animation) => {
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
      pauseTime,
    });
    return this;
  }

  /**
   * 恢复动画
   */
  resumeAnimate() {
    const timeline = this.get('timeline');
    const current = timeline.getTime();
    const animations = this.get('animations');
    const pauseTime = this.get('_pause').pauseTime;
    // 之后更新属性需要计算动画已经执行的时长，如果暂停了，就把初始时间调后
    each(animations, (animation: Animation) => {
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
  }

  /**
   * 触发委托事件
   * @param  {string}     type 事件类型
   * @param  {GraphEvent} eventObj 事件对象
   */
  emitDelegation(type: string, eventObj: GraphEvent) {
    const paths = eventObj.propagationPath;
    const events = this.getEvents();
    let relativeShape;
    if (type === 'mouseenter') {
      relativeShape = eventObj.fromShape;
    } else if (type === 'mouseleave') {
      relativeShape = eventObj.toShape;
    }
    // 至少有一个对象，且第一个对象为 shape
    for (let i = 0; i < paths.length; i++) {
      const element = paths[i];
      // 暂定跟 name 绑定
      const name = element.get('name');
      if (name) {
        // 第一个 mouseenter 和 mouseleave 的停止即可，因为后面的都是前面的 Parent
        if (
          // 只有 element 是 Group 或者 Canvas 的时候，才需要判断 isParent
          (element.isGroup() || (element.isCanvas && element.isCanvas())) &&
          relativeShape &&
          isParent(element, relativeShape)
        ) {
          break;
        }
        if (isArray(name)) {
          each(name, (subName) => {
            this.emitDelegateEvent(element, subName, eventObj);
          });
        } else {
          this.emitDelegateEvent(element, name, eventObj);
        }
      }
    }
  }

  private emitDelegateEvent(element, name: string, eventObj: GraphEvent) {
    const events = this.getEvents();
    // 事件委托的形式 name:type
    const eventName = name + DELEGATION_SPLIT + eventObj.type;
    if (events[eventName] || events[WILDCARD]) {
      // 对于通配符 *，事件名称 = 委托事件名称
      eventObj.name = eventName;
      eventObj.currentTarget = element;
      eventObj.delegateTarget = this;
      // 将委托事件的监听对象 delegateObject 挂载到事件对象上
      eventObj.delegateObject = element.get('delegateObject');
      this.emit(eventName, eventObj);
    }
  }

  /**
   * 移动元素
   * @param {number} translateX 水平移动距离
   * @param {number} translateY 垂直移动距离
   * @return {IElement} 元素
   */
  translate(translateX: number = 0, translateY: number = 0) {
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [['t', translateX, translateY]]);
    this.setMatrix(newMatrix);
    return this;
  }

  /**
   * 移动元素到目标位置
   * @param {number} targetX 目标位置的水平坐标
   * @param {number} targetX 目标位置的垂直坐标
   * @return {IElement} 元素
   */
  move(targetX: number, targetY: number) {
    const x = this.attr('x') || 0;
    const y = this.attr('y') || 0;
    this.translate(targetX - x, targetY - y);
    return this;
  }

  /**
   * 移动元素到目标位置，等价于 move 方法。由于 moveTo 的语义性更强，因此在文档中推荐使用 moveTo 方法
   * @param {number} targetX 目标位置的 x 轴坐标
   * @param {number} targetY 目标位置的 y 轴坐标
   * @return {IElement} 元素
   */
  moveTo(targetX: number, targetY: number) {
    return this.move(targetX, targetY);
  }

  /**
   * 缩放元素
   * @param {number} ratioX 水平缩放比例
   * @param {number} ratioY 垂直缩放比例
   * @return {IElement} 元素
   */
  scale(ratioX: number, ratioY?: number) {
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [['s', ratioX, ratioY || ratioX]]);
    this.setMatrix(newMatrix);
    return this;
  }

  /**
   * 以画布左上角 (0, 0) 为中心旋转元素
   * @param {number} radian 旋转角度(弧度值)
   * @return {IElement} 元素
   */
  rotate(radian: number) {
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [['r', radian]]);
    this.setMatrix(newMatrix);
    return this;
  }

  /**
   * 以起始点为中心旋转元素
   * @param {number} radian 旋转角度(弧度值)
   * @return {IElement} 元素
   */
  rotateAtStart(rotate: number): IElement {
    const { x, y } = this.attr();
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [
      ['t', -x, -y],
      ['r', rotate],
      ['t', x, y],
    ]);
    this.setMatrix(newMatrix);
    return this;
  }

  /**
   * 以任意点 (x, y) 为中心旋转元素
   * @param {number} radian 旋转角度(弧度值)
   * @return {IElement} 元素
   */
  rotateAtPoint(x: number, y: number, rotate: number): IElement {
    const matrix = this.getMatrix();
    const newMatrix = transform(matrix, [
      ['t', -x, -y],
      ['r', rotate],
      ['t', x, y],
    ]);
    this.setMatrix(newMatrix);
    return this;
  }
}

export default Element;
