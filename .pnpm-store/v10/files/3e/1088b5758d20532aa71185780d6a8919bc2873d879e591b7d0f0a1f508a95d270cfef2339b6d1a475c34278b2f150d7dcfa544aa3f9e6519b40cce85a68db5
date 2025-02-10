import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ISlider } from '../interfaces';
import { GroupComponentCfg, Range } from '../types';
export interface ScrollbarStyle {
    trackColor: string;
    thumbColor: string;
    size: number;
    lineCap: string;
}
export interface ScrollbarTheme {
    default?: Partial<Readonly<ScrollbarStyle>>;
    hover?: Pick<Readonly<ScrollbarStyle>, 'thumbColor'>;
}
export declare const DEFAULT_THEME: ScrollbarTheme;
export interface ScrollbarCfg extends GroupComponentCfg {
    x: number;
    y: number;
    isHorizontal?: boolean;
    trackLen: number;
    thumbLen: number;
    minThumbLen?: number;
    thumbOffset?: number;
    size?: number;
    theme?: ScrollbarTheme;
    minLimit?: number;
    maxLimit?: number;
}
export declare class Scrollbar extends GroupComponent<ScrollbarCfg> implements ISlider {
    cfg: ScrollbarCfg;
    private isMobile;
    private clearEvents;
    private startPos;
    setRange(min: number, max: number): void;
    getRange(): Range;
    setValue(value: number): void;
    getValue(): number;
    getDefaultCfg(): {
        name: string;
        isHorizontal: boolean;
        minThumbLen: number;
        thumbOffset: number;
        theme: ScrollbarTheme;
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
        defaultCfg: {};
        visible: boolean;
    };
    protected renderInner(group: IGroup): void;
    protected applyOffset(): void;
    protected initEvent(): void;
    private renderTrackShape;
    private renderThumbShape;
    private bindEvents;
    private onStartEvent;
    private bindLaterEvent;
    private onMouseMove;
    private onMouseUp;
    private onTrackClick;
    private onThumbMouseOver;
    private onThumbMouseOut;
    private getContainerDOM;
    private validateRange;
    private draw;
    private updateThumbOffset;
    private emitOffsetChange;
}
