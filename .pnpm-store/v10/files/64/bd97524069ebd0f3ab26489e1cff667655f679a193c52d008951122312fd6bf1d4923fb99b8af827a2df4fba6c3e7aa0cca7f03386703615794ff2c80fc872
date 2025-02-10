import { Data } from '../../types';
/**
 * 对数据进行百分比化
 * @param data
 * @param measure
 * @param groupField
 * @param as
 */
export declare function percent(data: Data, measure: string, groupField: string, as: string): {
    [x: string]: any;
}[];
/**
 * 对数据进行深层百分比化
 * @param data
 * @param measure  // 数值
 * @param fields // 需要分组的 field值
 * @param as // 存储percent 百分比的值
 */
export declare function getDeepPercent(data: Record<string, any>[], measure: string, fields: string[], percent: string): {
    [x: string]: any;
}[];
/**
 * 获取数据，如果是百分比，进行数据转换 (适用于面积图、柱状图、条形图)
 * @param isPercent 是否百分比
 */
export declare function getDataWhetherPercentage(data: Record<string, any>[], yField: string, groupField: string, asField: string, isPercent?: boolean): Record<string, any>[];
