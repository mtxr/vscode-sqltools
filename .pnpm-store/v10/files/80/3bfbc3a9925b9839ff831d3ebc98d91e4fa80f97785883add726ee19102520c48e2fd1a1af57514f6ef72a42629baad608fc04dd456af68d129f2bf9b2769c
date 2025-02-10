import colorUtil from '@antv/color-util';
import { isString } from '@antv/util';
import { AttributeCfg } from '../interface';
import Attribute from './base';

export default class Color extends Attribute {
  public gradient: (percent: number) => string;

  constructor(cfg: AttributeCfg) {
    super(cfg);
    this.type = 'color';
    this.names = ['color'];

    if (isString(this.values)) {
      this.linear = true;
    }

    this.gradient = colorUtil.gradient(this.values);
  }

  /**
   * @override
   */
  public getLinearValue(percent: number): string {
    return this.gradient(percent);
  }
}
