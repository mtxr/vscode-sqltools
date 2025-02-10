import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { ImageAnnotationCfg, RegionLocationCfg } from '../types';
declare class ImageAnnotation extends GroupComponent<ImageAnnotationCfg> implements ILocation<RegionLocationCfg> {
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        start: any;
        end: any;
        src: any;
        style: {};
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
        defaultCfg: {};
        visible: boolean;
    };
    renderInner(group: IGroup): void;
    private getImageAttrs;
    private renderImage;
}
export default ImageAnnotation;
