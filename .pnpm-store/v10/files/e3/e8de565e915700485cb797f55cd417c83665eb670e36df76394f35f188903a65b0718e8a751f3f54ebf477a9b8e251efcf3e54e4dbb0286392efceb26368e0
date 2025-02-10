import { Types } from '@antv/g2';
import { CirclePackingOptions } from './types';
interface TransformDataOptions {
    data: CirclePackingOptions['data'];
    rawFields: CirclePackingOptions['rawFields'];
    enableDrillDown: boolean;
    hierarchyConfig: CirclePackingOptions['hierarchyConfig'];
}
/**
 * circle-packing 数据转换
 * @param options
 */
export declare function transformData(options: TransformDataOptions): any[];
/**
 * 根据传入的 padding 和 现有的 画布大小， 输出针对圆形视图布局需要的 finalPadding 以及 finalSize
 * @param params
 */
export declare function resolvePaddingForCircle(padding: Types.ViewPadding, appendPadding: Types.ViewAppendPadding, containerSize: {
    width: number;
    height: number;
}): {
    finalPadding: number[];
    finalSize: number;
};
export {};
