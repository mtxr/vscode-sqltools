import { Geometry, Types, View } from '@antv/g2';
import { Options } from '../types';
/**
 * 在 Chart 中查找特定 id 的子 View
 * @param chart
 * @param id
 */
export declare function findViewById(chart: View, id: string): View;
/**
 * 获取同 view 同一级的所有 views
 * @param view 当前 view
 * @returns 同一级的 views
 * @ignore
 */
export declare function getViews(view: View): View[];
/**
 * 获取同 view 同一级的 views，不包括自身
 * @param view 当前 view
 * @returns 同一级的 views
 * @ignore
 */
export declare function getSiblingViews(view: View): View[];
/**
 * 所有的 Geometries 都使用同一动画（各个图形如有区别，自行覆盖）并添加处理动画回调
 * @param view View
 * @param animation 动画配置
 */
export declare function addViewAnimation(view: View, animation: Options['animation'], geometries?: Geometry<Types.ShapePoint>[]): void;
