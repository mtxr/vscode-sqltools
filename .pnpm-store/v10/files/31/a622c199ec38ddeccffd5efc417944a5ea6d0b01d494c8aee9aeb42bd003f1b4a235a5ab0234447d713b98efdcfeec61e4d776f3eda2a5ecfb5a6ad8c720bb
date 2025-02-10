import { IShape } from '../interfaces';
import { LooseObject } from '../types';
declare class GraphEvent {
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
    bubbles: boolean;
    /**
     * 触发对象
     * @type {object}
     */
    target: LooseObject;
    /**
     * 监听对象
     * @type {object}
     */
    currentTarget: LooseObject;
    /**
     * 委托对象
     * @type {object}
     */
    delegateTarget: LooseObject;
    /**
     * 委托事件监听对象的代理对象，即 ev.delegateObject = ev.currentTarget.get('delegateObject')
     * @type {object}
     */
    delegateObject: object;
    /**
     * 是否阻止了原生事件
     * @type {boolean}
     */
    defaultPrevented: boolean;
    /**
     * 是否阻止传播（向上冒泡）
     * @type {boolean}
     */
    propagationStopped: boolean;
    /**
     * 触发事件的图形
     * @type {IShape}
     */
    shape: IShape;
    /**
     * 开始触发事件的图形
     * @type {IShape}
     */
    fromShape: IShape;
    /**
     * 事件结束时的触发图形
     * @type {IShape}
     */
    toShape: IShape;
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
    propagationPath: any[];
    constructor(type: any, event: any);
    /**
     * 阻止浏览器默认的行为
     */
    preventDefault(): void;
    /**
     * 阻止冒泡
     */
    stopPropagation(): void;
    toString(): string;
    save(): void;
    restore(): void;
}
export default GraphEvent;
