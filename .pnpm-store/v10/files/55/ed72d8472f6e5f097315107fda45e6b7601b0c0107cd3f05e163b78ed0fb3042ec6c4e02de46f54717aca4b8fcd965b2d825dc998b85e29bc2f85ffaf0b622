import { BBox, IGroup, IShape } from '../../../dependents';
import { LabelItem } from '../interface';
/** limitInPlot layout 的可选配置 */
export interface LimitInPlotLayoutCfg {
    /** 需要限制哪些方向上不能超过 Plot 范围，默认四个方向上都限制 */
    direction?: ('top' | 'right' | 'bottom' | 'left')[];
    /** 可以允许的 margin */
    margin?: number;
    /** 超过限制后的动作，默认 translate 移动位置; ellipsis 对 text 进行省略展示 */
    action?: 'hide' | 'translate' | 'ellipsis';
}
/**
 * @ignore
 * 将 label 限制在 Plot 范围内，将超出 Plot 范围的 label 可选择进行隐藏或者移动位置
 * @param labels
 * @param cfg
 */
export declare function limitInPlot(items: LabelItem[], labels: IGroup[], shapes: IShape[] | IGroup[], region: BBox, cfg?: LimitInPlotLayoutCfg): void;
