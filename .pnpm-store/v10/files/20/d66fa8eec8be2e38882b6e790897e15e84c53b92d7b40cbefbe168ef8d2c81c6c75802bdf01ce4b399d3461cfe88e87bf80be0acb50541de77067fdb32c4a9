import { Base } from '@antv/g-base';
import { ILocation } from '../interfaces';
import { BBox, ComponentCfg, LocationCfg, OffsetPoint } from '../types';
declare abstract class Component<T extends ComponentCfg = ComponentCfg> extends Base implements ILocation {
    constructor(cfg: T);
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {
        id: string;
        name: string;
        type: string;
        locationType: string;
        offsetX: number;
        offsetY: number;
        animate: boolean;
        capture: boolean;
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
        defaultCfg: {};
        visible: boolean;
    };
    /**
     * 清理组件的内容，一般配合 render 使用
     * @example
     * axis.clear();
     * axis.render();
     */
    clear(): void;
    /**
     * 更新组件
     * @param {object} cfg 更新属性
     */
    update(cfg: Partial<T>): void;
    protected updateInner(cfg: Partial<T>): void;
    protected afterUpdate(cfg: Partial<T>): void;
    abstract getBBox(): BBox;
    getLayoutBBox(): BBox;
    getLocationType(): any;
    getOffset(): OffsetPoint;
    setOffset(offsetX: number, offsetY: number): void;
    setLocation(cfg: LocationCfg): void;
    getLocation(): LocationCfg;
    isList(): boolean;
    isSlider(): boolean;
    /**
     * @protected
     * 初始化，用于具体的组件继承
     */
    init(): void;
    /**
     * 绘制组件
     */
    abstract render(): any;
    /**
     * 显示
     */
    abstract show(): any;
    abstract setCapture(capture: boolean): any;
    /**
     * 隐藏
     */
    abstract hide(): any;
    private initCfg;
}
export default Component;
