import { AttributeCfg } from '../interface';
import Attribute from './base';

export default class Shape extends Attribute {
  constructor(cfg: AttributeCfg) {
    super(cfg);
    this.type = 'shape';
    this.names = ['shape'];
  }

  /**
   * @override
   */
  public getLinearValue(percent: number): string {
    const idx = Math.round((this.values.length - 1) * percent);
    return this.values[idx];
  }
}
