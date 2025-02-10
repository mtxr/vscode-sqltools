import { View } from '@antv/g2';
import { Options } from '../../types';
import { AreaOptions } from '../area';
import { BarOptions } from '../bar';
import { ColumnOptions } from '../column';
import { FunnelOptions } from '../funnel';
import { GaugeOptions } from '../gauge';
import { HistogramOptions } from '../histogram';
import { LineOptions } from '../line';
import { PieOptions } from '../pie';
import { ProgressOptions } from '../progress';
import { RingProgressOptions } from '../ring-progress';
import { ScatterOptions } from '../scatter';
import { StockOptions } from '../stock';
import { TinyAreaOptions } from '../tiny-area';
import { TinyColumnOptions } from '../tiny-column';
import { TinyLineOptions } from '../tiny-line';
/**
 * 移除 options 中的 width、height 设置, 将 options 的 data 设置为可选
 */
type PlotOptions<T> = Omit<T, 'width' | 'height' | 'data'> & Partial<Pick<T extends Options ? T : never, 'data'>>;
/**
 * multi-view 中的支持的 plots 类型（带 options 定义）
 */
export type IPlotTypes = {
    /**
     * plot 类型
     */
    readonly type: 'line';
    /**
     * plot 配置
     */
    readonly options: PlotOptions<LineOptions>;
} | {
    readonly type: 'pie';
    readonly options: PlotOptions<PieOptions>;
} | {
    readonly type: 'bar';
    readonly options: PlotOptions<BarOptions>;
} | {
    readonly type: 'column';
    readonly options: PlotOptions<ColumnOptions>;
} | {
    readonly type: 'area';
    readonly options: PlotOptions<AreaOptions>;
} | {
    readonly type: 'gauge';
    readonly options: PlotOptions<GaugeOptions>;
} | {
    readonly type: 'tiny-line';
    readonly options: PlotOptions<TinyLineOptions>;
} | {
    readonly type: 'tiny-area';
    readonly options: PlotOptions<TinyAreaOptions>;
} | {
    readonly type: 'tiny-column';
    readonly options: PlotOptions<TinyColumnOptions>;
} | {
    readonly type: 'ring-progress';
    readonly options: PlotOptions<RingProgressOptions>;
} | {
    readonly type: 'progress';
    readonly options: PlotOptions<ProgressOptions>;
} | {
    readonly type: 'histogram';
    readonly options: PlotOptions<HistogramOptions>;
} | {
    readonly type: 'scatter';
    readonly options: PlotOptions<ScatterOptions>;
} | {
    readonly type: 'funnel';
    readonly options: PlotOptions<FunnelOptions>;
} | {
    readonly type: 'stock';
    readonly options: PlotOptions<StockOptions>;
};
/**
 * 执行 plot 的 adaptor, 默认都带上 defaultOptions
 * @param {string} plot
 */
export declare function execPlotAdaptor<T extends IPlotTypes['type']>(plot: T, view: View, options: IPlotTypes['options']): void;
export {};
