import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { ILocation } from '../interfaces';
import { BBox, LegendBaseCfg, Point, PointLocationCfg } from '../types';
declare abstract class LegendBase<T extends LegendBaseCfg = LegendBaseCfg> extends GroupComponent implements ILocation<PointLocationCfg> {
    getDefaultCfg(): {
        name: string;
        /**
         * 布局方式： horizontal，vertical
         * @type {String}
         */
        layout: string;
        locationType: string;
        x: number;
        y: number;
        offsetX: number;
        offsetY: number;
        title: any;
        background: any;
        container: any;
        shapesMap: {};
        group: any;
        capture: boolean;
        isRegister: boolean;
        isUpdating: boolean;
        isInit: boolean;
        id: string;
        type: string;
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
    getLayoutBBox(): BBox;
    setLocation(cfg: PointLocationCfg): void;
    protected resetLocation(): void;
    protected applyOffset(): void;
    protected getDrawPoint(): Point;
    protected setDrawPoint(point: Point): void;
    protected renderInner(group: IGroup): void;
    protected abstract drawLegendContent(group: any): any;
    protected drawBackground(group: IGroup): void;
    protected drawTitle(group: IGroup): void;
    private resetDraw;
}
export default LegendBase;
