import { Data, Meta, Options } from '../types';
import { NodeLinkData } from '../types/relation-data';
/**
 * 查看数据是否是全负数、或者全正数
 * @param data
 * @param field
 */
export declare function adjustYMetaByZero(data: Data, field: string): Meta;
/**
 * 转换数据格式为带有节点与边的数据格式
 * @param data
 * @param sourceField
 * @param targetField
 * @param weightField
 * @param rawFields 存放一些原数据
 */
export declare function transformDataToNodeLinkData(data: Data, sourceField: string, targetField: string, weightField: string, rawFields?: string[]): NodeLinkData;
/**
 * 处理不合法的数据(过滤 非数值型 和 NaN，保留 null)
 * @param data
 * @param angleField
 */
export declare function processIllegalData(data: Options['data'], field: string): Record<string, any>[];
