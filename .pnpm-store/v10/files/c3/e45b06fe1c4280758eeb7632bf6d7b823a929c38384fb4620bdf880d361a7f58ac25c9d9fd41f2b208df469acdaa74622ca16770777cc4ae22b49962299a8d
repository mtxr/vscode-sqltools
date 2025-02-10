import EE from '@antv/event-emitter';
import { IBase } from '../interfaces';
import { mix } from '../util/util';
import { LooseObject } from '../types';
abstract class Base extends EE implements IBase {
  /**
   * 内部属性，用于 get,set，但是可以用于优化性能使用
   * @type {object}
   */
  cfg: LooseObject;

  /**
   * 是否被销毁
   * @type {boolean}
   */
  destroyed: boolean = false;

  /**
   * @protected
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  getDefaultCfg() {
    return {};
  }

  constructor(cfg) {
    super();
    const defaultCfg = this.getDefaultCfg();
    this.cfg = mix(defaultCfg, cfg);
  }

  // 实现接口的方法
  get(name) {
    return this.cfg[name];
  }
  // 实现接口的方法
  set(name, value) {
    this.cfg[name] = value;
  }

  // 实现接口的方法
  destroy() {
    this.cfg = {
      destroyed: true,
    };
    this.off();
    this.destroyed = true;
  }
}

export default Base;
