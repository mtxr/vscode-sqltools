import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './shapes/circle';
import './shapes/square';
import { HeatmapOptions } from './types';
export type { HeatmapOptions };
export declare class Heatmap extends Plot<HeatmapOptions> {
    /**
     * 获取 柱形图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<HeatmapOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 获取直方图的适配器
     */
    protected getSchemaAdaptor(): Adaptor<HeatmapOptions>;
    /**
     * 获取 色块图 默认配置
     */
    protected getDefaultOptions(): Partial<HeatmapOptions>;
}
