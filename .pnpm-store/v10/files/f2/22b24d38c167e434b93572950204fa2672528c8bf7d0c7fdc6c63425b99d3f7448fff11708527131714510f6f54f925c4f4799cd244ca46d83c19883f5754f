import { IGroup } from '@antv/g-base';
import { ISlider } from '../interfaces';
import { ContinueLegendCfg } from '../types';
import LegendBase from './base';
declare class ContinueLegend extends LegendBase<ContinueLegendCfg> implements ISlider {
    getDefaultCfg(): {
        type: string;
        min: number;
        max: number;
        value: any;
        colors: any[];
        track: {};
        rail: {};
        label: {};
        handler: {};
        slidable: boolean;
        tip: any;
        step: any;
        maxWidth: any;
        maxHeight: any;
        defaultCfg: {
            label: {
                align: string;
                spacing: number;
                formatter: any;
                style: {
                    fontSize: number;
                    fill: string;
                    textBaseline: string;
                    fontFamily: string;
                };
            };
            handler: {
                size: number;
                style: {
                    fill: string;
                    stroke: string;
                };
            };
            track: {};
            rail: {
                type: string;
                size: number;
                defaultLength: number;
                style: {
                    fill: string;
                };
            };
            title: {
                spacing: number;
                style: {
                    fill: string;
                    fontSize: number;
                    textAlign: string;
                    textBaseline: string;
                };
            };
        };
        name: string;
        layout: string;
        locationType: string;
        x: number;
        y: number;
        offsetX: number;
        offsetY: number;
        title: any;
        background: any;
        container: any;
        shapesMap: {};
        group: any;
        capture: boolean;
        isRegister: boolean;
        isUpdating: boolean;
        isInit: boolean;
        id: string;
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
    isSlider(): boolean;
    getValue(): number[];
    getRange(): {
        min: any;
        max: any;
    };
    setRange(min: any, max: any): void;
    setValue(value: number[]): void;
    protected initEvent(): void;
    protected drawLegendContent(group: IGroup): void;
    private bindSliderEvent;
    private bindHandlersEvent;
    private bindRailEvent;
    private bindTrackEvent;
    private drawLabels;
    private drawLabel;
    private getLabelAlignAttrs;
    private getRailPath;
    private drawRail;
    private getTrackColor;
    private getTrackPath;
    private getClipTrackAttrs;
    private getTrackAttrs;
    private resetTrackClip;
    private resetTrack;
    private getPointByValue;
    private getRailShape;
    private getRailBBox;
    private getRailCanvasBBox;
    private isVertical;
    private getValueByCanvasPoint;
    private getCurrentValue;
    private resetHandlers;
    private getHandlerPath;
    private resetHandler;
    private fixedElements;
    private fitRailLength;
    private changeRailLength;
    private changeRailPosition;
    private fixedHorizontal;
    private fixedVertail;
}
export default ContinueLegend;
