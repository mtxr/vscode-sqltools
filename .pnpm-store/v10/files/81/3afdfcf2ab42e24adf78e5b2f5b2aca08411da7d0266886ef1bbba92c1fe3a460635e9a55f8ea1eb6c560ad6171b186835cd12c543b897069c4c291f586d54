import { ScaleConfig, Tick } from './types';
export default abstract class Scale {
    /**
     * 度量的类型
     */
    type: string;
    /**
     * 是否分类类型的度量
     */
    isCategory?: boolean;
    /**
     * 是否线性度量，有linear, time 度量
     */
    isLinear?: boolean;
    /**
     * 是否连续类型的度量，linear,time,log, pow, quantile, quantize 都支持
     */
    isContinuous?: boolean;
    /**
     * 是否是常量的度量，传入和传出一致
     */
    isIdentity: boolean;
    field?: ScaleConfig['field'];
    alias?: ScaleConfig['alias'];
    values: ScaleConfig['values'];
    min?: ScaleConfig['min'];
    max?: ScaleConfig['max'];
    minLimit?: ScaleConfig['minLimit'];
    maxLimit?: ScaleConfig['maxLimit'];
    range: ScaleConfig['range'];
    ticks: ScaleConfig['ticks'];
    tickCount: ScaleConfig['tickCount'];
    tickInterval: ScaleConfig['tickInterval'];
    formatter?: ScaleConfig['formatter'];
    tickMethod?: ScaleConfig['tickMethod'];
    protected __cfg__: ScaleConfig;
    constructor(cfg: ScaleConfig);
    translate(v: any): any;
    /** 将定义域转换为值域 */
    abstract scale(value: any): number;
    /** 将值域转换为定义域 */
    abstract invert(scaled: number): any;
    /** 重新初始化 */
    change(cfg: ScaleConfig): void;
    clone(): Scale;
    /** 获取坐标轴需要的ticks */
    getTicks(): Tick[];
    /** 获取Tick的格式化结果 */
    getText(value: any, key?: number): string;
    protected getConfig(key: any): any;
    protected init(): void;
    protected initCfg(): void;
    protected setDomain(): void;
    protected calculateTicks(): any[];
    protected rangeMin(): number;
    protected rangeMax(): number;
    /** 定义域转 0~1 */
    protected calcPercent(value: any, min: number, max: number): number;
    /** 0~1转定义域 */
    protected calcValue(percent: number, min: number, max: number): number;
}
