import { ShapeAttrs } from '@antv/g2';
import { Params } from '../../core/adaptor';
import { GeometryOptions, MappingOptions } from './base';
export interface IntervalGeometryOptions extends GeometryOptions {
    /** x 轴字段 */
    readonly xField: string;
    /** y 轴字段 */
    readonly yField: string;
    /** 拆分字段，在分组柱状图下同 groupField、colorField，在堆积柱状图下同 stackField、colorField  */
    readonly seriesField?: string;
    /** 是否分组柱形图 */
    readonly isGroup?: boolean;
    /** 是否堆积柱状图 */
    readonly isStack?: boolean;
    /** 柱状图宽度占比 [0-1] */
    readonly widthRatio?: number;
    /** 分组间柱子之间的组间间距(像素级)，仅对分组柱状图适用 */
    readonly intervalPadding?: number;
    /** 分组中柱子之间的间距 [0-1]，仅对分组柱状图适用 */
    readonly marginRatio?: number;
    /** 分组中柱子之间的组内间距(像素级)，仅对分组柱状图适用 */
    readonly dodgePadding?: number;
    /** 柱状图最小宽度（像素） */
    readonly minColumnWidth?: number;
    /** 柱状图最大宽度（像素） */
    readonly maxColumnWidth?: number;
    /** 柱子的背景样式设置 */
    readonly columnBackground?: {
        style: ShapeAttrs;
    };
    /** 柱子视觉通道配置（含 color、shape、size、style、tooltip） */
    readonly interval?: MappingOptions;
    /** 分组字段，优先级高于 seriesField , isGroup: true 时会根据 groupField 进行分组。*/
    readonly groupField?: string;
}
export declare function interval<O extends IntervalGeometryOptions>(params: Params<O>): Params<O>;
