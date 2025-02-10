import View from '../../chart/view';
import { Point, ShapeAttrs } from '../../dependents';
import { TooltipCfg } from '../../interface';
import Action from './base';
export declare function getItemsOfView(view: View, point: Point, tooltipCfg: TooltipCfg): any[];
/**
 * 背景框的 Action. 只作用于 interval 和 schema geometry
 * @ignore
 */
declare class ActiveRegion extends Action {
    private items;
    private regionPath;
    /**
     * 显示
     * @param {ShapeAttrs} style region-path 的样式
     * @param {number} appendRatio 适用于笛卡尔坐标系. 对于 x 轴非 linear 类型: 默认：0.25, x 轴 linear 类型: 默认 0
     * @param {number} appendWidth  适用于笛卡尔坐标系. 像素级别，优先级 > appendRatio
     */
    show(args?: {
        style: ShapeAttrs;
        appendRatio?: number;
        appendWidth?: number;
    }): void;
    /**
     * 隐藏
     */
    hide(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
export default ActiveRegion;
