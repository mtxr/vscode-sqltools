import { Params } from '../../core/adaptor';
import { GeometryOptions, MappingOptions } from './base';
export interface PolygonGeometryOptions extends GeometryOptions {
    /** x 轴字段 */
    readonly xField?: string;
    /** y 轴字段 */
    readonly yField?: string;
    /** 分组字段 */
    readonly seriesField?: string;
    /** point 图形映射规则 */
    readonly polygon?: MappingOptions;
}
/**
 * polygon 的配置处理
 * @param params
 */
export declare function polygon<O extends PolygonGeometryOptions>(params: Params<O>): Params<O>;
