import { Event as GEvent, IShape } from '../dependents';
import { Datum } from '../interface';
import View from './view';
/**
 * @todo Whether it can(or necessary to) keep consistent with the structure of G.Event or directly use the structure of G.Event
 * G2 事件的事件包装类，基于 G.Event
 */
export default class Event {
    /** 当前 target 归属的 view 实例 */
    view: View;
    /** 被包装的原生 G 事件 */
    gEvent: GEvent;
    /** 原始数据 */
    data?: Datum;
    /** 事件类型 */
    type: string;
    constructor(view: View, gEvent: GEvent, data?: Datum);
    /**
     * 非交互产生的事件
     * @param view
     * @param type
     * @param data
     */
    static fromData(view: View, type: string, data: Datum): Event;
    /** the real trigger shape of the event */
    get target(): IShape;
    /** 获取对应的 dom 原生时间 */
    get event(): any;
    /** x 画布坐标 */
    get x(): number;
    /** y 画布坐标 */
    get y(): number;
    /** x 窗口坐标 */
    get clientX(): number;
    /** y 窗口坐标 */
    get clientY(): number;
    /**
     * event string
     * @returns string
     */
    toString(): string;
    /**
     * clone a new event with same attributes
     * @returns [[Event]]
     */
    clone(): Event;
}
