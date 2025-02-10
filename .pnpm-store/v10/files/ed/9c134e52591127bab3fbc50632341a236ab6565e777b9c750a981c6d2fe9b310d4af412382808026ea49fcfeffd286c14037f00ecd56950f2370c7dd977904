import Continuous from './base';
/**
 * Log 度量，处理非均匀分布
 */
declare class Log extends Continuous {
    readonly type: string;
    base: number;
    private positiveMin;
    /**
     * @override
     */
    invert(value: number): number;
    protected initCfg(): void;
    protected setDomain(): void;
    protected getScalePercent(value: number): any;
}
export default Log;
