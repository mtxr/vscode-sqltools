import HtmlComponent from '../abstract/html-component';
import { HtmlCrossHairCfg } from '../types';
declare class HtmlCrosshair<T extends HtmlCrossHairCfg = HtmlCrossHairCfg> extends HtmlComponent {
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
        capture: boolean;
        text: any;
        containerTpl: string;
        crosshairTpl: string;
        textTpl: string;
        domStyles: any;
        containerClassName: string;
        defaultStyles: {
            [x: string]: {
                position: string;
                backgroundColor?: undefined;
                color?: undefined;
                fontFamily?: undefined;
            } | {
                position: string;
                backgroundColor: string;
                color?: undefined;
                fontFamily?: undefined;
            } | {
                position: string;
                color: string;
                fontFamily: string;
                backgroundColor?: undefined;
            };
        };
        defaultCfg: {
            text: {
                position: string;
                content: any;
                align: string;
                offset: number;
            };
        };
        container: any;
        updateAutoRender: boolean;
        parent: any;
        id: string;
        offsetX: number;
        offsetY: number;
        animate: boolean;
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
    render(): void;
    private initCrossHair;
    private getTextPoint;
    private resetText;
    private isVertical;
    protected resetPosition(): void;
    private alignText;
    protected updateInner(cfg: Partial<T>): void;
}
export default HtmlCrosshair;
