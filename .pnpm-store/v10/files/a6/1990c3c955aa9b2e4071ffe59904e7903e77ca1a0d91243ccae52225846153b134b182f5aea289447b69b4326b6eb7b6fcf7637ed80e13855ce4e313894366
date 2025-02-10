import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { StockOptions } from './types';
export type { StockOptions };
export declare class Stock extends Plot<StockOptions> {
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<StockOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 默认配置
     *  g2/g2plot默 认 配 置 -->  图 表 默 认 配 置  --> 开 发 者 自 定 义 配 置  --> 最 终 绘 图 配 置
     */
    protected getDefaultOptions(): Partial<StockOptions>;
    /**
     * 获取 蜡烛图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<StockOptions>;
    /**
     * @override
     * @param data
     */
    changeData(data: StockOptions['data']): void;
}
