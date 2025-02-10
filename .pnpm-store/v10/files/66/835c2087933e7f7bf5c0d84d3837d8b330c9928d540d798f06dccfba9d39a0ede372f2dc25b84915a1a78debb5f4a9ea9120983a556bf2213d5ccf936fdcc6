import { Point } from '../../../dependents';
import { FilterCondition, EventPayload } from '../../../interface';
import { View } from '../../../chart';
import Action from '../base';
/** range-filter 只用于：brush-filter, brush-x-filter, brush-y-filter */
declare enum EVENTS {
    FILTER = "brush-filter-processing",
    RESET = "brush-filter-reset",
    BEFORE_FILTER = "brush-filter:beforefilter",
    AFTER_FILTER = "brush-filter:afterfilter",
    BEFORE_RESET = "brush-filter:beforereset",
    AFTER_RESET = "brush-filter:afterreset"
}
export { EVENTS as BRUSH_FILTER_EVENTS };
/**
 * 范围过滤的 Action
 * @ignore
 */
declare class RangeFilter extends Action {
    /** 允许外部传入 dims */
    protected cfgFields: ['dims'];
    /**
     * 范围过滤生效的字段/维度，可以是 x, y
     */
    protected dims: string[];
    /** 起始点 */
    protected startPoint: Point;
    private isStarted;
    private hasDim;
    /**
     * 开始范围过滤，记录范围过滤的起点
     */
    start(): void;
    /**
     * 过滤，以开始的点和当前点对数据进行过滤
     */
    filter(): void;
    /**
     * 结束
     */
    end(): void;
    /**
     * 取消同当前 Action 相关的过滤，指定的 x,y
     */
    reset(): void;
    /**
     * 对 view 进行过滤
     */
    protected filterView(view: View, field: string, filter: FilterCondition): void;
    /**
     * 重新渲染
     * @param view
     */
    protected reRender(view: View, payload?: EventPayload): void;
}
export default RangeFilter;
