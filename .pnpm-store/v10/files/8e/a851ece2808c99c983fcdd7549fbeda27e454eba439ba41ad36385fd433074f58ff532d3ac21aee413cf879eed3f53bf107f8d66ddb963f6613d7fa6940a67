import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './shapes/indicator';
import './shapes/meter-gauge';
import { GaugeOptions } from './types';
export type { GaugeOptions };
/**
 * 仪表盘
 */
export declare class Gauge extends Plot<GaugeOptions> {
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<GaugeOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 更新数据
     * @param percent
     */
    changeData(percent: number): void;
    /**
     * 获取默认配置
     * 供 base 使用
     */
    protected getDefaultOptions(): Partial<GaugeOptions>;
    /**
     * 获取适配器
     */
    protected getSchemaAdaptor(): Adaptor<GaugeOptions>;
}
