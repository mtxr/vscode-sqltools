import Base from '../base';
import { ScaleType } from '../types';
/**
 * identity scale原则上是定义域和值域一致，scale/invert方法也是一致的
 * 参考R的实现：https://github.com/r-lib/scales/blob/master/R/pal-identity.r
 * 参考d3的实现（做了下转型）：https://github.com/d3/d3-scale/blob/master/src/identity.js
 */
export default class Identity extends Base {
    readonly type: ScaleType;
    readonly isIdentity: boolean;
    calculateTicks(): any[];
    scale(value: any): number;
    invert(value?: number): number;
}
