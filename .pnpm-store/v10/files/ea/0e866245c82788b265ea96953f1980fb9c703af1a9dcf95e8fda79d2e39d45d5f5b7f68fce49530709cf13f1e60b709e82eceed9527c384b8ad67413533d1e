import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { TinyColumnOptions } from './types';
export type { TinyColumnOptions };
export declare class TinyColumn extends Plot<TinyColumnOptions> {
    /**
     * 获取默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyColumnOptions>;
    /** 图表类型 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: TinyColumnOptions['data']): void;
    protected getDefaultOptions(): Partial<TinyColumnOptions>;
    /**
     * 获取 迷你柱形图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<TinyColumnOptions>;
}
