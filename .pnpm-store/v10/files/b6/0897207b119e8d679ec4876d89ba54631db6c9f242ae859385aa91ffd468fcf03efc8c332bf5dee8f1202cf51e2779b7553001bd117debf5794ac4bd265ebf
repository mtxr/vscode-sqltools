import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { PointLocationCfg, TextAnnotationCfg } from '../types';
declare class TextAnnotation extends GroupComponent<TextAnnotationCfg> implements ILocation<PointLocationCfg> {
    /**
     * @protected
     * 默认的配置项
     * @returns {object} 默认的配置项
     */
    getDefaultCfg(): {
        name: string;
        type: string;
        locationType: string;
        x: number;
        y: number;
        content: string;
        rotate: any;
        style: {};
        background: any;
        maxLength: any;
        autoEllipsis: boolean;
        isVertical: boolean;
        ellipsisPosition: string;
        defaultCfg: {
            style: {
                fill: string;
                fontSize: number;
                textAlign: string;
                textBaseline: string;
                fontFamily: string;
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
    setLocation(location: PointLocationCfg): void;
    protected renderInner(group: IGroup): void;
    private resetLocation;
}
export default TextAnnotation;
