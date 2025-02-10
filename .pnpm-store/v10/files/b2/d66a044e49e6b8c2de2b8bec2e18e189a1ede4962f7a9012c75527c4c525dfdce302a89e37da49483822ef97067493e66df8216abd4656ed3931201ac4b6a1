import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { Data } from '../../types';
import './interactions';
import { SankeyOptions } from './types';
export type { SankeyOptions };
/**
 *  桑基图 Sankey
 */
export declare class Sankey extends Plot<SankeyOptions> {
    /** 图表类型 */
    type: string;
    static getDefaultOptions(): Partial<SankeyOptions>;
    /**
     * @override
     * @param data
     */
    changeData(data: Data): void;
    /**
     * 获取适配器
     */
    protected getSchemaAdaptor(): Adaptor<SankeyOptions>;
    /**
     * 获取 条形图 默认配置
     */
    protected getDefaultOptions(): Partial<SankeyOptions>;
}
