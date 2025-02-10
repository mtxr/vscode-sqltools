import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { BidirectionalBarOptions } from './types';
export type { BidirectionalBarOptions };
export declare class BidirectionalBar extends Plot<BidirectionalBarOptions> {
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<BidirectionalBarOptions>;
    /** 对称条形图分类字段 */
    static SERIES_FIELD_KEY: string;
    /** 图表类型 */
    type: string;
    /**
     * @override
     */
    changeData(data?: any[]): void;
    protected getDefaultOptions(): Partial<BidirectionalBarOptions>;
    /**
     * 获取对称条形图的适配器
     */
    protected getSchemaAdaptor(): Adaptor<BidirectionalBarOptions>;
}
