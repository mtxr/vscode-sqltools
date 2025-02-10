import { Base } from '@antv/g-base';
import { deepMix, each, hasKey, isObject } from '@antv/util';
import { ILocation } from '../interfaces';
import { BBox, ComponentCfg, LocationCfg, OffsetPoint } from '../types';
const LOCATION_FIELD_MAP = {
  none: [],
  point: ['x', 'y'],
  region: ['start', 'end'],
  points: ['points'],
  circle: ['center', 'radius', 'startAngle', 'endAngle'],
};

abstract class Component<T extends ComponentCfg = ComponentCfg> extends Base implements ILocation {
  constructor(cfg: T) {
    super(cfg);
    this.initCfg();
  }
  /**
   * @protected
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    return {
      id: '',
      name: '',
      type: '',
      locationType: 'none',
      offsetX: 0,
      offsetY: 0,
      animate: false,
      capture: true,
      updateAutoRender: false,
      animateOption: {
        appear: null, // 初始入场动画配置
        update: {
          duration: 400,
          easing: 'easeQuadInOut',
        }, // 更新时发生变更的动画配置
        enter: {
          duration: 400,
          easing: 'easeQuadInOut',
        }, // 更新时新增元素的入场动画配置
        leave: {
          duration: 350,
          easing: 'easeQuadIn',
        }, // 更新时销毁动画配置
      },
      events: null,
      defaultCfg: {},
      visible: true,
    };
  }

  /**
   * 清理组件的内容，一般配合 render 使用
   * @example
   * axis.clear();
   * axis.render();
   */
  public clear() {}

  /**
   * 更新组件
   * @param {object} cfg 更新属性
   */
  public update(cfg: Partial<T>) {
    const defaultCfg = this.get('defaultCfg') || {};
    each(cfg, (value, name) => {
      const originCfg = this.get(name);
      let newCfg = value;
      if (originCfg !== value) {
        // 判断两者是否相等，主要是进行 null 的判定
        if (isObject(value) && defaultCfg[name]) {
          // 新设置的属性与默认值进行合并
          newCfg = deepMix({}, defaultCfg[name], value);
        }
        this.set(name, newCfg);
      }
    });
    this.updateInner(cfg);
    this.afterUpdate(cfg);
  }
  // 更新内部
  protected updateInner(cfg: Partial<T>) {

  }

  protected afterUpdate(cfg: Partial<T>) {
    // 更新时考虑显示、隐藏
    if (hasKey(cfg, 'visible')) {
      if (cfg.visible) {
        this.show();
      } else {
        this.hide();
      }
    }
    // 更新时考虑capture
    if (hasKey(cfg, 'capture')) {
      this.setCapture(cfg.capture);
    }
  }

  public abstract getBBox(): BBox;

  public getLayoutBBox(): BBox {
    return this.getBBox(); // 默认返回 getBBox，不同的组件内部单独实现
  }

  public getLocationType() {
    return this.get('locationType');
  }

  public getOffset(): OffsetPoint {
    return {
      offsetX: this.get('offsetX'),
      offsetY: this.get('offsetY'),
    };
  }

  // 默认使用 update
  public setOffset(offsetX: number, offsetY: number) {
    this.update({
      offsetX,
      offsetY,
    } as T);
  }

  public setLocation(cfg: LocationCfg) {
    const location = { ...cfg } as Partial<T>;
    this.update(location);
  }

  // 实现 ILocation 接口的 getLocation
  public getLocation(): LocationCfg {
    const location = {} as LocationCfg;
    const locationType = this.get('locationType');
    const fields = LOCATION_FIELD_MAP[locationType];
    each(fields, (field) => {
      location[field] = this.get(field);
    });
    return location;
  }

  public isList(): boolean {
    return false;
  }

  public isSlider(): boolean {
    return false;
  }

  /**
   * @protected
   * 初始化，用于具体的组件继承
   */
  public init() {}

  /**
   * 绘制组件
   */
  public abstract render();

  /**
   * 显示
   */
  public abstract show();

  public abstract setCapture(capture: boolean);

  /**
   * 隐藏
   */
  public abstract hide();

  // 将组件默认的配置项设置合并到传入的配置项
  private initCfg() {
    const defaultCfg = this.get('defaultCfg');
    each(defaultCfg, (value, name) => {
      const cfg = this.get(name);
      if (isObject(cfg)) {
        const newCfg = deepMix({}, value, cfg);
        this.set(name, newCfg);
      }
    });
  }
}

export default Component;
