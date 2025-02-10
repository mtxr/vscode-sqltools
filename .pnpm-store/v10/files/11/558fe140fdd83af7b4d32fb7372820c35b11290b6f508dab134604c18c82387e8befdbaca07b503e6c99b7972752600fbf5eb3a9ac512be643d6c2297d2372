import { IGroup } from '@antv/g-base';
import GroupComponent from '../abstract/group-component';
import { GridBaseCfg, GroupComponentCfg, Point } from '../types';
declare abstract class GridBase<T extends GroupComponentCfg = GridBaseCfg> extends GroupComponent<T> {
    getDefaultCfg(): {
        name: string;
        line: {};
        alternateColor: any;
        capture: boolean;
        items: any[];
        closed: boolean;
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
        type: string;
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
                easing: string; /**
                 * 获取栅格线的路径
                 * @param  {Point[]} points   栅格线的点集合
                 * @param  {boolean} reversed 顺序是否相反
                 * @return {any[]}            路径
                 */
            };
            leave: {
                duration: number;
                easing: string;
            };
        };
        events: any;
        visible: boolean;
    };
    /**
     * 获取栅格线的类型
     * @return {string} 栅格线类型
     */
    protected getLineType(): string;
    protected renderInner(group: IGroup): void;
    /**
     * 获取栅格线的路径
     * @param  {Point[]} points   栅格线的点集合
     * @param  {boolean} reversed 顺序是否相反
     * @return {any[]}            路径
     */
    protected abstract getGridPath(points: Point[], reversed?: boolean): any[];
    protected getAlternatePath(prePoints: Point[], points: Point[]): any[];
    private getPathStyle;
    private drawGrid;
    private drawAlternateRegion;
}
export default GridBase;
