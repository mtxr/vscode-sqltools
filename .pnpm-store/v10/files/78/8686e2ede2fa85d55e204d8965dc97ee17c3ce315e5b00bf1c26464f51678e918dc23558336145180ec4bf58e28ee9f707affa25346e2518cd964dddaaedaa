import Category from './base';
/**
 * 时间分类度量
 * @class
 */
declare class TimeCat extends Category {
    readonly type: string;
    mask: any;
    /**
     * @override
     */
    translate(value: any): number;
    /**
     * 由于时间类型数据需要转换一下，所以复写 getText
     * @override
     */
    getText(value: string | number, tickIndex?: number): any;
    protected initCfg(): void;
    protected setDomain(): void;
}
export default TimeCat;
