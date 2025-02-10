import { View } from '../../../chart';
import { FilterCondition } from '../../../interface';
import RangeFilter from './range-filter';
/**
 * 数据范围过滤，但不在当前的 view 上生效，而在当前的 view 同一层级的其他 views 上生效，用于实现联动过滤。
 * @ignore
 */
declare class SiblingFilter extends RangeFilter {
    /**
     * 对 view 进行过滤
     * @param view
     * @param field
     * @param filter
     */
    protected filterView(view: View, field: string, filter: FilterCondition): void;
    /**
     * 重新渲染
     * @param view
     */
    protected reRender(view: View): void;
}
export default SiblingFilter;
