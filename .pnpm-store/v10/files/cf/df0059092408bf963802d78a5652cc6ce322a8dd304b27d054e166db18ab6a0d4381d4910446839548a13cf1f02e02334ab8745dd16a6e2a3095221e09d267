import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { RoseOptions } from './types';
export type { RoseOptions };
export declare class Rose extends Plot<RoseOptions> {
    /**
     * 获取 玫瑰图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<RoseOptions>;
    /** 玫瑰图 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: any): void;
    /**
     * 获取默认的 options 配置项
     */
    protected getDefaultOptions(): Partial<RoseOptions>;
    /**
     * 获取 玫瑰图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<RoseOptions>;
}
