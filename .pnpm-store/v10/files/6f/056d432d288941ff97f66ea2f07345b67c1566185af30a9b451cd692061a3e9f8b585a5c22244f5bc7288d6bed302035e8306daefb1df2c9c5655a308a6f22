"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execPlotAdaptor = void 0;
var util_1 = require("@antv/util");
var utils_1 = require("../../utils");
var area_1 = require("../area");
var adaptor_1 = require("../area/adaptor");
var bar_1 = require("../bar");
var adaptor_2 = require("../bar/adaptor");
var column_1 = require("../column");
var adaptor_3 = require("../column/adaptor");
var funnel_1 = require("../funnel");
var adaptor_4 = require("../funnel/adaptor");
var gauge_1 = require("../gauge");
var adaptor_5 = require("../gauge/adaptor");
var histogram_1 = require("../histogram");
var adaptor_6 = require("../histogram/adaptor");
var line_1 = require("../line");
var adaptor_7 = require("../line/adaptor");
var pie_1 = require("../pie");
var adaptor_8 = require("../pie/adaptor");
var progress_1 = require("../progress");
var adaptor_9 = require("../progress/adaptor");
var ring_progress_1 = require("../ring-progress");
var adaptor_10 = require("../ring-progress/adaptor");
var scatter_1 = require("../scatter");
var adaptor_11 = require("../scatter/adaptor");
var stock_1 = require("../stock");
var adaptor_12 = require("../stock/adaptor");
var tiny_area_1 = require("../tiny-area");
var adaptor_13 = require("../tiny-area/adaptor");
var tiny_column_1 = require("../tiny-column");
var adaptor_14 = require("../tiny-column/adaptor");
var tiny_line_1 = require("../tiny-line");
var adaptor_15 = require("../tiny-line/adaptor");
/**
 * 可在 multi-view 中使用的 plots
 */
var PLOT_ADAPTORS = {
    line: adaptor_7.adaptor,
    pie: adaptor_8.adaptor,
    column: adaptor_3.adaptor,
    bar: adaptor_2.adaptor,
    area: adaptor_1.adaptor,
    gauge: adaptor_5.adaptor,
    'tiny-line': adaptor_15.adaptor,
    'tiny-column': adaptor_14.adaptor,
    'tiny-area': adaptor_13.adaptor,
    'ring-progress': adaptor_10.adaptor,
    progress: adaptor_9.adaptor,
    scatter: adaptor_11.adaptor,
    histogram: adaptor_6.adaptor,
    funnel: adaptor_4.adaptor,
    stock: adaptor_12.adaptor,
};
/**
 * 获取指定 plot 的 class contructor
 * @param {string} plot
 */
var PLOT_CONSTRUCTOR = {
    line: line_1.Line,
    pie: pie_1.Pie,
    column: column_1.Column,
    bar: bar_1.Bar,
    area: area_1.Area,
    gauge: gauge_1.Gauge,
    'tiny-line': tiny_line_1.TinyLine,
    'tiny-column': tiny_column_1.TinyColumn,
    'tiny-area': tiny_area_1.TinyArea,
    'ring-progress': ring_progress_1.RingProgress,
    progress: progress_1.Progress,
    scatter: scatter_1.Scatter,
    histogram: histogram_1.Histogram,
    funnel: funnel_1.Funnel,
    stock: stock_1.Stock,
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
function execPlotAdaptor(plot, view, options) {
    var cls = PLOT_CONSTRUCTOR[plot];
    if (!cls) {
        console.error("could not find ".concat(plot, " plot"));
        return;
    }
    var module = PLOT_ADAPTORS[plot];
    module({
        chart: view,
        options: (0, utils_1.deepAssign)({}, cls.getDefaultOptions(), (0, util_1.get)(DEFAULT_OPTIONS_MAP, plot, {}), options),
    });
}
exports.execPlotAdaptor = execPlotAdaptor;
//# sourceMappingURL=utils.js.map