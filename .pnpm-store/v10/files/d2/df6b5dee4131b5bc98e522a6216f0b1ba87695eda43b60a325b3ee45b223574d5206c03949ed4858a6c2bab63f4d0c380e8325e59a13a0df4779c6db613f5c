import { StateCondition, StateName, StateObject } from '../..';
import { Adaptor } from '../../core/adaptor';
import { Plot } from '../../core/plot';
import { FUNNEL_CONVERSATION as FUNNEL_CONVERSATION_FIELD } from './constant';
import './interactions';
import { FunnelOptions } from './types';
export type { FunnelOptions };
export { FUNNEL_CONVERSATION_FIELD };
export declare class Funnel extends Plot<FunnelOptions> {
    /** 图表类型 */
    type: string;
    static getDefaultOptions(): Partial<FunnelOptions>;
    /** 漏斗 转化率 字段 */
    static CONVERSATION_FIELD: string;
    /** 漏斗 百分比 字段 */
    static PERCENT_FIELD: string;
    /** 漏斗 总转换率百分比 字段 */
    static TOTAL_PERCENT_FIELD: string;
    /**
     * 获取 漏斗图 默认配置项
     */
    protected getDefaultOptions(): Partial<FunnelOptions>;
    /**
     * 获取 漏斗图 的适配器
     */
    protected getSchemaAdaptor(): Adaptor<FunnelOptions>;
    /**
     * 设置状态
     * @param type 状态类型，支持 'active' | 'inactive' | 'selected' 三种
     * @param conditions 条件，支持数组
     * @param status 是否激活，默认 true
     */
    setState(type: StateName, condition: StateCondition, status?: boolean): void;
    /**
     * 获取状态
     */
    getStates(): StateObject[];
}
