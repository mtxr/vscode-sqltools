import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './shapes/liquid';
import { LiquidOptions } from './types';
export { addWaterWave } from './shapes/liquid';
export type { LiquidOptions };
/**
 * 传说中的水波图
 */
export declare class Liquid extends Plot<LiquidOptions> {
    /**
     * 获取 饼图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<LiquidOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 获取 水波图 默认配置项, 供 base 获取
     */
    protected getDefaultOptions(): Partial<LiquidOptions>;
    /**
     * 更新数据
     * @param percent
     */
    changeData(percent: number): void;
    /**
     * 获取适配器
     */
    protected getSchemaAdaptor(): Adaptor<LiquidOptions>;
}
