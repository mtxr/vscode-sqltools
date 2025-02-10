import { PatternCfg } from '../../types/pattern';
/**
 * 获取设备像素比
 */
export declare function getPixelRatio(): number;
/**
 * 初始化 cavnas，设置宽高等
 */
export declare function initCanvas(width: number, height?: number): HTMLCanvasElement;
/**
 * 绘制背景
 *
 * @param context
 * @param cfg
 * @param width
 * @param height
 */
export declare function drawBackground(context: CanvasRenderingContext2D, cfg: PatternCfg, width: number, height?: number): void;
/**
 * 计算贴图单元大小
 *
 * @param size 元素大小
 * @param padding 圆点间隔
 * @param isStagger 是否交错
 * @reutrn 返回贴图单元大小
 */
export declare function getUnitPatternSize(size: number, padding: number, isStagger: boolean): number;
/**
 * 计算有交错情况的元素坐标
 *
 * @param unitSize 贴图单元大小
 * @param isStagger 是否交错
 * @reutrn 元素中心坐标 x,y 数组集合
 */
export declare function getSymbolsPosition(unitSize: number, isStagger: boolean): number[][];
/**
 * 给整个 pattern贴图 做变换, 目前支持旋转
 *
 * @param pattern 整个贴图
 * @param dpr  设备像素比
 * @param rotation 旋转角度
 */
export declare function transformMatrix(dpr: number, rotation: number): {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
};
