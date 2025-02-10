import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { RegionFilterAnnotationCfg, RegionLocationCfg } from '../types';
declare class RegionFilterAnnotation extends GroupComponent<RegionFilterAnnotationCfg> implements ILocation<RegionLocationCfg> {
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        start: any;
        end: any;
        color: any;
        shape: any[];
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
    protected renderInner(group: IGroup): void;
    private adjustShapeAttrs;
}
export default RegionFilterAnnotation;
