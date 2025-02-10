import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { ArcAnnotationCfg, CircleLocationCfg } from '../types';
declare class ArcAnnotation extends GroupComponent<ArcAnnotationCfg> implements ILocation<CircleLocationCfg> {
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        center: any;
        radius: number;
        startAngle: number;
        endAngle: number;
        style: {
            stroke: string;
            lineWidth: number;
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
        defaultCfg: {};
        visible: boolean;
    };
    protected renderInner(group: IGroup): void;
    private getArcPath;
    private renderArc;
}
export default ArcAnnotation;
