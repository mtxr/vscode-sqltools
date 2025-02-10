import Linear from './linear';
/**
 * 时间度量
 * @class
 */
declare class Time extends Linear {
    readonly type: string;
    mask: string;
    /**
     * @override
     */
    getText(value: string | number | Date, index?: number): any;
    /**
     * @override
     */
    scale(value: any): number;
    /**
     * 将时间转换成数字
     * @override
     */
    translate(v: any): number;
    protected initCfg(): void;
    protected setDomain(): void;
}
export default Time;
