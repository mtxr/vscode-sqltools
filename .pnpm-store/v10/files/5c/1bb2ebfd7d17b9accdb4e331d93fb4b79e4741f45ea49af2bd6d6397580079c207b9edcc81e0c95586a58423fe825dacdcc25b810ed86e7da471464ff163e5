import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { BoxOptions } from './types';
export type { BoxOptions };
export declare class Box extends Plot<BoxOptions> {
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<BoxOptions>;
    /** 图表类型 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: any): void;
    /**
     * 获取 箱型图 默认配置项
     */
    protected getDefaultOptions(): Partial<BoxOptions>;
    /**
     * 获取 箱型图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<BoxOptions>;
}
