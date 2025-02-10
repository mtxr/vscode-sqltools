import { MappingDatum } from '../interface';
import Geometry, { GeometryCfg } from './base';
/** 引入对应的 ShapeFactory */
import './shape/line';
/** Path 构造函数参数类型 */
export interface PathCfg extends GeometryCfg {
    /** 是否连接空值 */
    connectNulls?: boolean;
    /** 单个孤立数据点是否展示 */
    showSinglePoint?: boolean;
}
/**
 * Path 几何标记。
 * 用于绘制路径图等。
 */
export default class Path extends Geometry {
    readonly type: string;
    readonly shapeType: string;
    /** 是否连接空值 */
    connectNulls: boolean;
    /** 单个孤立数据点是否展示 */
    showSinglePoint: boolean;
    constructor(cfg: PathCfg);
    /**
     * 创建所有的 Element 实例，对于 Path、Line、Area，一组数据对应一个 Element。
     * @param mappingData
     * @param [isUpdate]
     * @returns elements
     */
    protected updateElements(mappingDataArray: MappingDatum[][], isUpdate?: boolean): void;
    /**
     * 获取组成一条线（一组数据）的所有点以及数据
     * @param mappingData 映射后的数组
     */
    protected getPointsAndData(mappingData: MappingDatum[]): {
        points: any[];
        data: any[];
    };
    private getShapeInfo;
}
