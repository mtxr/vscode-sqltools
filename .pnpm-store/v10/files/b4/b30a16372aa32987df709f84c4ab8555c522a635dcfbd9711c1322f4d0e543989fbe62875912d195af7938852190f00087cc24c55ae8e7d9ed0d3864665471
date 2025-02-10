import { Types } from '@antv/g2';
import { Params } from '../../../core/adaptor';
import { Data, Datum } from '../../../types/common';
import { FunnelOptions } from '../types';
export declare const CONVERSION_TAG_NAME = "CONVERSION_TAG_NAME";
/**
 * 漏斗图 transform
 * @param geometry
 */
export declare function transformData(data: FunnelOptions['data'], originData: FunnelOptions['data'], options: Pick<FunnelOptions, 'yField' | 'maxSize' | 'minSize'>): FunnelOptions['data'];
/**
 * 漏斗图通用转化率组件
 * @param getLineCoordinate 用于获取特定的 line 的位置及配置
 */
export declare function conversionTagComponent(getLineCoordinate: (datum: Datum, datumIndex: number, data: Data, initLineOption: Record<string, any>) => Types.LineOption): (params: Params<FunnelOptions>) => Params<FunnelOptions>;
