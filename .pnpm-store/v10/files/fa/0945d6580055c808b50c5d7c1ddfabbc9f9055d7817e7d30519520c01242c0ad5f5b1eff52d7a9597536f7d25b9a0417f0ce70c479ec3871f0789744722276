import { View } from '@antv/g2';
import { ScatterOptions } from './types';
type RenderOptions = {
    view: View;
    options: ScatterOptions;
};
type D3RegressionResult = {
    a?: number;
    b?: number;
    c?: number;
    coefficients?: number[];
    rSquared?: number;
};
/**
 * 获取四象限默认配置
 * @param {number} xBaseline
 * @param {number} yBaseline
 */
export declare function getQuadrantDefaultConfig(xBaseline: number, yBaseline: number): {
    [key: string]: any;
};
export declare const getPath: (config: RenderOptions) => any[];
/**
 * 调整散点图 meta: { min, max } ① data.length === 1 ② 所有数据 y 值相等 ③ 所有数据 x 值相等
 * @param options
 * @returns
 */
export declare const getMeta: (options: Pick<ScatterOptions, 'meta' | 'xField' | 'yField' | 'data'>) => ScatterOptions['meta'];
/**
 * 获取回归函数表达式
 * @param {string} type - 回归函数类型
 * @param {D3RegressionResult} res - 回归计算结果集
 * @return {string}
 */
export declare function getRegressionEquation(type: string, res: D3RegressionResult): string;
export {};
