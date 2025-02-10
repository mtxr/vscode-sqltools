import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { CrosshairBaseCfg, Point } from '../types';
declare abstract class CrosshairBase<T extends CrosshairBaseCfg = CrosshairBaseCfg> extends GroupComponent {
    getDefaultCfg(): {
        name: string;
        type: string;
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
        locationType: string;
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
    /**
     * @protected
     * 获取文本点的位置
     * @return {Point} 文本的位置
     */
    protected abstract getTextPoint(): Point;
    protected abstract getRotateAngle(): number;
    protected renderText(group: IGroup): void;
    protected abstract getLinePath(): any[];
    protected renderLine(group: IGroup): void;
    private renderBackground;
}
export default CrosshairBase;
