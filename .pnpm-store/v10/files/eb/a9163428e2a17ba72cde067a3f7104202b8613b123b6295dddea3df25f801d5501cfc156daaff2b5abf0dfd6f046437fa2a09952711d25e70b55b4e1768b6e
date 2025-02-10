import { AdjustCfg, Data, Range } from '../interface';
export declare type AdjustConstructor = new (cfg: any) => Adjust;
export interface DimValuesMapType {
    [dim: string]: number[];
}
export default abstract class Adjust {
    /** 参与调整的维度 */
    adjustNames: string[];
    /** x 维度对应的字段 */
    xField: string;
    /** y 维度对应的字段 */
    yField: string;
    /** 调整占单位宽度的比例，例如：占 2 个分类间距的 1 / 2 */
    dodgeRatio: number;
    /** 调整过程中 2 个数据的间距，以 dodgeRatio 为分母 */
    marginRatio: number;
    /** 指定进行 dodge 的字段 */
    dodgeBy: string;
    /** 自定义 offset */
    customOffset: ((data: any, range: any) => number) | number;
    height: number;
    size: number;
    reverseOrder: boolean;
    /** 像素级组间距 */
    intervalPadding: number;
    /** 像素级组内间距 */
    dodgePadding: number;
    /** x维度长度，计算归一化padding使用 */
    xDimensionLegenth: number;
    /** 分组数 */
    groupNum: number;
    /** 用户配置宽度 */
    defaultSize: number;
    /** 最大宽度约束 */
    maxColumnWidth: number;
    /** 最小宽度约束 */
    minColumnWidth: number;
    /** 宽度比例 */
    columnWidthRatio: number;
    /** 用户自定义的dimValuesMap */
    dimValuesMap: DimValuesMapType;
    constructor(cfg: AdjustCfg & {
        dimValuesMap?: DimValuesMapType;
    });
    abstract process(dataArray: Data[][]): Data[][];
    /**
     * 查看维度是否是 adjust 字段
     * @param dim
     */
    isAdjust(dim: string): boolean;
    protected getAdjustRange(dim: string, dimValue: number, values: number[]): Range;
    protected adjustData(groupedDataArray: Data[][], mergedData: Data[]): void;
    /**
     * 对数据进行分组adjustData
     * @param data 数据
     * @param dim 分组的字段
     * @return 分组结果
     */
    protected groupData(data: Data[], dim: string): {
        [dim: string]: Data[];
    };
    /** @override */
    protected adjustDim(dim: string, values: number[], data: Data[], index?: number): void;
    /**
     * 获取可调整度量对应的值
     * @param mergedData 数据
     * @return 值的映射
     */
    private getDimValues;
}
