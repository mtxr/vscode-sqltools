import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { ProgressOptions } from './types';
export type { ProgressOptions };
export declare class Progress extends Plot<ProgressOptions> {
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<ProgressOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 更新数据
     * @param percent
     */
    changeData(percent: number): void;
    protected getDefaultOptions(): Partial<ProgressOptions>;
    /**
     * 获取 进度图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<ProgressOptions>;
}
