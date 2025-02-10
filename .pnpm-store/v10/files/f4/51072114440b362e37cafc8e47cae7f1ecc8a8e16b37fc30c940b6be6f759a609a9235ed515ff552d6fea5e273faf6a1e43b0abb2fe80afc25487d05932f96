import { ILocation } from '../interfaces';
import { LineCrosshairCfg, Point, RegionLocationCfg } from '../types';
import CrosshairBase from './base';
declare class LineCrosshair extends CrosshairBase<LineCrosshairCfg> implements ILocation<RegionLocationCfg> {
    getDefaultCfg(): {
        type: string;
        locationType: string;
        start: any;
        end: any;
        name: string;
        line: {};
        text: any;
        textBackground: {};
        capture: boolean;
        defaultCfg: {
            line: {
                style: {
                    lineWidth: number;
                    stroke: string;
                };
            };
            text: {
                position: string;
                offset: number;
                autoRotate: boolean;
                content: any;
                style: {
                    fill: string;
                    textAlign: string;
                    textBaseline: string;
                    fontFamily: string;
                };
            };
            textBackground: {
                padding: number;
                style: {
                    stroke: string;
                };
            };
        };
        container: any;
        shapesMap: {};
        group: any;
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
    protected getRotateAngle(): number;
    protected getTextPoint(): Point;
    protected getLinePath(): any[];
}
export default LineCrosshair;
