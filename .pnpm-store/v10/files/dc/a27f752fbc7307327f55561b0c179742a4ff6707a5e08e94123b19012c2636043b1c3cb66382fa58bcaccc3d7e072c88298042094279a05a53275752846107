import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { RingProgressOptions } from './types';
export type { RingProgressOptions };
export declare class RingProgress extends Plot<RingProgressOptions> {
    /**
     * 获取默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<RingProgressOptions>;
    /** 图表类型 */
    type: string;
    /**
     * 更新数据
     * @param percent
     */
    changeData(percent: number): void;
    protected getDefaultOptions(): Partial<RingProgressOptions>;
    /**
     * 获取 环形进度图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<RingProgressOptions>;
}
