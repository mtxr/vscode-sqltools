import { IContainer, IShape, IGroup, IElement } from '../interfaces';
import { BBox, ElementFilterFn } from '../types';
import Element from './element';
declare abstract class Container extends Element implements IContainer {
    isCanvas(): boolean;
    getBBox(): BBox;
    getCanvasBBox(): BBox;
    getDefaultCfg(): {
        visible: boolean;
        capture: boolean;
        zIndex: number;
    };
    onAttrChange(name: any, value: any, originValue: any): void;
    applyMatrix(matrix: number[]): void;
    _applyChildrenMarix(totalMatrix: any): void;
    addShape(...args: any[]): IShape;
    addGroup(...args: any[]): IGroup;
    getCanvas(): any;
    getShape(x: number, y: number, ev: Event): IShape;
    _findShape(children: IElement[], x: number, y: number, ev: Event): any;
    add(element: IElement): void;
    _applyElementMatrix(element: any): void;
    getChildren(): IElement[];
    sort(): void;
    clear(): void;
    destroy(): void;
    /**
     * 获取第一个子元素
     * @return {IElement} 第一个元素
     */
    getFirst(): IElement;
    /**
     * 获取最后一个子元素
     * @return {IElement} 元素
     */
    getLast(): IElement;
    /**
     * 根据索引获取子元素
     * @return {IElement} 第一个元素
     */
    getChildByIndex(index: number): IElement;
    /**
     * 子元素的数量
     * @return {number} 子元素数量
     */
    getCount(): number;
    /**
     * 是否包含对应元素
     * @param {IElement} element 元素
     * @return {boolean}
     */
    contain(element: IElement): boolean;
    /**
     * 移除对应子元素
     * @param {IElement} element 子元素
     * @param {boolean} destroy 是否销毁子元素，默认为 true
     */
    removeChild(element: IElement, destroy?: boolean): void;
    /**
     * 查找所有匹配的元素
     * @param  {ElementFilterFn}   fn  匹配函数
     * @return {IElement[]} 元素数组
     */
    findAll(fn: ElementFilterFn): IElement[];
    /**
     * 查找元素，找到第一个返回
     * @param  {ElementFilterFn} fn    匹配函数
     * @return {IElement|null} 元素，可以为空
     */
    find(fn: ElementFilterFn): IElement;
    /**
     * 根据 ID 查找元素
     * @param {string} id 元素 id
     * @return {IElement|null} 元素
     */
    findById(id: string): IElement;
    /**
     * 该方法即将废弃，不建议使用
     * 根据 className 查找元素
     * TODO: 该方式定义暂时只给 G6 3.3 以后的版本使用，待 G6 中的 findByClassName 方法移除后，G 也需要同步移除
     * @param {string} className 元素 className
     * @return {IElement | null} 元素
     */
    findByClassName(className: string): IElement;
    /**
     * 根据 name 查找元素列表
     * @param {string}      name 元素名称
     * @return {IElement[]} 元素
     */
    findAllByName(name: string): IElement[];
}
export default Container;
