import type { Constraint } from './constraint';
import type { Variable } from './variable';
/**
 * 约束布局构建和计算，目前针对 G2 的场景：
 * - 一定都是等式
 * - 一定有解
 * 所以将算法退化成多元一次方程组的解法，直接使用高斯消元法（o(n^2)）
 */
export declare class Solver {
    /**
     * 存在的约束
     */
    constraints: Constraint[];
    variables: Variable[];
    /**
     * 条件数量
     */
    private m;
    /**
     * 变量（元）数量
     */
    private n;
    /**
     * 添加多条约束
     * @param constraint
     */
    addConstraint(...constraints: Constraint[]): void;
    /**
     * 计算返回布局
     */
    calc(): Variable[];
    /**
     * 获取约束中所有的变量
     */
    private getVariables;
    /**
     * 获得高斯消元的矩阵
     */
    private getGaussMatrix;
}
