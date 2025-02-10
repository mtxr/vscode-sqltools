import Continuous from './base';
/**
 * Pow 度量，处理非均匀分布
 */
declare class Pow extends Continuous {
    readonly type: string;
    /**
     * 指数
     */
    exponent: number;
    /**
     * @override
     */
    invert(value: number): number;
    protected initCfg(): void;
    protected getScalePercent(value: number): number;
}
export default Pow;
