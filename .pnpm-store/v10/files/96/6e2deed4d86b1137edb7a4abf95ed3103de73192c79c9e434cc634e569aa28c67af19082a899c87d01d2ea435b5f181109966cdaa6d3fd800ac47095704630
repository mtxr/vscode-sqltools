import EE from '@antv/event-emitter';
import { IBase } from '../interfaces';
import { LooseObject } from '../types';
declare abstract class Base extends EE implements IBase {
    /**
     * 内部属性，用于 get,set，但是可以用于优化性能使用
     * @type {object}
     */
    cfg: LooseObject;
    /**
     * 是否被销毁
     * @type {boolean}
     */
    destroyed: boolean;
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {};
    constructor(cfg: any);
    get(name: any): any;
    set(name: any, value: any): void;
    destroy(): void;
}
export default Base;
