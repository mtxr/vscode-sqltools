import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './interactions';
import { SunburstOptions } from './types';
export type { SunburstOptions };
export declare class Sunburst extends Plot<SunburstOptions> {
    /**
     * 获取 旭日图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<SunburstOptions>;
    /** 旭日图 节点的祖先节点 */
    static SUNBURST_ANCESTOR_FIELD: string;
    /** 旭日图 节点的路径 */
    static SUNBURST_PATH_FIELD: string;
    /** 节点的祖先节点 */
    static NODE_ANCESTORS_FIELD: string;
    /** 图表类型 */
    type: string;
    /**
     * 获取 旭日图 默认配置
     */
    protected getDefaultOptions(): Partial<SunburstOptions>;
    /**
     * 获取旭日图的适配器
     */
    protected getSchemaAdaptor(): Adaptor<SunburstOptions>;
}
