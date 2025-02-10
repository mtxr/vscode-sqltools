import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { ColumnOptions } from './types';
export type { ColumnOptions };
/**
 * 柱形图
 */
export declare class Column extends Plot<ColumnOptions> {
    /**
     * 获取 柱形图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<ColumnOptions>;
    /** 图表类型 */
    readonly type: string;
    /**
     * @override
     */
    changeData(data: ColumnOptions['data']): void;
    /**
     * 获取 柱形图 默认配置
     */
    protected getDefaultOptions(): Partial<ColumnOptions>;
    /**
     * 获取 柱形图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<ColumnOptions>;
}
