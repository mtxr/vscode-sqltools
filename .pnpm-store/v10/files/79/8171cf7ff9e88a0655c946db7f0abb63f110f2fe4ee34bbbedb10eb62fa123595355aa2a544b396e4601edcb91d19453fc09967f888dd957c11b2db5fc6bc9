import { IShape } from '../interfaces';
import { LooseObject } from '../types';

class GraphEvent {
  /**
   * 事件类型
   * @type {string}
   */
  type: string;
  /**
   * 事件名称
   * @type {string}
   */
  name: string;
  /**
   * 画布上的位置 x
   * @type {number}
   */
  x: number;
  /**
   * 画布上的位置 y
   * @type {number}
   */
  y: number;
  /**
   * 窗口上的位置 x
   * @type {number}
   */
  clientX: number;
  /**
   * 窗口上的位置 y
   * @type {number}
   */
  clientY: number;
  /**
   * 是否允许冒泡
   * @type {boolean}
   */
  bubbles: boolean = true;
  /**
   * 触发对象
   * @type {object}
   */
  target: LooseObject = null;
  /**
   * 监听对象
   * @type {object}
   */
  currentTarget: LooseObject = null;
  /**
   * 委托对象
   * @type {object}
   */
  delegateTarget: LooseObject = null;
  /**
   * 委托事件监听对象的代理对象，即 ev.delegateObject = ev.currentTarget.get('delegateObject')
   * @type {object}
   */
  delegateObject: object = null;
  /**
   * 是否阻止了原生事件
   * @type {boolean}
   */
  defaultPrevented: boolean = false;
  /**
   * 是否阻止传播（向上冒泡）
   * @type {boolean}
   */
  propagationStopped: boolean = false;
  /**
   * 触发事件的图形
   * @type {IShape}
   */
  shape: IShape = null;
  /**
   * 开始触发事件的图形
   * @type {IShape}
   */
  fromShape: IShape = null;
  /**
   * 事件结束时的触发图形
   * @type {IShape}
   */
  toShape: IShape = null;

  /**
   * 触发时的时间
   * @type {number}
   */
  timeStamp: number;

  /**
   * 触发时的对象
   * @type {object}
   */
  originalEvent: Event;

  // 触发事件的路径
  propagationPath: any[] = [];

  constructor(type, event) {
    this.type = type;
    this.name = type;
    this.originalEvent = event;
    this.timeStamp = event.timeStamp;
  }

  /**
   * 阻止浏览器默认的行为
   */
  preventDefault() {
    this.defaultPrevented = true;
    if (this.originalEvent.preventDefault) {
      this.originalEvent.preventDefault();
    }
  }

  /**
   * 阻止冒泡
   */
  stopPropagation() {
    this.propagationStopped = true;
  }

  toString() {
    const type = this.type;
    return `[Event (type=${type})]`;
  }

  save() {}

  restore() {}
}

export default GraphEvent;
