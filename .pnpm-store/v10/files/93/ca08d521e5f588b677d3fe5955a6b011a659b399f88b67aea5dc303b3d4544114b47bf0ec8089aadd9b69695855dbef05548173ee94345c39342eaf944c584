import { Params } from '../../core/adaptor';
import { GeometryOptions, MappingOptions } from './base';
export interface PointGeometryOptions extends GeometryOptions {
    /** x 轴字段 */
    readonly xField?: string;
    /** y 轴字段 */
    readonly yField?: string;
    /** 分组字段 */
    readonly seriesField?: string;
    /** size 映射字段 */
    readonly sizeField?: string;
    /** shape 的映射字段 */
    readonly shapeField?: string;
    /** point 图形映射规则 */
    readonly point?: MappingOptions;
}
/**
 * point 辅助点的配置处理
 * @param params
 */
export declare function point<O extends PointGeometryOptions>(params: Params<O>): Params<O>;
