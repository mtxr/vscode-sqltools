import * as d3Ease from 'd3-ease';

type EaseFn = (t: number) => number;

interface EasingMap {
  [key: string]: EaseFn;
}

const EASING_MAP: EasingMap = {};

/**
 * 根据名称获取对应的动画缓动函数
 * @param type 动画缓动函数名称
 */
export function getEasing(type: string) {
  // 默认从 d3-ease 中获取
  return EASING_MAP[type.toLowerCase()] || d3Ease[type];
}

/**
 * 注册动画缓动函数
 * @param type 动画缓动函数名称
 * @param easeFn 动画缓动函数
 */
export function registerEasing(type: string, easeFn: EaseFn) {
  EASING_MAP[type.toLowerCase()] = easeFn;
}
