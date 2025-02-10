import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { WaterfallOptions } from './types';
export type { WaterfallOptions };
/**
 * 瀑布图
 */
export declare class Waterfall extends Plot<WaterfallOptions> {
    /**
     * 获取 瀑布图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<WaterfallOptions>;
    /** 图表类型 */
    readonly type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: any): void;
    /**
     * 获取 瀑布图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<WaterfallOptions>;
    /**
     * 获取 瀑布图 的默认配置
     */
    protected getDefaultOptions(): Partial<WaterfallOptions>;
}
