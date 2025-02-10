import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { HistogramOptions } from './types';
export type { HistogramOptions };
export declare class Histogram extends Plot<HistogramOptions> {
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<HistogramOptions>;
    /** 图表类型 */
    type: string;
    changeData(data: HistogramOptions['data']): void;
    /**
     * 获取直方图的适配器
     */
    protected getDefaultOptions(): Partial<HistogramOptions>;
    /**
     * 获取直方图的适配器
     */
    protected getSchemaAdaptor(): Adaptor<HistogramOptions>;
}
