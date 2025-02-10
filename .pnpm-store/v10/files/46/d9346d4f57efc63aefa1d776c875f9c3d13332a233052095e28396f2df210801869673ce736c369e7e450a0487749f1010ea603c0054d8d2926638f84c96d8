import { Types } from '@antv/g2';
import { Datum } from '../../types';
import { BidirectionalBarOptions } from './types';
/**
 * bidirectional-bar 处理数据, 通过 SERIES_FIELD_KEY 字段分成左右数据
 * @param xField
 * @param yField
 * @param data
 */
export declare function transformData(xField: string, yField: string[], seriesField: string, data: Datum, reverse?: boolean): Types.Data[];
/**
 * 是否横向，默认空为横向
 * @param layout
 */
export declare function isHorizontal(layout: BidirectionalBarOptions['layout']): boolean;
/**
 * 多 view 进行同步 padding 的自定义逻辑
 * @param chart
 * @param views
 * @param p
 */
export declare function syncViewPadding(chart: any, views: any, p: any): void;
