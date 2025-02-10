import { AttributeCfg } from '../interface';
import Attribute from './base';
export type Value = number | string;
export type MappingValue = Value[] | Value;
export default class Position extends Attribute {
    constructor(cfg: AttributeCfg);
    mapping(x: MappingValue, y: MappingValue): (number | number[])[];
}
