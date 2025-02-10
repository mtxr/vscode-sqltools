import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { LineAnnotationCfg, RegionLocationCfg } from '../types';
declare class LineAnnotation extends GroupComponent<LineAnnotationCfg> implements ILocation<RegionLocationCfg> {
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
        text: any;
        defaultCfg: {
            style: {
                fill: string;
                fontSize: number;
                textAlign: string;
                textBaseline: string;
                fontFamily: string;
            };
            text: {
                position: string;
                autoRotate: boolean;
                content: any;
                offsetX: number;
                offsetY: number;
                style: {
                    stroke: string;
                    lineWidth: number;
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
    private renderLine;
    private getLabelPoint;
    private renderLabel;
}
export default LineAnnotation;
