import Base from '../base';
/**
 * 连续度量的基类
 * @class
 */
export default abstract class Continuous extends Base {
    isContinuous?: boolean;
    nice: boolean;
    scale(value: any): number;
    protected init(): void;
    protected setDomain(): void;
    protected calculateTicks(): any[];
    protected getScalePercent(value: any): number;
    protected getInvertPercent(value: any): number;
}
