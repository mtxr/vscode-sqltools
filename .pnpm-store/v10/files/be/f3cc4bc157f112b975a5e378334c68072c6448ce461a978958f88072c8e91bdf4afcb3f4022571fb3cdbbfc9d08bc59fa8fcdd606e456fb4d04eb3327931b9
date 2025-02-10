import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ISlider } from '../interfaces';
import { HandlerCfg } from './handler';
import { GroupComponentCfg, Range } from '../types';
export interface TrendCfg {
    readonly data: number[];
    readonly smooth?: boolean;
    readonly isArea?: boolean;
    readonly backgroundStyle?: object;
    readonly lineStyle?: object;
    readonly areaStyle?: object;
}
/**
 * slider handler style 设置
 */
declare type HandlerStyle = HandlerCfg['style'] & {
    readonly width?: number;
    readonly height?: number;
};
export interface SliderCfg extends GroupComponentCfg {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly trendCfg?: TrendCfg;
    readonly backgroundStyle?: any;
    readonly foregroundStyle?: any;
    readonly handlerStyle?: HandlerStyle;
    readonly textStyle?: any;
    readonly minLimit?: number;
    readonly maxLimit?: number;
    readonly start?: number;
    readonly end?: number;
    readonly minText?: string;
    readonly maxText?: string;
}
export declare class Slider extends GroupComponent<SliderCfg> implements ISlider {
    cfg: SliderCfg;
    private minHandler;
    private maxHandler;
    private trend;
    private currentTarget;
    private prevX;
    private prevY;
    setRange(min: number, max: number): void;
    getRange(): Range;
    setValue(value: number | number[]): void;
    getValue(): number | number[];
    getDefaultCfg(): {
        name: string;
        x: number;
        y: number;
        width: number;
        height: number;
        backgroundStyle: {};
        foregroundStyle: {};
        handlerStyle: {};
        textStyle: {};
        defaultCfg: {
            backgroundStyle: {
                fill: string;
                opacity: number;
            };
            foregroundStyle: {
                fill: string;
                opacity: number;
                cursor: string;
            };
            handlerStyle: {
                width: number;
                height: number;
            };
            textStyle: {
                textBaseline: string;
                fill: string;
                opacity: number;
            };
        };
        container: any;
        shapesMap: {};
        group: any;
        capture: boolean;
        isRegister: boolean;
        isUpdating: boolean;
        isInit: boolean;
        id: string;
        type: string;
        locationType: string;
        offsetX: number;
        offsetY: number; /**
         * slider handler style 设置
         */
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
        visible: boolean;
    };
    update(cfg: Partial<SliderCfg>): void;
    init(): void;
    render(): void;
    protected renderInner(group: IGroup): void;
    protected applyOffset(): void;
    protected initEvent(): void;
    private updateUI;
    private bindEvents;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    /**
     * 调整 offsetRange，因为一些范围的限制
     * @param offsetRange
     */
    private adjustOffsetRange;
    private updateStartEnd;
    /**
     * 调整 text 的位置，自动躲避
     * 根据位置，调整返回新的位置
     * @param range
     */
    private _dodgeText;
    draw(): void;
    private getContainerDOM;
}
export default Slider;
