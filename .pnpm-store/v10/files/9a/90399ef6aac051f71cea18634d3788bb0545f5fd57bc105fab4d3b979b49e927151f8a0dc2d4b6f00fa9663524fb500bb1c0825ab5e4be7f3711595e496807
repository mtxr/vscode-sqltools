import { View } from '../../chart';
import { BBox, PathCommand, Point } from '../../dependents';
import Element from '../../geometry/element/';
import { IInteractionContext, LooseObject } from '../../interface';
/**
 * 获取当前事件相关的图表元素
 * @param context 交互的上下文
 * @ignore
 */
export declare function getCurrentElement(context: IInteractionContext): Element;
/**
 * 获取委托对象
 * @param context 上下文
 * @ignore
 */
export declare function getDelegationObject(context: IInteractionContext): LooseObject;
export declare function isElementChange(context: IInteractionContext): boolean;
/**
 * 是否是列表组件
 * @param delegateObject 委托对象
 * @ignore
 */
export declare function isList(delegateObject: LooseObject): boolean;
/**
 * 是否是滑块组件
 * @param delegateObject 委托对象
 * @ignore
 */
export declare function isSlider(delegateObject: LooseObject): boolean;
/**
 * 是否由 mask 触发
 * @param context 上下文
 * @ignore
 */
export declare function isMask(context: IInteractionContext): boolean;
/**
 * 是否由 multiple mask 触发
 * @param context
 * @returns
 */
export declare function isMultipleMask(context: IInteractionContext): boolean;
/**
 * 获取被遮挡的 elements
 * @param context 上下文
 * @ignore
 */
export declare function getMaskedElements(context: IInteractionContext, tolerance: number): Element[];
/**
 * @ignore
 */
export declare function getSiblingMaskElements(context: IInteractionContext, sibling: View, tolerance: number): any[];
/**
 * 获取所有的图表元素
 * @param view View/Chart
 * @ignore
 */
export declare function getElements(view: View): Element[];
/**
 * 获取所有的图表元素
 * @param view View/Chart
 * @param field 字段名
 * @param value 字段值
 * @ignore
 */
export declare function getElementsByField(view: View, field: string, value: any): Element[];
/**
 * 根据状态名获取图表元素
 * @param view View/Chart
 * @param stateName 状态名
 * @ignore
 */
export declare function getElementsByState(view: View, stateName: string): Element[];
/**
 * 获取图表元素对应字段的值
 * @param element 图表元素
 * @param field 字段名
 * @ignore
 */
export declare function getElementValue(element: Element, field: any): any;
/**
 * 两个包围盒是否相交
 * @param box1 包围盒1
 * @param box2 包围盒2
 * @ignore
 */
export declare function intersectRect(box1: any, box2: any): boolean;
/**
 * 获取包围盒内的图表元素
 * @param view View/Chart
 * @param box 包围盒
 * @ignore
 */
export declare function getIntersectElements(view: View, box: any): any[];
/**
 * 获取包围盒内的图表元素
 * @param view View/Chart
 * @param path 路径
 * @ignore
 */
export declare function getElementsByPath(view: View, path: any[]): Element[];
/**
 * 获取当前 View 的所有组件
 * @param view View/Chart
 * @ignore
 */
export declare function getComponents(view: any): any;
/** @ignore */
export declare function distance(p1: Point, p2: Point): number;
/** @ignore */
export declare function getSpline(points: Point[], z: boolean): PathCommand[];
/**
 * 检测点是否在包围盒内
 * @param box 包围盒
 * @param point 点
 * @ignore
 */
export declare function isInBox(box: BBox, point: Point): boolean;
/**
 * 获取同 view 同一级的 views
 * @param view 当前 view
 * @returns 同一级的 views
 * @ignore
 */
export declare function getSilbings(view: View): View[];
/**
 * 将 view 上的一点转换成另一个 view 的点
 * @param view 当前的 view
 * @param sibling 同一层级的 view
 * @param point 指定点
 * @ignore
 */
export declare function getSiblingPoint(view: View, sibling: View, point: Point): Point;
/**
 * 是否在记录中，临时因为所有的 view 中的数据不是引用，而使用的方法
 * 不同 view 上对数据的引用不相等，导致无法直接用 includes
 * 假设 x, y 值相等时是同一条数据，这个假设不完全正确，而改成 isEqual 则成本太高
 * 后面改成同一个引用时可以修改回来
 * @param records
 * @param record
 * @param xFiled
 * @param yField
 * @returns
 * @ignore
 */
export declare function isInRecords(records: object[], record: object, xFiled: string, yField: string): boolean;
export declare function getScaleByField(view: View, field: string): import("@antv/scale/lib/base").default;
