import { View } from '@antv/g2';
import { Interaction } from '../../types/interaction';
import { TreemapOptions } from './types';
export declare function findInteraction(interactions: TreemapOptions['interactions'], interactionType: string): undefined | Interaction;
export declare function enableInteraction(interactions: TreemapOptions['interactions'], interactionType: string): boolean;
/**
 * 是否允许下钻交互
 * @param interactions
 * @param interactionType
 * @returns
 */
export declare function enableDrillInteraction(options: TreemapOptions): boolean;
export declare function resetDrillDown(chart: View): void;
interface TransformDataOptions {
    data: TreemapOptions['data'];
    colorField: TreemapOptions['colorField'];
    enableDrillDown: boolean;
    hierarchyConfig: TreemapOptions['hierarchyConfig'];
}
export declare function transformData(options: TransformDataOptions): any[];
export {};
