import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './interactions';
import { PieOptions } from './types';
export type { PieOptions };
export declare class Pie extends Plot<PieOptions> {
    /**
     * 获取 饼图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<PieOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 更新数据
     * @param data
     */
    changeData(data: PieOptions['data']): void;
    /**
     * 获取 饼图 默认配置项, 供 base 获取
     */
    protected getDefaultOptions(): Partial<PieOptions>;
    /**
     * 获取 饼图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<PieOptions>;
}
