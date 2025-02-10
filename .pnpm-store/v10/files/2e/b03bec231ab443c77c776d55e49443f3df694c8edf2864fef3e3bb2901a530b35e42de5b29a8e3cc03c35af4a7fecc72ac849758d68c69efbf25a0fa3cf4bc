import { AttributeCfg, CallbackType, Scale } from '../interface';
export type AttributeConstructor = new (cfg: any) => Attribute;
/**
 * 所有视觉通道属性的基类
 * @class Base
 */
export default class Attribute {
    type: string;
    names: string[];
    scales: Scale[];
    linear: boolean;
    values: any[];
    constructor(cfg: AttributeCfg);
    callback: CallbackType;
    /**
     * 映射的值组成的数组
     * @param params 对应 scale 顺序的值传入
     */
    mapping(...params: any[]): any[];
    /**
     * 如果进行线性映射，返回对应的映射值
     * @param percent
     */
    getLinearValue(percent: number): number | string;
    /**
     * 根据度量获取属性名
     */
    getNames(): any[];
    /**
     * 获取所有的维度名
     */
    getFields(): string[];
    /**
     * 根据名称获取度量
     * @param name
     */
    getScale(name: string): Scale;
    /**
     * 默认的回调函数（用户没有自定义 callback，或者用户自定义 callback 返回空的时候，使用 values 映射）
     * @param params
     */
    private defaultCallback;
    private _parseCfg;
    private _getAttributeValue;
    /**
     * 通过 scale 拿到数据对应的原始的参数
     * @param param
     * @param scale
     * @private
     */
    private _toOriginParam;
}
