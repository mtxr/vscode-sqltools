import { BBox, ComponentCfg, HtmlComponentCfg } from '../types';
import Component from './component';
declare abstract class HtmlComponent<T extends ComponentCfg = HtmlComponentCfg> extends Component<T> {
    getDefaultCfg(): {
        container: any;
        containerTpl: string;
        updateAutoRender: boolean;
        containerClassName: string;
        parent: any;
        id: string;
        name: string;
        type: string;
        locationType: string;
        offsetX: number;
        offsetY: number;
        animate: boolean;
        capture: boolean;
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
    getContainer(): HTMLElement;
    /**
     * 显示组件
     */
    show(): void;
    /**
     * 隐藏组件
     */
    hide(): void;
    /**
     * 是否允许捕捉事件
     * @param capture 事件捕捉
     */
    setCapture(capture: any): void;
    getBBox(): BBox;
    clear(): void;
    destroy(): void;
    /**
     * 复写 init，主要是初始化 DOM 和事件
     */
    init(): void;
    protected initCapture(): void;
    protected initVisible(): void;
    protected initDom(): void;
    protected initContainer(): void;
    protected resetStyles(): void;
    protected applyStyles(): void;
    protected applyChildrenStyles(element: any, styles: any): void;
    protected applyStyle(cssName: any, dom: any): void;
    /**
     * @protected
     */
    protected createDom(): any;
    /**
     * @protected
     * 初始化事件
     */
    protected initEvent(): void;
    /**
     * @protected
     * 清理 DOM
     */
    protected removeDom(): void;
    /**
     * @protected
     * 清理事件
     */
    protected removeEvent(): void;
    protected updateInner(cfg: any): void;
    protected resetPosition(): void;
}
export default HtmlComponent;
