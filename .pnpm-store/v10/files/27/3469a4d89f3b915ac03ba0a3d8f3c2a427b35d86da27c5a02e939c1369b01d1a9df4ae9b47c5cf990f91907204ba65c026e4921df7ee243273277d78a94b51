import { SimpleBBox } from '../types';
import { IShape } from '../interfaces';
type BoxMethod = (shape: IShape) => SimpleBBox;
const cache: Map<string, BoxMethod> = new Map<string, BoxMethod>();

/**
 * 注册计算包围盒的算法
 * @param type 方法名
 * @param method 方法
 */
export function register(type: string, method: BoxMethod) {
  cache.set(type, method);
}

/**
 * 获取计算包围盒的算法
 * @param type 方法名
 */
export function getMethod(type: string): BoxMethod {
  return cache.get(type);
}
