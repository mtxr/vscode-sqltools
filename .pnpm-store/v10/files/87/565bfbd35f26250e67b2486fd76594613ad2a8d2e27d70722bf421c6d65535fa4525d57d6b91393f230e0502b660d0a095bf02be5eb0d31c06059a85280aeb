import type { Variable } from './variable';
/**
 * 操作符的枚举值
 */
export declare enum Operator {
    EQ = "eq"
}
export type BoxObject = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * 几种情况
 * - 200
 * - variable
 * - [200, 2]
 * - [2, variable]
 */
export type Element = Variable | number | (Variable | number)[];
