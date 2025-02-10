import { IShape, IElement } from '../interfaces';
/**
 * 创建并返回图形的 svg 元素
 * @param type svg类型
 */
export declare function createSVGElement(type: string): SVGElement;
/**
 * 创建并返回图形的 dom 元素
 * @param  {IShape} shape 图形
 * @return {SVGElement}
 */
export declare function createDom(shape: IShape): SVGElement;
/**
 * 对 dom 元素进行排序
 * @param {IElement} element  元素
 * @param {sorter}   function 排序函数
 */
export declare function sortDom(element: IElement, sorter: (a: IElement, b: IElement) => number): void;
/**
 * 将 dom 元素移动到父元素下的指定位置
 * @param {SVGElement} element     dom 元素
 * @param {number}     targetIndex 目标位置(从 0 开始)
 */
export declare function moveTo(element: SVGElement, targetIndex: number): void;
