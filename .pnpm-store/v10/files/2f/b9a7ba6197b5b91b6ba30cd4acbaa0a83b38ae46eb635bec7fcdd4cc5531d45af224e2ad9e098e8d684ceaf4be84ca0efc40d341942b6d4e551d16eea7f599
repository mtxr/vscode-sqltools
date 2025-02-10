import { View } from '../../../../chart';
import { Point } from '../../../../interface';
import TooltipAction from './geometry';
/**
 * 存在多个 view 时，控制其他 view 上的 tooltip 显示
 * @ignore
 */
declare class SiblingTooltip extends TooltipAction {
    /**
     * 所有同一层级的 tooltip 显示
     * @param view
     * @param point
     */
    protected showTooltip(view: View, point: Point): void;
    /**
     * 隐藏同一层级的 tooltip
     * @param view
     */
    protected hideTooltip(view: any): void;
}
export default SiblingTooltip;
