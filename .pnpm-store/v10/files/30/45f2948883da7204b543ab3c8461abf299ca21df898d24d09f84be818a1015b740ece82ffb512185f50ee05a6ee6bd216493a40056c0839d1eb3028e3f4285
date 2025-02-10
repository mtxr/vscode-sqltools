import AxisBase from './base';
import type { CircleAxisCfg, Point } from '../types';
declare class Circle extends AxisBase<CircleAxisCfg> {
    getDefaultCfg(): {
        type: string;
        locationType: string;
        center: any;
        radius: any;
        startAngle: number;
        endAngle: number;
        name: string;
        ticks: any[];
        line: {};
        tickLine: {};
        subTickLine: any;
        title: any;
        label: {};
        verticalFactor: number;
        verticalLimitLength: any;
        overlapOrder: string[];
        tickStates: {};
        optimize: {};
        defaultCfg: {
            line: {
                style: {
                    lineWidth: number;
                    stroke: string;
                };
            };
            tickLine: {
                style: {
                    lineWidth: number;
                    stroke: string;
                };
                alignTick: boolean;
                length: number;
                displayWithLabel: boolean;
            };
            subTickLine: {
                style: {
                    lineWidth: number;
                    stroke: string;
                };
                count: number;
                length: number;
            };
            label: {
                autoRotate: boolean;
                autoHide: boolean;
                autoEllipsis: boolean;
                style: {
                    fontSize: number;
                    fill: string;
                    fontFamily: string;
                    fontWeight: string;
                };
                offset: number;
                offsetX: number;
                offsetY: number;
            };
            title: {
                autoRotate: boolean;
                spacing: number;
                position: string;
                style: {
                    fontSize: number;
                    fill: string;
                    textBaseline: string;
                    fontFamily: string;
                    textAlign: string;
                };
                iconStyle: {
                    fill: string;
                    stroke: string;
                };
                description: string;
            };
            tickStates: {
                active: {
                    labelStyle: {
                        fontWeight: number;
                    };
                    tickLineStyle: {
                        lineWidth: number;
                    };
                };
                inactive: {
                    labelStyle: {
                        fill: string;
                    };
                };
            };
            optimize: {
                enable: boolean;
                threshold: number;
            };
        };
        theme: {};
        container: any;
        shapesMap: {};
        group: any;
        capture: boolean;
        isRegister: boolean;
        isUpdating: boolean;
        isInit: boolean;
        id: string;
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
        visible: boolean;
    };
    protected getLinePath(): any[];
    protected getTickPoint(tickValue: any): Point;
    protected getSideVector(offset: number, point: Point): [number, number];
    protected getAxisVector(point: Point): [number, number];
    private getCirclePoint;
    /**
     * 是否可以执行某一 overlap
     * @param name
     */
    private canProcessOverlap;
    protected processOverlap(labelGroup: any): void;
    private autoProcessOverlap;
}
export default Circle;
