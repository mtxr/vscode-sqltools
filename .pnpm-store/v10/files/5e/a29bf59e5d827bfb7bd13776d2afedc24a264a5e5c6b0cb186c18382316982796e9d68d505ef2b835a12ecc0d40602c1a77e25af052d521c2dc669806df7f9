import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { RegionAnnotationCfg, RegionLocationCfg } from '../types';
declare class RegionAnnotation extends GroupComponent<RegionAnnotationCfg> implements ILocation<RegionLocationCfg> {
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
        style: {};
        defaultCfg: {
            style: {
                lineWidth: number;
                fill: string;
                opacity: number;
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
    private renderRegion;
}
export default RegionAnnotation;
