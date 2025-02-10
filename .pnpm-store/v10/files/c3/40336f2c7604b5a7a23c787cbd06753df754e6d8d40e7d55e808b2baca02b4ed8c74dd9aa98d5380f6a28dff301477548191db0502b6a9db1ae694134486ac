import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { GroupComponentCfg } from '../types';
export interface TrendCfg extends GroupComponentCfg {
    readonly x?: number;
    readonly y?: number;
    readonly width?: number;
    readonly height?: number;
    readonly data?: number[];
    readonly smooth?: boolean;
    readonly isArea?: boolean;
    readonly backgroundStyle?: object;
    readonly lineStyle?: object;
    readonly areaStyle?: object;
}
export declare class Trend extends GroupComponent<TrendCfg> {
    getDefaultCfg(): {
        name: string;
        x: number;
        y: number;
        width: number;
        height: number;
        smooth: boolean;
        isArea: boolean;
        data: any[];
        backgroundStyle: {
            opacity: number;
        };
        lineStyle: {
            stroke: string;
            strokeOpacity: number;
        };
        areaStyle: {
            fill: string;
            opacity: number;
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
}
export default Trend;
