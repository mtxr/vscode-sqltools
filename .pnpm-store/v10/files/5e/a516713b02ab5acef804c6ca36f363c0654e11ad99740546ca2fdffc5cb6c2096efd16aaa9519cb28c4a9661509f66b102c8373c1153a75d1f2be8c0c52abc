import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import './interactions';
import { RadarOptions } from './types';
export type { RadarOptions };
export declare class Radar extends Plot<RadarOptions> {
    /** 图表类型 */
    type: string;
    /**
     * @override
     * @param data
     */
    changeData(data: any): void;
    /**
     * 获取 雷达图 默认配置
     */
    protected getDefaultOptions(): Partial<RadarOptions>;
    /**
     * 获取 雷达图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<RadarOptions>;
}
