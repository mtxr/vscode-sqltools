import { CoordinateCtor } from './coord/base';

// 所有的 Coordinate map
const COORDINATE_MAP: Record<string, CoordinateCtor> = {};

/**
 * 通过类型获得 coordinate 类
 * @param type
 */
export const getCoordinate = (type: string): CoordinateCtor => {
  return COORDINATE_MAP[type.toLowerCase()];
};

/**
 * 注册 coordinate 类
 * @param type
 * @param ctor
 */
export const registerCoordinate = (type: string, ctor: CoordinateCtor): void => {
  // 存储到 map 中
  COORDINATE_MAP[type.toLowerCase()] = ctor;
};

export * from './interface';
