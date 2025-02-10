import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';
declare type BoxMethod = (shape: IShape) => SimpleBBox;
/**
 * 注册计算包围盒的算法
 * @param type 方法名
 * @param method 方法
 */
export declare function register(type: string, method: BoxMethod): void;
/**
 * 获取计算包围盒的算法
 * @param type 方法名
 */
export declare function getMethod(type: string): BoxMethod;
export {};
