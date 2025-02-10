/* G2 的一个壳子，不包含 Geometry，由开发者自己定义和引入 */
export var VERSION = '4.2.11';
// 核心基类导出
export { Chart, View, Event } from './chart'; // Chart, View 类
export { Controller as ComponentController } from './chart/controller/base'; // G2 组件基类
export { default as TooltipController } from './chart/controller/tooltip'; // G2 tooltip 组件基类
export { default as Geometry } from './geometry/base'; // Geometry 基类
export { default as Element } from './geometry/element'; // Element 类
export { default as GeometryLabel } from './geometry/label/base'; // Geometry Label 基类
export { Interaction, Action } from './interaction'; // Interaction, Action 基类
export { Facet } from './facet'; // Facet 基类
export { default as InteractionAction } from './interaction/action/base'; // Interaction Action 基类
// 注册 ComponentController
export { registerComponentController } from './chart';
// 注册 Geometry
export { registerGeometry } from './chart';
// 注册 Geometry Shape
export { registerShape, registerShapeFactory, getShapeFactory } from './geometry/shape/base';
// 注册 Geometry label 以及 Geometry Label 布局函数
export { registerGeometryLabel, registerGeometryLabelLayout, getGeometryLabel, getGeometryLabelLayout, } from './geometry/label';
// 注册 interaction
export { getInteraction, registerInteraction, registerAction, getActionClass } from './interaction';
// 注册 facet
export { getFacet, registerFacet } from './facet';
// 注册主题
export { getTheme, registerTheme } from './theme';
// G engine 管理相关
export { registerEngine, getEngine } from './engine';
// 注册动画函数
export { registerAnimation, getAnimation } from './animate/animation';
export { LAYER, DIRECTION } from './constant';
export { Coordinate, Scale } from './dependents';
// 一些工具方法导出
import { getMappingValue } from './util/attr';
import { getLegendItems } from './util/legend';
import { getAngle, getSectorPath, polarToCartesian } from './util/graphics';
import { rotate, transform, translate, zoom } from './util/transform';
import { getTooltipItems } from './util/tooltip';
import { getDelegationObject } from './interaction/action/util';
import { getPathPoints } from './geometry/shape/util/get-path-points';
import { getPath } from './geometry/shape/line';
export var Util = {
    getLegendItems: getLegendItems,
    translate: translate,
    rotate: rotate,
    zoom: zoom,
    transform: transform,
    getAngle: getAngle,
    getSectorPath: getSectorPath,
    polarToCartesian: polarToCartesian,
    getDelegationObject: getDelegationObject,
    getTooltipItems: getTooltipItems,
    getMappingValue: getMappingValue,
    // shape 的一些操作方法
    getPath: getPath,
    getPathPoints: getPathPoints,
};
//# sourceMappingURL=core.js.map