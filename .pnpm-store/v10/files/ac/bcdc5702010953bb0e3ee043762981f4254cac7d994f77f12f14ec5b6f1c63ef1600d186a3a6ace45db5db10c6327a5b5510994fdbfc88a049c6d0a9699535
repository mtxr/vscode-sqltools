import HtmlComponent from '../abstract/html-component';
import { ILocation } from '../interfaces';
import { HtmlAnnotationCfg, PointLocationCfg } from '../types';
export default class HtmlAnnotation extends HtmlComponent<HtmlAnnotationCfg> implements ILocation<PointLocationCfg> {
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        x: number;
        y: number;
        containerTpl: string;
        alignX: string;
        alignY: string;
        html: string;
        zIndex: number;
        container: any;
        updateAutoRender: boolean;
        containerClassName: string;
        parent: any;
        id: string;
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
    render(): void;
    protected resetPosition(): void;
}
