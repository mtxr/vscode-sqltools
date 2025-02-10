import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { DataMarkerAnnotationCfg, PointLocationCfg } from '../types';
declare class DataMarkerAnnotation extends GroupComponent<DataMarkerAnnotationCfg> implements ILocation<PointLocationCfg> {
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        x: number;
        y: number;
        point: {};
        line: {};
        text: {};
        direction: string;
        autoAdjust: boolean;
        coordinateBBox: any;
        defaultCfg: {
            point: {
                display: boolean;
                style: {
                    r: number;
                    fill: string;
                    stroke: string;
                    lineWidth: number;
                };
            };
            line: {
                display: boolean;
                length: number;
                style: {
                    stroke: string;
                    lineWidth: number;
                };
            };
            text: {
                content: string;
                display: boolean;
                style: {
                    fill: string;
                    opacity: number;
                    fontSize: number;
                    textAlign: string;
                    fontFamily: string;
                };
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
    protected renderInner(group: IGroup): void;
    protected applyOffset(): void;
    private renderPoint;
    private renderLine;
    private renderText;
    private autoAdjust;
    private getShapeAttrs;
}
export default DataMarkerAnnotation;
