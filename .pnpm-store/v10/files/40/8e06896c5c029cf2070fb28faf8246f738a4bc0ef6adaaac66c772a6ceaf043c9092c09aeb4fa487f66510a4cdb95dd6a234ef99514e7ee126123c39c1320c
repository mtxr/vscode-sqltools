import { BBox, IGroup, IShape } from '../../../dependents';
import { LabelItem } from '../interface';
/**
 * @ignore
 * label 防遮挡布局：在不改变 label 位置的情况下对相互重叠的 label 进行调整。
 * 不同于 'overlap' 类型的布局，该布局不会对 label 的位置进行偏移调整。
 * @param labels 参与布局调整的 label 数组集合
 */
export declare function fixedOverlap(items: LabelItem[], labels: IGroup[], shapes: IShape[] | IGroup[], region: BBox): void;
/**
 * @ignore
 * label 防遮挡布局：为了防止 label 之间相互覆盖同时保证尽可能多 的 label 展示，通过尝试将 label 向**四周偏移**来剔除放不下的 label
 * @param labels 参与布局调整的 label 数组集合
 */
export declare function overlap(items: LabelItem[], labels: IGroup[], shapes: IShape[] | IGroup[], region: BBox): void;
