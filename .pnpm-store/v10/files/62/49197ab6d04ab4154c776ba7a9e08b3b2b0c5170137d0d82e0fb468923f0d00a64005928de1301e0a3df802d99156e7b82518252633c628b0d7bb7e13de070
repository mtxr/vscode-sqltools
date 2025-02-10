import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './interactions';
import { TreemapOptions } from './types';
export type { TreemapOptions };
export declare class Treemap extends Plot<TreemapOptions> {
    /**
     * 获取 矩阵树图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TreemapOptions>;
    /** 图表类型 */
    type: string;
    /**
     * changeData
     */
    changeData(data: any): void;
    /**
     * 获取 矩阵树图 默认配置
     */
    protected getDefaultOptions(): Partial<TreemapOptions>;
    protected getSchemaAdaptor(): Adaptor<TreemapOptions>;
}
