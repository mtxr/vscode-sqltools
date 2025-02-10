import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { FacetOptions } from './types';
export type { FacetOptions };
export declare class Facet extends Plot<FacetOptions> {
    /**
     * 获取 分面图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<FacetOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 获取 分面图 默认配置
     */
    protected getDefaultOptions(): Partial<FacetOptions<keyof import("@antv/g2/lib/interface").FacetCfgMap>>;
    /**
     * 获取 分面图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<FacetOptions>;
}
