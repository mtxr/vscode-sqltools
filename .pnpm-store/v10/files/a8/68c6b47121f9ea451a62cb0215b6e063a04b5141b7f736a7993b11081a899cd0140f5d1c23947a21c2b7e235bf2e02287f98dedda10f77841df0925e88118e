import { isArray, isNil } from '@antv/util';
import { AttributeCfg } from '../interface';
import Attribute from './base';

export type Value = number | string;
export type MappingValue = Value[] | Value;

export default class Position extends Attribute {
  constructor(cfg: AttributeCfg) {
    super(cfg);
    this.names = ['x', 'y'];
    this.type = 'position';
  }

  public mapping(x: MappingValue, y: MappingValue) {
    const [scaleX, scaleY] = this.scales;

    if (isNil(x) || isNil(y)) {
      return [];
    }

    return [
      isArray(x) ? x.map((xi) => scaleX.scale(xi)) : scaleX.scale(x),
      isArray(y) ? y.map((yi) => scaleY.scale(yi)) : scaleY.scale(y),
    ];
  }
}
