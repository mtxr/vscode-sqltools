import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { AreaOptions } from './types';
export type { AreaOptions };
export declare class Area extends Plot<AreaOptions> {
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<AreaOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 获取 面积图 默认配置
     */
    protected getDefaultOptions(): Partial<AreaOptions>;
    /**
     * @override
     * @param data
     */
    changeData(data: AreaOptions['data']): void;
    /**
     * 获取 面积图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<AreaOptions>;
}
