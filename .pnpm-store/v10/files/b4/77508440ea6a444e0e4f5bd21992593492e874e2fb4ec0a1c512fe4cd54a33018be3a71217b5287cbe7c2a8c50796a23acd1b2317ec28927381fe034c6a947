import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { GroupComponentCfg } from '../types';
interface IStyle {
    fill?: string;
    stroke?: string;
    radius?: number;
    opacity?: number;
    cursor?: string;
    highLightFill?: string;
}
export interface HandlerCfg extends GroupComponentCfg {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly style?: IStyle;
}
export declare const DEFAULT_HANDLER_STYLE: {
    fill: string;
    stroke: string;
    radius: number;
    opacity: number;
    cursor: string;
    highLightFill: string;
};
export declare class Handler extends GroupComponent<HandlerCfg> {
    getDefaultCfg(): {
        name: string;
        x: number;
        y: number;
        width: number;
        height: number;
        style: {
            fill: string;
            stroke: string;
            radius: number;
            opacity: number;
            cursor: string;
            highLightFill: string;
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
    private bindEvents;
    private draw;
}
export default Handler;
