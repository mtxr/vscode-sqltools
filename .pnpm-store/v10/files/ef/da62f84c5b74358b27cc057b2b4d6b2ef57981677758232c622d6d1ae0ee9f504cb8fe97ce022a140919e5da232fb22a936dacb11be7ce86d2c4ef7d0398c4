/**
 * @description 扩展方法，提供 gl-matrix 为提供的方法
 * */
import { mat3 } from 'gl-matrix';
export declare function leftTranslate(out: any, a: any, v: any): mat3;
export declare function leftRotate(out: any, a: any, rad: any): mat3;
export declare function leftScale(out: any, a: any, v: any): mat3;
/**
 * 根据 actions 来做 transform
 * @param m
 * @param actions
 */
export declare function transform(m: number[], actions: any[][]): any[];
/**
 * 向量 v1 到 向量 v2 夹角的方向
 * @param  {Array} v1 向量
 * @param  {Array} v2 向量
 * @return {Boolean} >= 0 顺时针 < 0 逆时针
 */
export declare function direction(v1: number[], v2: number[]): number;
/**
 * 二维向量 v1 到 v2 的夹角
 * @param v1
 * @param v2
 * @param direct
 */
export declare function angleTo(v1: [number, number], v2: [number, number], direct: boolean): number;
/**
 * 计算二维向量的垂直向量
 * @param out
 * @param v
 * @param flag
 */
export declare function vertical(out: number[], v: number[], flag: boolean): number[];
