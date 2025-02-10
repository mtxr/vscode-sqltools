import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { TinyAreaOptions } from './types';
export type { TinyAreaOptions };
export declare class TinyArea extends Plot<TinyAreaOptions> {
    /**
     * 获取默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyAreaOptions>;
    /** 图表类型 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: TinyAreaOptions['data']): void;
    protected getDefaultOptions(): Partial<TinyAreaOptions>;
    /**
     * 获取 迷你面积图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<TinyAreaOptions>;
}
