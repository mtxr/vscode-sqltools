import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { TinyLineOptions } from './types';
export type { TinyLineOptions };
export declare class TinyLine extends Plot<TinyLineOptions> {
    /**
     * 获取默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyLineOptions>;
    /** 图表类型 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: TinyLineOptions['data']): void;
    protected getDefaultOptions(): Partial<TinyLineOptions>;
    /**
     * 获取 迷你折线图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<TinyLineOptions>;
}
