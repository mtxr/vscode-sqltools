import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { BarOptions } from './types';
export type { BarOptions };
/**
 * 条形图
 */
export declare class Bar extends Plot<BarOptions> {
    /**
     * 获取 条形图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<BarOptions>;
    /** 图表类型 */
    readonly type: string;
    /**
     * @override
     */
    changeData(data: BarOptions['data']): void;
    /**
     * 获取 条形图 默认配置
     */
    protected getDefaultOptions(): Partial<BarOptions>;
    /**
     * 获取 条形图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<BarOptions>;
}
