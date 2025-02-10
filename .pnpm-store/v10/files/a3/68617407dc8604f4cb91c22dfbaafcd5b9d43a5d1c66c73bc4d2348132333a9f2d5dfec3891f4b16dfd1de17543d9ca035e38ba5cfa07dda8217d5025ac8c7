import { IGroup } from '@antv/g-base';
import { AxisLabelAutoHideCfg } from '../../types';
export declare function getDefault(): typeof equidistance;
/**
 * 保证首个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export declare function reserveFirst(isVertical: boolean, labelsGroup: IGroup, limitLength?: number, autoHideCfg?: AxisLabelAutoHideCfg): boolean;
/**
 * 保证最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export declare function reserveLast(isVertical: boolean, labelsGroup: IGroup, limitLength?: number, autoHideCfg?: AxisLabelAutoHideCfg): boolean;
/**
 * 保证第一个最后一个 label 可见，即使超过 limitLength 也不隐藏
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export declare function reserveBoth(isVertical: boolean, labelsGroup: IGroup, limitLength?: number, autoHideCfg?: AxisLabelAutoHideCfg): boolean;
/**
 * 保证 label 均匀显示 和 不出现重叠，主要解决文本层叠的问题，对于 limitLength 不处理
 * @param {boolean} isVertical  是否垂直
 * @param {IGroup}  labelsGroup label 的分组
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export declare function equidistance(isVertical: boolean, labelsGroup: IGroup, limitLength?: number, autoHideCfg?: AxisLabelAutoHideCfg): boolean;
/**
 * 同 equidistance， 首先会保证 labels 均匀显示，然后会保留首尾
 * @param isVertical
 * @param labelsGroup
 * @param {number} limitLength 另一个方向的长度限制，autoHide 不关心
 * @param {AxisLabelAutoHideCfg} autoHideCfg autoHide overlap 的可选配置参数
 */
export declare function equidistanceWithReverseBoth(isVertical: boolean, labelsGroup: IGroup, limitLength?: number, autoHideCfg?: AxisLabelAutoHideCfg): boolean;
