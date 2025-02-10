import { MappingDatum } from '../interface';
import Path, { PathCfg } from './path';
import './shape/area';
/** Area 几何标记构造函数参数 */
export interface AreaCfg extends PathCfg {
    /**
     * 面积图是否从 0 基准线开始填充。
     * 1. 默认值为 `true`，表现如下：
     * ![image](https://gw.alipayobjects.com/zos/rmsportal/ZQqwUCczalrKqGgagOVp.png)
     * 2. 当值为 `false` 时，表现如下：
     * ![image](https://gw.alipayobjects.com/zos/rmsportal/yPswkaXvUpCYOdhocGwB.png)
     */
    startOnZero?: boolean;
}
/**
 * Area 几何标记类。
 * 常用于绘制面积图。
 */
export default class Area extends Path {
    readonly type: string;
    readonly shapeType: string;
    /** 生成图形关键点 */
    readonly generatePoints: boolean;
    /**
     * 面积图是否从 0 基准线开始填充。
     * 1. 默认值为 `true`，表现如下：
     * ![image](https://gw.alipayobjects.com/zos/rmsportal/ZQqwUCczalrKqGgagOVp.png)
     * 2. 当值为 `false` 时，表现如下：
     * ![image](https://gw.alipayobjects.com/zos/rmsportal/yPswkaXvUpCYOdhocGwB.png)
     */
    readonly startOnZero: boolean;
    constructor(cfg: AreaCfg);
    /**
     * 获取图形绘制的关键点以及数据
     * @param mappingData 映射后的数据
     */
    protected getPointsAndData(mappingData: MappingDatum[]): {
        points: any[];
        data: any[];
    };
    /**
     * 获取 Y 轴上的最小值
     * @returns y 字段最小值
     */
    protected getYMinValue(): number;
}
