"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flow = exports.P = exports.WordCloud = exports.Waterfall = exports.Violin = exports.Venn = exports.Treemap = exports.TinyLine = exports.TinyColumn = exports.TinyArea = exports.Sunburst = exports.Stock = exports.Scatter = exports.Sankey = exports.Rose = exports.RingProgress = exports.RadialBar = exports.Radar = exports.Progress = exports.Pie = exports.MultiView = exports.Mix = exports.Liquid = exports.addWaterWave = exports.Line = exports.Histogram = exports.Heatmap = exports.Gauge = exports.FUNNEL_CONVERSATION_FIELD = exports.Funnel = exports.Facet = exports.DualAxes = exports.Column = exports.CirclePacking = exports.Chord = exports.Bullet = exports.Box = exports.BidirectionalBar = exports.Bar = exports.Area = exports.Lab = exports.Plot = exports.setGlobal = exports.schema = exports.polygon = exports.point = exports.line = exports.interval = exports.area = exports.version = void 0;
exports.adaptors = exports.registerLocale = exports.G2 = exports.getCanvasPattern = exports.measureTextWidth = void 0;
var tslib_1 = require("tslib");
exports.version = '2.4.32';
// G2 自定义能力透出
var G2 = tslib_1.__importStar(require("@antv/g2"));
exports.G2 = G2;
/** 开放一些通用的 adaptor 通道方法，实验阶段：不保证稳定性 */
var common_1 = require("./adaptor/common");
// 国际化处理
var locale_1 = require("./core/locale");
Object.defineProperty(exports, "registerLocale", { enumerable: true, get: function () { return locale_1.registerLocale; } });
var en_US_1 = require("./locales/en_US");
var zh_CN_1 = require("./locales/zh_CN");
/** 各个 geometry 的 adaptor，可以让开发者更快的构造图形 */
var geometries_1 = require("./adaptor/geometries");
Object.defineProperty(exports, "area", { enumerable: true, get: function () { return geometries_1.area; } });
Object.defineProperty(exports, "interval", { enumerable: true, get: function () { return geometries_1.interval; } });
Object.defineProperty(exports, "line", { enumerable: true, get: function () { return geometries_1.line; } });
Object.defineProperty(exports, "point", { enumerable: true, get: function () { return geometries_1.point; } });
Object.defineProperty(exports, "polygon", { enumerable: true, get: function () { return geometries_1.polygon; } });
Object.defineProperty(exports, "schema", { enumerable: true, get: function () { return geometries_1.schema; } });
/** 全局变量 */
var global_1 = require("./core/global");
Object.defineProperty(exports, "setGlobal", { enumerable: true, get: function () { return global_1.setGlobal; } });
/** G2Plot 的 Plot 基类 */
var plot_1 = require("./core/plot");
Object.defineProperty(exports, "Plot", { enumerable: true, get: function () { return plot_1.Plot; } });
/** 对于没有开发完成的图表，可以暂时先放到 Lab 下面，先做体验，稳定后放到根 export */
var lab_1 = require("./lab");
Object.defineProperty(exports, "Lab", { enumerable: true, get: function () { return lab_1.Lab; } });
// 面积图及类型定义 | author by [hustcc](https://github.com/hustcc)
var area_1 = require("./plots/area");
Object.defineProperty(exports, "Area", { enumerable: true, get: function () { return area_1.Area; } });
// 条形图及类型定义 | author by [BBSQQ](https://github.com/BBSQQ)
var bar_1 = require("./plots/bar");
Object.defineProperty(exports, "Bar", { enumerable: true, get: function () { return bar_1.Bar; } });
// 对称条形图及类型定义 | author by [arcsin1](https://github.com/arcsin1)
var bidirectional_bar_1 = require("./plots/bidirectional-bar");
Object.defineProperty(exports, "BidirectionalBar", { enumerable: true, get: function () { return bidirectional_bar_1.BidirectionalBar; } });
// 箱线图及类型定义 | author by [BBSQQ](https://github.com/BBSQQ), [visiky](https://github.com/visiky)
var box_1 = require("./plots/box");
Object.defineProperty(exports, "Box", { enumerable: true, get: function () { return box_1.Box; } });
// 子弹图及类型定义 | author by [arcsin1](https://github.com/arcsin1)
var bullet_1 = require("./plots/bullet");
Object.defineProperty(exports, "Bullet", { enumerable: true, get: function () { return bullet_1.Bullet; } });
// 弦图及类型定义 | author by [MrSmallLiu](https://github.com/MrSmallLiu), [visiky](https://github.com/visiky)
var chord_1 = require("./plots/chord");
Object.defineProperty(exports, "Chord", { enumerable: true, get: function () { return chord_1.Chord; } });
// circle-packing 及类型定义 | author by [visiky](https://github.com/visiky), [Angeli](https://github.com/Angelii)
var circle_packing_1 = require("./plots/circle-packing");
Object.defineProperty(exports, "CirclePacking", { enumerable: true, get: function () { return circle_packing_1.CirclePacking; } });
// 柱形图及类型定义 | author by [zqlu](https://github.com/zqlu)
var column_1 = require("./plots/column");
Object.defineProperty(exports, "Column", { enumerable: true, get: function () { return column_1.Column; } });
// 混合图形 | author by [liuzhenying](https://github.com/liuzhenying)
var dual_axes_1 = require("./plots/dual-axes");
Object.defineProperty(exports, "DualAxes", { enumerable: true, get: function () { return dual_axes_1.DualAxes; } });
// 分面图及类型定义 | author by [visiky](https://github.com/visiky)
var facet_1 = require("./plots/facet");
Object.defineProperty(exports, "Facet", { enumerable: true, get: function () { return facet_1.Facet; } });
// 漏斗图及类型定义
var funnel_1 = require("./plots/funnel");
Object.defineProperty(exports, "Funnel", { enumerable: true, get: function () { return funnel_1.Funnel; } });
Object.defineProperty(exports, "FUNNEL_CONVERSATION_FIELD", { enumerable: true, get: function () { return funnel_1.FUNNEL_CONVERSATION_FIELD; } });
// 仪表盘及类型定义 | author by [hustcc](https://github.com/hustcc)
var gauge_1 = require("./plots/gauge");
Object.defineProperty(exports, "Gauge", { enumerable: true, get: function () { return gauge_1.Gauge; } });
// 热力图及类型定义 | author by [jiazhewang](https://github.com/jiazhewang)
var heatmap_1 = require("./plots/heatmap");
Object.defineProperty(exports, "Heatmap", { enumerable: true, get: function () { return heatmap_1.Heatmap; } });
// 直方图及类型定义 | author by [arcsin1](https://github.com/arcsin1), [visiky](https://github.com/visiky)
var histogram_1 = require("./plots/histogram");
Object.defineProperty(exports, "Histogram", { enumerable: true, get: function () { return histogram_1.Histogram; } });
// 折线图及类型定义 | author by [hustcc](https://github.com/hustcc)
var line_1 = require("./plots/line");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return line_1.Line; } });
// 水波图及类型定义 | author by [CarisL](https://github.com/CarisL), [hustcc](https://github.com/hustcc), [pearmini](https://github.com/pearmini)
var liquid_1 = require("./plots/liquid");
Object.defineProperty(exports, "addWaterWave", { enumerable: true, get: function () { return liquid_1.addWaterWave; } });
Object.defineProperty(exports, "Liquid", { enumerable: true, get: function () { return liquid_1.Liquid; } });
// 已经废弃，更名为 Mix
var mix_1 = require("./plots/mix");
Object.defineProperty(exports, "Mix", { enumerable: true, get: function () { return mix_1.Mix; } });
Object.defineProperty(exports, "MultiView", { enumerable: true, get: function () { return mix_1.Mix; } });
// 饼图及类型定义 | author by [visiky](https://github.com/visiky)
var pie_1 = require("./plots/pie");
Object.defineProperty(exports, "Pie", { enumerable: true, get: function () { return pie_1.Pie; } });
// 进度图及类型定义 | author by [connono](https://github.com/connono)
var progress_1 = require("./plots/progress");
Object.defineProperty(exports, "Progress", { enumerable: true, get: function () { return progress_1.Progress; } });
// 雷达图及类型定义 | author by [visiky](https://github.com/visiky)
var radar_1 = require("./plots/radar");
Object.defineProperty(exports, "Radar", { enumerable: true, get: function () { return radar_1.Radar; } });
// 玉珏图 | author by [yujs](https://github.com/yujs) | updated by [visiky](https://github.com/visiky)
var radial_bar_1 = require("./plots/radial-bar");
Object.defineProperty(exports, "RadialBar", { enumerable: true, get: function () { return radial_bar_1.RadialBar; } });
// 环形进度图及类型定义 | author by [connono](https://github.com/connono)
var ring_progress_1 = require("./plots/ring-progress");
Object.defineProperty(exports, "RingProgress", { enumerable: true, get: function () { return ring_progress_1.RingProgress; } });
// 玫瑰图及类型定义 | author by [zhangzhonghe](https://github.com/zhangzhonghe)
var rose_1 = require("./plots/rose");
Object.defineProperty(exports, "Rose", { enumerable: true, get: function () { return rose_1.Rose; } });
// 桑基图及类型定义 | author by [hustcc](https://github.com/hustcc)
var sankey_1 = require("./plots/sankey");
Object.defineProperty(exports, "Sankey", { enumerable: true, get: function () { return sankey_1.Sankey; } });
// 散点图及类型定义 | author by [lxfu1](https://github.com/lxfu1)
var scatter_1 = require("./plots/scatter");
Object.defineProperty(exports, "Scatter", { enumerable: true, get: function () { return scatter_1.Scatter; } });
// K线图及类型定义 | author by [jhwong](https://github.com/jinhuiWong), [visiky](https://github.com/visiky)
var stock_1 = require("./plots/stock");
Object.defineProperty(exports, "Stock", { enumerable: true, get: function () { return stock_1.Stock; } });
// 旭日图及类型定义 | author by [lxfu1](https://github.com/lxfu1), [visiky](https://github.com/visiky)
var sunburst_1 = require("./plots/sunburst");
Object.defineProperty(exports, "Sunburst", { enumerable: true, get: function () { return sunburst_1.Sunburst; } });
// 迷你面积图及类型定义 | author by [connono](https://github.com/connono)
var tiny_area_1 = require("./plots/tiny-area");
Object.defineProperty(exports, "TinyArea", { enumerable: true, get: function () { return tiny_area_1.TinyArea; } });
// 迷你柱形图及类型定义 | author by [connono](https://github.com/connono)
var tiny_column_1 = require("./plots/tiny-column");
Object.defineProperty(exports, "TinyColumn", { enumerable: true, get: function () { return tiny_column_1.TinyColumn; } });
// 迷你折线图及类型定义 | author by [connono](https://github.com/connono)
var tiny_line_1 = require("./plots/tiny-line");
Object.defineProperty(exports, "TinyLine", { enumerable: true, get: function () { return tiny_line_1.TinyLine; } });
// 矩形树图
var treemap_1 = require("./plots/treemap");
Object.defineProperty(exports, "Treemap", { enumerable: true, get: function () { return treemap_1.Treemap; } });
// 韦恩图及类型定义 | author by [visiky](https://github.com/visiky)
var venn_1 = require("./plots/venn");
Object.defineProperty(exports, "Venn", { enumerable: true, get: function () { return venn_1.Venn; } });
// 小提琴图及类型定义 | author by [YiSiWang](https://github.com/YiSiWang), [visiky](https://github.com/visiky)
var violin_1 = require("./plots/violin");
Object.defineProperty(exports, "Violin", { enumerable: true, get: function () { return violin_1.Violin; } });
// 瀑布图 | author by [visiky](https://github.com/visiky)
var waterfall_1 = require("./plots/waterfall");
Object.defineProperty(exports, "Waterfall", { enumerable: true, get: function () { return waterfall_1.Waterfall; } });
// 词云图及类型定义 | author by [zhangzhonghe](https://github.com/zhangzhonghe)
var word_cloud_1 = require("./plots/word-cloud");
Object.defineProperty(exports, "WordCloud", { enumerable: true, get: function () { return word_cloud_1.WordCloud; } });
// 以下开放自定义图表开发的能力（目前仅仅是孵化中）
/** 所有开放图表都使用 G2Plot.P 作为入口开发，理论上官方的所有图表都可以走 G2Plot.P 的入口（暂时不处理） */
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "P", { enumerable: true, get: function () { return plugin_1.P; } });
// 类型定义导出
tslib_1.__exportStar(require("./types"), exports);
/** 开发 adaptor 可能会用到的方法或一些工具方法，不强制使用 */
var utils_1 = require("./utils");
Object.defineProperty(exports, "flow", { enumerable: true, get: function () { return utils_1.flow; } });
Object.defineProperty(exports, "measureTextWidth", { enumerable: true, get: function () { return utils_1.measureTextWidth; } });
/** 开放 getCanvasPatterng 方法 */
var pattern_1 = require("./utils/pattern");
Object.defineProperty(exports, "getCanvasPattern", { enumerable: true, get: function () { return pattern_1.getCanvasPattern; } });
/** default locale register */
(0, locale_1.registerLocale)('en-US', en_US_1.EN_US_LOCALE);
(0, locale_1.registerLocale)('zh-CN', zh_CN_1.ZH_CN_LOCALE);
exports.adaptors = { scale: common_1.scale, legend: common_1.legend, tooltip: common_1.tooltip, annotation: common_1.annotation, interaction: common_1.interaction, theme: common_1.theme, animation: common_1.animation };
//# sourceMappingURL=index.js.map