import View from '../chart/view';
import { DIRECTION } from '../constant';
import { Attribute } from '../dependents';
import Geometry from '../geometry/base';
import { LegendCfg, LegendItem } from '../interface';
/**
 * @ignore
 * get the legend layout from direction
 * @param direction
 * @returns layout 'horizontal' | 'vertical'
 */
export declare function getLegendLayout(direction: DIRECTION): 'vertical' | 'horizontal';
/** item of @antv/component legend  */
type ComponentLegendItem = Omit<LegendItem, 'marker'> & {
    marker: any;
};
/**
 * @ignore
 * get the legend items
 * @param view
 * @param geometry
 * @param attr
 * @param themeMarker
 * @param markerCfg
 * @returns legend items
 */
export declare function getLegendItems(view: View, geometry: Geometry, attr: Attribute, themeMarker: object, userMarker: LegendCfg['marker']): ComponentLegendItem[];
/**
 *
 * @ignore
 * custom legend 的 items 获取
 * @param themeMarker
 * @param userMarker
 * @param customItems
 */
export declare function getCustomLegendItems(themeMarker: object, userMarker: object, customItems: LegendItem[]): LegendItem[];
/**
 * get the legend cfg from theme, will mix the common cfg of legend theme
 *
 * @param theme view theme object
 * @param direction legend direction
 * @returns legend theme cfg
 */
export declare function getLegendThemeCfg(theme: object, direction: string): object;
export {};
