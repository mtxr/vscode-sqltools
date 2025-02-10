import { each, identity, isArray, isNil, isString, mix } from '@antv/util';
import { AttributeCfg, CallbackType, Scale } from '../interface';

// todo 这个到底目的是什么？
const toScaleString = (scale: Scale, value: any): any => {
  if (isString(value)) {
    return value;
  }
  return scale.invert(scale.scale(value));
};

export type AttributeConstructor = new (cfg: any) => Attribute;

/**
 * 所有视觉通道属性的基类
 * @class Base
 */
export default class Attribute {
  public type: string;
  public names: string[] = [];
  public scales: Scale[] = [];
  public linear: boolean = false;

  public values: any[] = [];

  constructor(cfg: AttributeCfg) {
    // 解析配置
    this._parseCfg(cfg);
  }
  public callback: CallbackType = () => [];

  /**
   * 映射的值组成的数组
   * @param params 对应 scale 顺序的值传入
   */
  public mapping(...params: any[]): any[] {
    const values = params.map((param, idx) => {
      return this._toOriginParam(param, this.scales[idx]);
    });

    return this.callback.apply(this, values);
  }

  /**
   * 如果进行线性映射，返回对应的映射值
   * @param percent
   */
  public getLinearValue(percent: number): number | string {
    // 分段数量
    const steps = this.values.length - 1;

    const step = Math.floor(steps * percent);
    const leftPercent = steps * percent - step;

    // todo 不懂这个逻辑
    const start = this.values[step];
    const end = step === steps ? start : this.values[step + 1];

    // 线性方程
    return start + (end - start) * leftPercent;
  }

  /**
   * 根据度量获取属性名
   */
  public getNames() {
    const scales = this.scales;
    const names = this.names;

    const length = Math.min(scales.length, names.length);
    const rst = [];
    for (let i = 0; i < length; i += 1) {
      rst.push(names[i]);
    }
    return rst;
  }

  /**
   * 获取所有的维度名
   */
  public getFields() {
    return this.scales.map((scale) => scale.field);
  }

  /**
   * 根据名称获取度量
   * @param name
   */
  public getScale(name: string) {
    return this.scales[this.names.indexOf(name)];
  }

  /**
   * 默认的回调函数（用户没有自定义 callback，或者用户自定义 callback 返回空的时候，使用 values 映射）
   * @param params
   */
  private defaultCallback(...params: any[]): any[] {
    // 没有 params 的情况，是指没有指定 fields，直接返回配置的 values 常量
    if (params.length === 0) {
      return this.values;
    }

    return params.map((param, idx) => {
      const scale = this.scales[idx];

      return scale.type === 'identity' ? scale.values[0] : this._getAttributeValue(scale, param);
    });
  }

  // 解析配置
  private _parseCfg(cfg: AttributeCfg) {
    const { type = 'base', names = [], scales = [], values = [], callback } = cfg;

    this.type = type;

    this.scales = scales;
    this.values = values;
    this.names = names;

    // 构造 callback 方法
    this.callback = (...params: any[]): any[] => {
      /**
       * 当用户设置的 callback 返回 null 时, 应该返回默认 callback 中的值
       */
      if (callback) {
        // 使用用户返回的值处理
        const ret = callback(...params);
        if (!isNil(ret)) {
          return [ret];
        }
      }

      // 没有 callback 或者用户 callback 返回值为空，则使用默认的逻辑处理
      return this.defaultCallback.apply(this, params);
    };
  }

  // 获取属性值，将值映射到视觉通道
  private _getAttributeValue(scale: Scale, value: any) {
    // 如果是非线性的字段，直接从 values 中取值即可
    if (scale.isCategory && !this.linear) {
      // 离散 scale 变换成索引
      const idx = scale.translate(value) as number;
      return this.values[idx % this.values.length];
    }

    // 线性则使用线性值
    const percent = scale.scale(value);
    return this.getLinearValue(percent);
  }

  /**
   * 通过 scale 拿到数据对应的原始的参数
   * @param param
   * @param scale
   * @private
   */
  private _toOriginParam(param: any, scale: Scale) {
    // 是线性，直接返回
    // 非线性，使用 scale 变换
    return !scale.isLinear
      ? isArray(param)
        ? param.map((p: any) => toScaleString(scale, p))
        : toScaleString(scale, param)
      : param;
  }
}
