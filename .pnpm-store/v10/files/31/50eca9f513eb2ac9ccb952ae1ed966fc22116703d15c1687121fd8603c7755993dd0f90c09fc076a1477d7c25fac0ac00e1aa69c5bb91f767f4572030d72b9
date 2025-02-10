import { LabelItem } from './interface';
import PolarLabel from './polar';
/**
 * 饼图 label
 */
export default class PieLabel extends PolarLabel {
    defaultLayout: string;
    protected getDefaultLabelCfg(offset?: number, position?: string): any;
    /** @override */
    protected getLabelOffset(offset: string | number): number;
    protected getLabelRotate(angle: number, offset: number, isLabelLimit: boolean): any;
    protected getLabelAlign(point: LabelItem): any;
    protected getArcPoint(point: any): any;
    protected getPointAngle(point: any): any;
    /** @override */
    protected getCirclePoint(angle: number, offset: number): {
        angle: number;
        r: number;
        x: number;
        y: number;
    };
}
