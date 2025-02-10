import Scale from './base';
import { ScaleConfig } from './types';
declare type ScaleConstructor<T extends Scale = Scale> = new (cfg: ScaleConfig) => T;
declare function getClass(key: string): ScaleConstructor;
declare function registerClass(key: string, cls: ScaleConstructor): void;
export { Scale, getClass as getScale, registerClass as registerScale };
