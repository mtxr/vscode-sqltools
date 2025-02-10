import { View } from '@antv/g2';
import { Datum, Statistic, StatisticText } from '../types';
/**
 * @desc 生成 html-statistic 的 style 字符串 (兼容 canvas 的 shapeStyle 到 css样式上)
 *
 * @param width
 * @param style
 */
export declare function adapteStyle(style?: StatisticText['style']): object;
/**
 * @desc 设置 html-statistic 容器的默认样式
 *
 * - 默认事件穿透
 */
export declare function setStatisticContainerStyle(container: HTMLElement, style: Partial<CSSStyleDeclaration>): void;
/**
 * 渲染环图 html-annotation（默认 position 居中 [50%, 50%]）
 * @param chart
 * @param options
 * @param meta 字段元信息
 * @param {optional} datum 当前的元数据
 */
export declare const renderStatistic: (chart: View, options: {
    statistic: Statistic;
    plotType: string;
}, datum?: Datum) => void;
/**
 * 渲染 html-annotation for gauge (等不规则 plot), 默认 position 居中居底 [50%, 100%]）
 * @param chart
 * @param options
 * @param meta 字段元信息
 * @param {optional} datum 当前的元数据
 */
export declare const renderGaugeStatistic: (chart: View, options: {
    statistic: Statistic;
}, datum?: Datum) => void;
