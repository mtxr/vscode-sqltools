import { get } from '@antv/util';
import { deepAssign } from '../../utils';
import { Area } from '../area';
import { adaptor as areaAdaptor } from '../area/adaptor';
import { Bar } from '../bar';
import { adaptor as barAdaptor } from '../bar/adaptor';
import { Column } from '../column';
import { adaptor as columnAdaptor } from '../column/adaptor';
import { Funnel } from '../funnel';
import { adaptor as funnelAdaptor } from '../funnel/adaptor';
import { Gauge } from '../gauge';
import { adaptor as gaugeAdaptor } from '../gauge/adaptor';
import { Histogram } from '../histogram';
import { adaptor as histogramAdaptor } from '../histogram/adaptor';
import { Line } from '../line';
import { adaptor as lineAdaptor } from '../line/adaptor';
import { Pie } from '../pie';
import { adaptor as pieAdaptor } from '../pie/adaptor';
import { Progress } from '../progress';
import { adaptor as progressAdaptor } from '../progress/adaptor';
import { RingProgress } from '../ring-progress';
import { adaptor as ringProgressAdaptor } from '../ring-progress/adaptor';
import { Scatter } from '../scatter';
import { adaptor as scatterAdaptor } from '../scatter/adaptor';
import { Stock } from '../stock';
import { adaptor as stockAdaptor } from '../stock/adaptor';
import { TinyArea } from '../tiny-area';
import { adaptor as tinyAreaAdaptor } from '../tiny-area/adaptor';
import { TinyColumn } from '../tiny-column';
import { adaptor as tinyColumnAdaptor } from '../tiny-column/adaptor';
import { TinyLine } from '../tiny-line';
import { adaptor as tinyLineAdaptor } from '../tiny-line/adaptor';
/**
 * 可在 multi-view 中使用的 plots
 */
var PLOT_ADAPTORS = {
    line: lineAdaptor,
    pie: pieAdaptor,
    column: columnAdaptor,
    bar: barAdaptor,
    area: areaAdaptor,
    gauge: gaugeAdaptor,
    'tiny-line': tinyLineAdaptor,
    'tiny-column': tinyColumnAdaptor,
    'tiny-area': tinyAreaAdaptor,
    'ring-progress': ringProgressAdaptor,
    progress: progressAdaptor,
    scatter: scatterAdaptor,
    histogram: histogramAdaptor,
    funnel: funnelAdaptor,
    stock: stockAdaptor,
};
/**
 * 获取指定 plot 的 class contructor
 * @param {string} plot
 */
var PLOT_CONSTRUCTOR = {
    line: Line,
    pie: Pie,
    column: Column,
    bar: Bar,
    area: Area,
    gauge: Gauge,
    'tiny-line': TinyLine,
    'tiny-column': TinyColumn,
    'tiny-area': TinyArea,
    'ring-progress': RingProgress,
    progress: Progress,
    scatter: Scatter,
    histogram: Histogram,
    funnel: Funnel,
    stock: Stock,
};
/**
 * 在 mix 图表以及 facet 图表中，defaultOptions 进行复写简化
 */
var DEFAULT_OPTIONS_MAP = {
    pie: { label: false },
    column: { tooltip: { showMarkers: false } },
    bar: { tooltip: { showMarkers: false } },
};
/**
 * 执行 plot 的 adaptor, 默认都带上 defaultOptions
 * @param {string} plot
 */
export function execPlotAdaptor(plot, view, options) {
    var cls = PLOT_CONSTRUCTOR[plot];
    if (!cls) {
        console.error("could not find ".concat(plot, " plot"));
        return;
    }
    var module = PLOT_ADAPTORS[plot];
    module({
        chart: view,
        options: deepAssign({}, cls.getDefaultOptions(), get(DEFAULT_OPTIONS_MAP, plot, {}), options),
    });
}
//# sourceMappingURL=utils.js.map