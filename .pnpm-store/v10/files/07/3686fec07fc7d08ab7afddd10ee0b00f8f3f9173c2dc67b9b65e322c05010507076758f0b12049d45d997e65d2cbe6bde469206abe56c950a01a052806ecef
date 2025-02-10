import { Operator, Element } from './types';
import { Variable } from './variable';
/**
 * 定义一个约束条件
 */
export declare class Constraint {
    /**
     * 操作符
     */
    operator: Operator;
    /**
     * 方程组四则运算 + 连接的内容
     */
    elements: Element[];
    constructor(operator: Operator, ...elements: any[]);
    /**
     * 获得表达式中所有的变量
     */
    getVariables(): Variable[];
    /**
     * 获得方程组的高斯矩阵数组
     * 按照指定的 variable 顺序
     * @param variableMap 变量对应的 idx
     */
    getGaussArr(variableMap: Map<Variable, number>): any[];
    /**
     * 解析 element，产生 [a, variable]
     * @param element
     */
    private parseElement;
}
