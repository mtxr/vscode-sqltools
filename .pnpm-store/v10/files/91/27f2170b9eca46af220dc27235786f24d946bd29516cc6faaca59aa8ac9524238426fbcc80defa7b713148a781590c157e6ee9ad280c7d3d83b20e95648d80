import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { DataRegionAnnotationCfg, PointsLocationCfg } from '../types';
declare class DataRegionAnnotation extends GroupComponent<DataRegionAnnotationCfg> implements ILocation<PointsLocationCfg> {
    /**
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        points: any[];
        lineLength: number;
        region: {};
        text: {};
        defaultCfg: {
            region: {
                style: {
                    lineWidth: number;
                    fill: string;
                    opacity: number;
                };
            };
            text: {
                content: string;
                style: {
                    textAlign: string;
                    textBaseline: string;
                    fontSize: number;
                    fill: string;
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
}
export default DataRegionAnnotation;
