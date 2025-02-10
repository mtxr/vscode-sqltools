import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './interactions';
import { ScatterOptions } from './types';
export type { ScatterOptions };
export declare class Scatter extends Plot<ScatterOptions> {
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<ScatterOptions>;
    /** 图表类型 */
    type: string;
    constructor(container: string | HTMLElement, options: ScatterOptions);
    /**
     * @override
     * @param data
     */
    changeData(data: ScatterOptions['data']): void;
    /**
     * 获取 散点图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<ScatterOptions>;
    protected getDefaultOptions(): Partial<ScatterOptions>;
}
