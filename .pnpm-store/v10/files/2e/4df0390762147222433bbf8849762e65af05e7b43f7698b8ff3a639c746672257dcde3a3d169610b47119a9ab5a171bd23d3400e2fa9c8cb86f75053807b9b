import { Params } from '../../core/adaptor';
import { GeometryOptions, MappingOptions } from './base';
export interface EdgeGeometryOptions extends GeometryOptions {
    /** x 轴字段 */
    readonly xField?: string;
    /** y 轴字段 */
    readonly yField?: string;
    /** 分组颜色字段 */
    readonly seriesField?: string;
    /** edge 图形映射规则 */
    readonly edge?: MappingOptions;
}
/**
 * edge 的配置处理
 * @param params
 */
export declare function edge<O extends EdgeGeometryOptions>(params: Params<O>): Params<O>;
