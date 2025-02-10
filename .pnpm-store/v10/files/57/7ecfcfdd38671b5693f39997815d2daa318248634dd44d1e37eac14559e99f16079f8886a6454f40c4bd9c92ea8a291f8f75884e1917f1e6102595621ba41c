/**
 * @fileoverview 使用 G.Group 的组件
 * @author dxq613@gmail.com
 */
import { IElement, IGroup, IShape } from '@antv/g-base';
import { BBox, GroupComponentCfg, LooseObject, Point } from '../types';
import Component from './component';
declare type Callback = (evt: object) => void;
export declare type GroupComponentCtor<C extends GroupComponentCfg = GroupComponentCfg, T extends GroupComponent = GroupComponent> = new (cfg: C) => T;
declare abstract class GroupComponent<T extends GroupComponentCfg = GroupComponentCfg> extends Component<T> {
    getDefaultCfg(): {
        container: any;
        /**
         * @private
         * 缓存图形的 Map
         */
        shapesMap: {};
        group: any;
        capture: boolean;
        /**
         * @private 组件或者图形是否允许注册
         * @type {false}
         */
        isRegister: boolean;
        /**
         * @private 是否正在更新
         * @type {false}
         */
        isUpdating: boolean;
        /**
         * @private
         * 是否初始状态，一旦 render，update 后，这个状态就变成 false, clear 后恢复
         */
        isInit: boolean;
        id: string;
        name: string;
        type: string;
        locationType: string;
        offsetX: number;
        offsetY: number;
        animate: boolean;
        updateAutoRender: boolean;
        animateOption: {
            appear: any;
            update: {
                duration: number;
                easing: string;
            };
            enter: {
                duration: number;
                easing: string;
            };
            leave: {
                duration: number;
                easing: string;
            };
        };
        events: any;
        defaultCfg: {}; /**
         * @private 组件或者图形是否允许注册
         * @type {false}
         */
        visible: boolean;
    };
    remove(): void;
    clear(): void;
    getChildComponentById(id: string): any;
    getElementById(id: string): any;
    getElementByLocalId(localId: any): any;
    getElementsByName(name: string): any[];
    getContainer(): IGroup;
    updateInner(cfg: Partial<T>): void;
    render(): void;
    show(): void;
    hide(): void;
    setCapture(capture: any): void;
    destroy(): void;
    getBBox(): BBox;
    getLayoutBBox(): BBox;
    on(evt: string, callback: Callback, once?: boolean): this;
    off(evt?: string, callback?: Callback): this;
    emit(eventName: string, eventObject: LooseObject): void;
    init(): void;
    protected getInnerLayoutBBox(): any;
    protected delegateEmit(eventName: string, eventObject: LooseObject): void;
    protected createOffScreenGroup(): any;
    protected applyOffset(): void;
    protected initGroup(): void;
    protected offScreenRender(): any;
    /**
     * @protected
     * 在组件上添加分组，主要解决 isReigeter 的问题
     * @param {IGroup} parent 父元素
     * @param {object} cfg    分组的配置项
     */
    protected addGroup(parent: IGroup, cfg: any): IGroup;
    /**
     * @protected
     * 在组件上添加图形，主要解决 isReigeter 的问题
     * @param {IGroup} parent 父元素
     * @param {object} cfg    分组的配置项
     */
    protected addShape(parent: IGroup, cfg: any): IShape;
    /**
     * 在组件上添加子组件
     *
     * @param parent 父元素
     * @param cfg 子组件配置项
     */
    protected addComponent<C extends GroupComponentCfg = GroupComponentCfg, CT extends GroupComponent = GroupComponent>(parent: IGroup, cfg: Omit<C, 'container'> & {
        component: GroupComponentCtor<C, CT>;
    }): CT;
    protected initEvent(): void;
    protected removeEvent(): void;
    protected getElementId(localId: string): string;
    protected registerElement(element: any): void;
    protected unregisterElement(element: any): void;
    protected moveElementTo(element: IElement, point: Point): void;
    /**
     * 内部的渲染
     * @param {IGroup} group 图形分组
     */
    protected abstract renderInner(group: IGroup): any;
    /**
     * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
     * @protected
     * @param {string} elmentName 图形元素名称
     * @param {IElement} newElement  新的图形元素
     * @param {object} animateCfg 动画的配置项
     */
    protected addAnimation(elmentName: any, newElement: any, animateCfg: any): void;
    /**
     * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
     * @protected
     * @param {string} elmentName 图形元素名称
     * @param {IElement} originElement 要删除的图形元素
     * @param {object} animateCfg 动画的配置项
     */
    protected removeAnimation(elementName: any, originElement: any, animateCfg: any): void;
    /**
     * 图形元素的更新动画
     * @param {string} elmentName 图形元素名称
     * @param {IElement} originElement 现有的图形元素
     * @param {object} newAttrs  新的图形元素
     * @param {object} animateCfg 动画的配置项
     */
    protected updateAnimation(elementName: any, originElement: any, newAttrs: any, animateCfg: any): void;
    protected updateElements(newGroup: any, originGroup: any): void;
    protected clearUpdateStatus(group: IGroup): void;
    private clearOffScreenCache;
    private getDelegateObject;
    private appendDelegateObject;
    private getReplaceAttrs;
    private registerNewGroup;
    private deleteElements;
    private removeElement;
}
export default GroupComponent;
