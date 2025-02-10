import { BBox, IGroup, IShape } from '../../../dependents';
import { LabelItem } from '../interface';
/**
 * label 防遮挡布局：在不改变 label 位置的情况下对相互重叠的 label 进行隐藏（非移除）
 * 不同于 'overlap' 类型的布局，该布局不会对 label 的位置进行偏移调整。
 * @param labels 参与布局调整的 label 数组集合
 */
export declare function hideOverlap(labelItems: LabelItem[], labels: IGroup[], shapes: IShape[] | IGroup[], region: BBox): Promise<void>;
