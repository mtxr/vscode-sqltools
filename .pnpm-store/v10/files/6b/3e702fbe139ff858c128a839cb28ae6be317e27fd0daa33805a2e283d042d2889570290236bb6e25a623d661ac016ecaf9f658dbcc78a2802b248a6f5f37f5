import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './interactions';
import { LineOptions } from './types';
export type { LineOptions };
export declare class Line extends Plot<LineOptions> {
    /**
     * 获取 折线图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<LineOptions>;
    /** 图表类型 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: LineOptions['data']): void;
    /**
     * 获取 折线图 默认配置
     */
    protected getDefaultOptions(): Partial<LineOptions>;
    /**
     * 获取 折线图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<LineOptions>;
}
