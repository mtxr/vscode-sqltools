import { CircleGridCfg, Point } from '../types';
import GridBase from './base';
declare class Circle extends GridBase<CircleGridCfg> {
    getDefaultCfg(): {
        type: string;
        /**
         * 中心点
         * @type {object}
         */
        center: any;
        /**
         * 栅格线是否封闭
         * @type {true}
         */
        closed: boolean;
        name: string;
        line: {}; /**
         * 栅格线是否封闭
         * @type {true}
         */
        alternateColor: any;
        capture: boolean;
        items: any[];
        defaultCfg: {
            line: {
                type: string;
                style: {
                    lineWidth: number;
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
    protected getGridPath(points: Point[], reversed: boolean): any[];
}
export default Circle;
