import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './interactions';
import { CirclePackingOptions } from './types';
export type { CirclePackingOptions };
/**
 *  CirclePacking
 * @usage hierarchy, proportions
 */
export declare class CirclePacking extends Plot<CirclePackingOptions> {
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<CirclePackingOptions>;
    /** 图表类型 */
    type: string;
    protected getDefaultOptions(): Partial<CirclePackingOptions>;
    /**
     * 获取适配器
     */
    protected getSchemaAdaptor(): Adaptor<CirclePackingOptions>;
    /**
     * 覆写父类的方法
     */
    protected triggerResize(): void;
}
