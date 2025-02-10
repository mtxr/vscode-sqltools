import { BoxObject } from './types';
import { Variable } from './variable';
/**
 * 定义一个布局元素的大小，其实就是包含有四个变量
 */
export declare class Bounds {
    /**
     * x 变量
     */
    x: Variable;
    /**
     * y 变量
     */
    y: Variable;
    /**
     * width 变量
     */
    width: Variable;
    /**
     * height 变量
     */
    height: Variable;
    /**
     * bounds 的名字
     */
    name: string;
    constructor(name: string);
    /**
     * 最终的布局信息
     */
    get bbox(): BoxObject;
}
