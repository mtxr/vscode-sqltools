import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { ViolinOptions } from './types';
export type { ViolinOptions };
export declare class Violin extends Plot<ViolinOptions> {
    /**
     * 获取 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<ViolinOptions>;
    /** 图表类型 */
    type: string;
    /**
     * @override
     */
    changeData(data: ViolinOptions['data']): void;
    /**
     * 获取 小提琴图 默认配置项
     */
    protected getDefaultOptions(): Partial<ViolinOptions>;
    /**
     * 获取 小提琴图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<ViolinOptions>;
}
