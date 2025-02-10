"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELEMENT_RANGE_HIGHLIGHT_EVENTS = exports.BRUSH_FILTER_EVENTS = exports.VIEW_LIFE_CIRCLE = void 0;
var tslib_1 = require("tslib");
// 注册黑暗主题
var core_1 = require("./core");
var dark_1 = require("./theme/style-sheet/dark");
var create_by_style_sheet_1 = require("./theme/util/create-by-style-sheet");
(0, core_1.registerTheme)('dark', (0, create_by_style_sheet_1.createThemeByStyleSheet)(dark_1.antvDark));
// 注册 G 渲染引擎
var CanvasEngine = tslib_1.__importStar(require("@antv/g-canvas"));
var SVGEngine = tslib_1.__importStar(require("@antv/g-svg"));
var core_2 = require("./core");
(0, core_2.registerEngine)('canvas', CanvasEngine);
(0, core_2.registerEngine)('svg', SVGEngine);
// 注册 G2 内置的 geometry
var core_3 = require("./core");
var area_1 = tslib_1.__importDefault(require("./geometry/area"));
var edge_1 = tslib_1.__importDefault(require("./geometry/edge"));
var heatmap_1 = tslib_1.__importDefault(require("./geometry/heatmap"));
var interval_1 = tslib_1.__importDefault(require("./geometry/interval"));
var line_1 = tslib_1.__importDefault(require("./geometry/line"));
var path_1 = tslib_1.__importDefault(require("./geometry/path"));
var point_1 = tslib_1.__importDefault(require("./geometry/point"));
var polygon_1 = tslib_1.__importDefault(require("./geometry/polygon"));
var schema_1 = tslib_1.__importDefault(require("./geometry/schema"));
var violin_1 = tslib_1.__importDefault(require("./geometry/violin"));
(0, core_3.registerGeometry)('Polygon', polygon_1.default);
(0, core_3.registerGeometry)('Interval', interval_1.default);
(0, core_3.registerGeometry)('Schema', schema_1.default);
(0, core_3.registerGeometry)('Path', path_1.default);
(0, core_3.registerGeometry)('Point', point_1.default);
(0, core_3.registerGeometry)('Line', line_1.default);
(0, core_3.registerGeometry)('Area', area_1.default);
(0, core_3.registerGeometry)('Edge', edge_1.default);
(0, core_3.registerGeometry)('Heatmap', heatmap_1.default);
(0, core_3.registerGeometry)('Violin', violin_1.default);
// 引入所有内置的 shapes
require("./geometry/shape/area/line");
require("./geometry/shape/area/smooth");
require("./geometry/shape/area/smooth-line");
require("./geometry/shape/edge/arc");
require("./geometry/shape/edge/smooth");
require("./geometry/shape/edge/vhv");
require("./geometry/shape/interval/funnel");
require("./geometry/shape/interval/hollow-rect");
require("./geometry/shape/interval/line");
require("./geometry/shape/interval/pyramid");
require("./geometry/shape/interval/tick");
require("./geometry/shape/line/step");
require("./geometry/shape/point/hollow");
require("./geometry/shape/point/image");
require("./geometry/shape/point/solid");
require("./geometry/shape/schema/box");
require("./geometry/shape/schema/candle");
require("./geometry/shape/polygon/square");
require("./geometry/shape/violin/smooth");
require("./geometry/shape/violin/hollow");
// 注册 Geometry 内置的 label
var core_4 = require("./core");
var base_1 = tslib_1.__importDefault(require("./geometry/label/base"));
var interval_2 = tslib_1.__importDefault(require("./geometry/label/interval"));
var pie_1 = tslib_1.__importDefault(require("./geometry/label/pie"));
var polar_1 = tslib_1.__importDefault(require("./geometry/label/polar"));
(0, core_4.registerGeometryLabel)('base', base_1.default);
(0, core_4.registerGeometryLabel)('interval', interval_2.default);
(0, core_4.registerGeometryLabel)('pie', pie_1.default);
(0, core_4.registerGeometryLabel)('polar', polar_1.default);
// 注册 Geometry label 内置的布局函数
var core_5 = require("./core");
var distribute_1 = require("./geometry/label/layout/pie/distribute");
var outer_1 = require("./geometry/label/layout/pie/outer");
var spider_1 = require("./geometry/label/layout/pie/spider");
var limit_in_canvas_1 = require("./geometry/label/layout/limit-in-canvas");
var limit_in_shape_1 = require("./geometry/label/layout/limit-in-shape");
var overlap_1 = require("./geometry/label/layout/overlap");
var hide_overlap_1 = require("./geometry/label/layout/hide-overlap");
var adjust_color_1 = require("./geometry/label/layout/adjust-color");
var adjust_position_1 = require("./geometry/label/layout/interval/adjust-position");
var hide_overlap_2 = require("./geometry/label/layout/interval/hide-overlap");
var adjust_position_2 = require("./geometry/label/layout/point/adjust-position");
var adjust_position_3 = require("./geometry/label/layout/path/adjust-position");
var limit_in_plot_1 = require("./geometry/label/layout/limit-in-plot");
(0, core_5.registerGeometryLabelLayout)('overlap', overlap_1.overlap);
(0, core_5.registerGeometryLabelLayout)('distribute', distribute_1.distribute);
(0, core_5.registerGeometryLabelLayout)('fixed-overlap', overlap_1.fixedOverlap);
(0, core_5.registerGeometryLabelLayout)('hide-overlap', hide_overlap_1.hideOverlap);
(0, core_5.registerGeometryLabelLayout)('limit-in-shape', limit_in_shape_1.limitInShape);
(0, core_5.registerGeometryLabelLayout)('limit-in-canvas', limit_in_canvas_1.limitInCanvas);
(0, core_5.registerGeometryLabelLayout)('limit-in-plot', limit_in_plot_1.limitInPlot);
(0, core_5.registerGeometryLabelLayout)('pie-outer', outer_1.pieOuterLabelLayout);
(0, core_5.registerGeometryLabelLayout)('adjust-color', adjust_color_1.adjustColor);
(0, core_5.registerGeometryLabelLayout)('interval-adjust-position', adjust_position_1.intervalAdjustPosition);
(0, core_5.registerGeometryLabelLayout)('interval-hide-overlap', hide_overlap_2.intervalHideOverlap);
(0, core_5.registerGeometryLabelLayout)('point-adjust-position', adjust_position_2.pointAdjustPosition);
(0, core_5.registerGeometryLabelLayout)('pie-spider', spider_1.pieSpiderLabelLayout);
(0, core_5.registerGeometryLabelLayout)('path-adjust-position', adjust_position_3.pathAdjustPosition);
// 注册需要的动画执行函数
var fade_1 = require("./animate/animation/fade");
var grow_in_1 = require("./animate/animation/grow-in");
var path_in_1 = require("./animate/animation/path-in");
var position_update_1 = require("./animate/animation/position-update");
var scale_in_1 = require("./animate/animation/scale-in");
var sector_path_update_1 = require("./animate/animation/sector-path-update");
var wave_in_1 = require("./animate/animation/wave-in");
var zoom_1 = require("./animate/animation/zoom");
var core_6 = require("./core");
(0, core_6.registerAnimation)('fade-in', fade_1.fadeIn);
(0, core_6.registerAnimation)('fade-out', fade_1.fadeOut);
(0, core_6.registerAnimation)('grow-in-x', grow_in_1.growInX);
(0, core_6.registerAnimation)('grow-in-xy', grow_in_1.growInXY);
(0, core_6.registerAnimation)('grow-in-y', grow_in_1.growInY);
(0, core_6.registerAnimation)('scale-in-x', scale_in_1.scaleInX);
(0, core_6.registerAnimation)('scale-in-y', scale_in_1.scaleInY);
(0, core_6.registerAnimation)('wave-in', wave_in_1.waveIn);
(0, core_6.registerAnimation)('zoom-in', zoom_1.zoomIn);
(0, core_6.registerAnimation)('zoom-out', zoom_1.zoomOut);
(0, core_6.registerAnimation)('position-update', position_update_1.positionUpdate);
(0, core_6.registerAnimation)('sector-path-update', sector_path_update_1.sectorPathUpdate);
(0, core_6.registerAnimation)('path-in', path_in_1.pathIn);
// 注册内置的 Facet
var core_7 = require("./core");
var circle_1 = tslib_1.__importDefault(require("./facet/circle"));
var list_1 = tslib_1.__importDefault(require("./facet/list"));
var matrix_1 = tslib_1.__importDefault(require("./facet/matrix"));
var mirror_1 = tslib_1.__importDefault(require("./facet/mirror"));
var rect_1 = tslib_1.__importDefault(require("./facet/rect"));
var tree_1 = tslib_1.__importDefault(require("./facet/tree"));
(0, core_7.registerFacet)('rect', rect_1.default);
(0, core_7.registerFacet)('mirror', mirror_1.default);
(0, core_7.registerFacet)('list', list_1.default);
(0, core_7.registerFacet)('matrix', matrix_1.default);
(0, core_7.registerFacet)('circle', circle_1.default);
(0, core_7.registerFacet)('tree', tree_1.default);
// 注册内置的 Component
var core_8 = require("./core");
var annotation_1 = tslib_1.__importDefault(require("./chart/controller/annotation"));
var axis_1 = tslib_1.__importDefault(require("./chart/controller/axis"));
var legend_1 = tslib_1.__importDefault(require("./chart/controller/legend"));
var slider_1 = tslib_1.__importDefault(require("./chart/controller/slider"));
var tooltip_1 = tslib_1.__importDefault(require("./chart/controller/tooltip"));
var scrollbar_1 = tslib_1.__importDefault(require("./chart/controller/scrollbar"));
// register build-in components
(0, core_8.registerComponentController)('axis', axis_1.default);
(0, core_8.registerComponentController)('legend', legend_1.default);
(0, core_8.registerComponentController)('tooltip', tooltip_1.default);
(0, core_8.registerComponentController)('annotation', annotation_1.default);
(0, core_8.registerComponentController)('slider', slider_1.default);
(0, core_8.registerComponentController)('scrollbar', scrollbar_1.default);
// 注册 Interaction Action
var core_9 = require("./core");
var active_region_1 = tslib_1.__importDefault(require("./interaction/action/active-region"));
var sibling_1 = tslib_1.__importDefault(require("./interaction/action/component/tooltip/sibling"));
var geometry_1 = tslib_1.__importDefault(require("./interaction/action/component/tooltip/geometry"));
var ellipsis_text_1 = tslib_1.__importDefault(require("./interaction/action/component/tooltip/ellipsis-text"));
var active_1 = tslib_1.__importDefault(require("./interaction/action/element/active"));
var link_by_color_1 = tslib_1.__importDefault(require("./interaction/action/element/link-by-color"));
var range_active_1 = tslib_1.__importDefault(require("./interaction/action/element/range-active"));
var single_active_1 = tslib_1.__importDefault(require("./interaction/action/element/single-active"));
var highlight_1 = tslib_1.__importDefault(require("./interaction/action/element/highlight"));
var highlight_by_color_1 = tslib_1.__importDefault(require("./interaction/action/element/highlight-by-color"));
var highlight_by_x_1 = tslib_1.__importDefault(require("./interaction/action/element/highlight-by-x"));
var range_highlight_1 = tslib_1.__importStar(require("./interaction/action/element/range-highlight"));
Object.defineProperty(exports, "ELEMENT_RANGE_HIGHLIGHT_EVENTS", { enumerable: true, get: function () { return range_highlight_1.ELEMENT_RANGE_HIGHLIGHT_EVENTS; } });
var single_highlight_1 = tslib_1.__importDefault(require("./interaction/action/element/single-highlight"));
var range_selected_1 = tslib_1.__importDefault(require("./interaction/action/element/range-selected"));
var selected_1 = tslib_1.__importDefault(require("./interaction/action/element/selected"));
var single_selected_1 = tslib_1.__importDefault(require("./interaction/action/element/single-selected"));
var list_active_1 = tslib_1.__importDefault(require("./interaction/action/component/list-active"));
var list_highlight_1 = tslib_1.__importDefault(require("./interaction/action/component/list-highlight"));
var list_selected_1 = tslib_1.__importDefault(require("./interaction/action/component/list-selected"));
var list_unchecked_1 = tslib_1.__importDefault(require("./interaction/action/component/list-unchecked"));
var list_checked_1 = tslib_1.__importDefault(require("./interaction/action/component/list-checked"));
var list_focus_1 = tslib_1.__importDefault(require("./interaction/action/component/list-focus"));
var list_radio_1 = tslib_1.__importDefault(require("./interaction/action/component/list-radio"));
var circle_2 = tslib_1.__importDefault(require("./interaction/action/mask/circle"));
var dim_rect_1 = tslib_1.__importDefault(require("./interaction/action/mask/dim-rect"));
var path_2 = tslib_1.__importDefault(require("./interaction/action/mask/path"));
var rect_2 = tslib_1.__importDefault(require("./interaction/action/mask/rect"));
var smooth_path_1 = tslib_1.__importDefault(require("./interaction/action/mask/smooth-path"));
var rect_3 = tslib_1.__importDefault(require("./interaction/action/mask/multiple/rect"));
var dim_rect_2 = tslib_1.__importDefault(require("./interaction/action/mask/multiple/dim-rect"));
var circle_3 = tslib_1.__importDefault(require("./interaction/action/mask/multiple/circle"));
var path_3 = tslib_1.__importDefault(require("./interaction/action/mask/multiple/path"));
var smooth_path_2 = tslib_1.__importDefault(require("./interaction/action/mask/multiple/smooth-path"));
var cursor_1 = tslib_1.__importDefault(require("./interaction/action/cursor"));
var filter_1 = tslib_1.__importDefault(require("./interaction/action/data/filter"));
var range_filter_1 = tslib_1.__importStar(require("./interaction/action/data/range-filter"));
Object.defineProperty(exports, "BRUSH_FILTER_EVENTS", { enumerable: true, get: function () { return range_filter_1.BRUSH_FILTER_EVENTS; } });
var sibling_filter_1 = tslib_1.__importDefault(require("./interaction/action/data/sibling-filter"));
var filter_2 = tslib_1.__importDefault(require("./interaction/action/element/filter"));
var sibling_filter_2 = tslib_1.__importDefault(require("./interaction/action/element/sibling-filter"));
var button_1 = tslib_1.__importDefault(require("./interaction/action/view/button"));
var drag_1 = tslib_1.__importDefault(require("./interaction/action/view/drag"));
var move_1 = tslib_1.__importDefault(require("./interaction/action/view/move"));
var scale_translate_1 = tslib_1.__importDefault(require("./interaction/action/view/scale-translate"));
var scale_zoom_1 = tslib_1.__importDefault(require("./interaction/action/view/scale-zoom"));
var mousewheel_scroll_1 = tslib_1.__importDefault(require("./interaction/action/view/mousewheel-scroll"));
var axis_description_1 = tslib_1.__importDefault(require("./interaction/action/component/axis/axis-description"));
(0, core_9.registerAction)('tooltip', geometry_1.default);
(0, core_9.registerAction)('sibling-tooltip', sibling_1.default);
(0, core_9.registerAction)('ellipsis-text', ellipsis_text_1.default);
(0, core_9.registerAction)('element-active', active_1.default);
(0, core_9.registerAction)('element-single-active', single_active_1.default);
(0, core_9.registerAction)('element-range-active', range_active_1.default);
(0, core_9.registerAction)('element-highlight', highlight_1.default);
(0, core_9.registerAction)('element-highlight-by-x', highlight_by_x_1.default);
(0, core_9.registerAction)('element-highlight-by-color', highlight_by_color_1.default);
(0, core_9.registerAction)('element-single-highlight', single_highlight_1.default);
(0, core_9.registerAction)('element-range-highlight', range_highlight_1.default);
(0, core_9.registerAction)('element-sibling-highlight', range_highlight_1.default, {
    effectSiblings: true,
    effectByRecord: true,
});
(0, core_9.registerAction)('element-selected', selected_1.default);
(0, core_9.registerAction)('element-single-selected', single_selected_1.default);
(0, core_9.registerAction)('element-range-selected', range_selected_1.default);
(0, core_9.registerAction)('element-link-by-color', link_by_color_1.default);
(0, core_9.registerAction)('active-region', active_region_1.default);
(0, core_9.registerAction)('list-active', list_active_1.default);
(0, core_9.registerAction)('list-selected', list_selected_1.default);
(0, core_9.registerAction)('list-highlight', list_highlight_1.default);
(0, core_9.registerAction)('list-unchecked', list_unchecked_1.default);
(0, core_9.registerAction)('list-checked', list_checked_1.default);
(0, core_9.registerAction)('list-focus', list_focus_1.default);
(0, core_9.registerAction)('list-radio', list_radio_1.default);
(0, core_9.registerAction)('legend-item-highlight', list_highlight_1.default, {
    componentNames: ['legend'],
});
(0, core_9.registerAction)('axis-label-highlight', list_highlight_1.default, {
    componentNames: ['axis'],
});
(0, core_9.registerAction)('axis-description', axis_description_1.default);
(0, core_9.registerAction)('rect-mask', rect_2.default);
(0, core_9.registerAction)('x-rect-mask', dim_rect_1.default, { dim: 'x' });
(0, core_9.registerAction)('y-rect-mask', dim_rect_1.default, { dim: 'y' });
(0, core_9.registerAction)('circle-mask', circle_2.default);
(0, core_9.registerAction)('path-mask', path_2.default);
(0, core_9.registerAction)('smooth-path-mask', smooth_path_1.default);
(0, core_9.registerAction)('rect-multi-mask', rect_3.default);
(0, core_9.registerAction)('x-rect-multi-mask', dim_rect_2.default, { dim: 'x' });
(0, core_9.registerAction)('y-rect-multi-mask', dim_rect_2.default, { dim: 'y' });
(0, core_9.registerAction)('circle-multi-mask', circle_3.default);
(0, core_9.registerAction)('path-multi-mask', path_3.default);
(0, core_9.registerAction)('smooth-path-multi-mask', smooth_path_2.default);
(0, core_9.registerAction)('cursor', cursor_1.default);
(0, core_9.registerAction)('data-filter', filter_1.default);
(0, core_9.registerAction)('brush', range_filter_1.default);
(0, core_9.registerAction)('brush-x', range_filter_1.default, { dims: ['x'] });
(0, core_9.registerAction)('brush-y', range_filter_1.default, { dims: ['y'] });
(0, core_9.registerAction)('sibling-filter', sibling_filter_1.default);
(0, core_9.registerAction)('sibling-x-filter', sibling_filter_1.default, { dims: 'x' });
(0, core_9.registerAction)('sibling-y-filter', sibling_filter_1.default, { dims: 'y' });
(0, core_9.registerAction)('element-filter', filter_2.default);
(0, core_9.registerAction)('element-sibling-filter', sibling_filter_2.default);
(0, core_9.registerAction)('element-sibling-filter-record', sibling_filter_2.default, { byRecord: true });
(0, core_9.registerAction)('view-drag', drag_1.default);
(0, core_9.registerAction)('view-move', move_1.default);
(0, core_9.registerAction)('scale-translate', scale_translate_1.default);
(0, core_9.registerAction)('scale-zoom', scale_zoom_1.default);
(0, core_9.registerAction)('reset-button', button_1.default, {
    name: 'reset-button',
    text: 'reset',
});
(0, core_9.registerAction)('mousewheel-scroll', mousewheel_scroll_1.default);
// 注册默认的 Interaction 交互行为
var core_10 = require("./core");
var util_1 = require("./interaction/action/util");
function isPointInView(context) {
    return context.isInPlot();
}
// 注册 tooltip 的 interaction
(0, core_10.registerInteraction)('tooltip', {
    start: [
        { trigger: 'plot:mousemove', action: 'tooltip:show', throttle: { wait: 50, leading: true, trailing: false } },
        { trigger: 'plot:touchmove', action: 'tooltip:show', throttle: { wait: 50, leading: true, trailing: false } },
    ],
    end: [
        { trigger: 'plot:mouseleave', action: 'tooltip:hide' },
        { trigger: 'plot:leave', action: 'tooltip:hide' },
        { trigger: 'plot:touchend', action: 'tooltip:hide' },
    ],
});
(0, core_10.registerInteraction)('ellipsis-text', {
    start: [
        {
            trigger: 'legend-item-name:mousemove',
            action: 'ellipsis-text:show',
            throttle: { wait: 50, leading: true, trailing: false },
        },
        {
            trigger: 'legend-item-name:touchstart',
            action: 'ellipsis-text:show',
            throttle: { wait: 50, leading: true, trailing: false },
        },
        {
            trigger: 'axis-label:mousemove',
            action: 'ellipsis-text:show',
            throttle: { wait: 50, leading: true, trailing: false },
        },
        {
            trigger: 'axis-label:touchstart',
            action: 'ellipsis-text:show',
            throttle: { wait: 50, leading: true, trailing: false },
        },
    ],
    end: [
        { trigger: 'legend-item-name:mouseleave', action: 'ellipsis-text:hide' },
        { trigger: 'legend-item-name:touchend', action: 'ellipsis-text:hide' },
        { trigger: 'axis-label:mouseleave', action: 'ellipsis-text:hide' },
        { trigger: 'axis-label:mouseout', action: 'ellipsis-text:hide' },
        { trigger: 'axis-label:touchend', action: 'ellipsis-text:hide' },
    ],
});
// 移动到 element 上 active
(0, core_10.registerInteraction)('element-active', {
    start: [{ trigger: 'element:mouseenter', action: 'element-active:active' }],
    end: [{ trigger: 'element:mouseleave', action: 'element-active:reset' }],
});
// 点击选中，允许取消
(0, core_10.registerInteraction)('element-selected', {
    start: [{ trigger: 'element:click', action: 'element-selected:toggle' }],
});
// hover highlight，允许取消
(0, core_10.registerInteraction)('element-highlight', {
    start: [{ trigger: 'element:mouseenter', action: 'element-highlight:highlight' }],
    end: [{ trigger: 'element:mouseleave', action: 'element-highlight:reset' }],
});
// hover highlight by x，允许取消
(0, core_10.registerInteraction)('element-highlight-by-x', {
    start: [{ trigger: 'element:mouseenter', action: 'element-highlight-by-x:highlight' }],
    end: [{ trigger: 'element:mouseleave', action: 'element-highlight-by-x:reset' }],
});
// hover highlight by y，允许取消
(0, core_10.registerInteraction)('element-highlight-by-color', {
    start: [{ trigger: 'element:mouseenter', action: 'element-highlight-by-color:highlight' }],
    end: [{ trigger: 'element:mouseleave', action: 'element-highlight-by-color:reset' }],
});
// legend hover，element active
(0, core_10.registerInteraction)('legend-active', {
    start: [{ trigger: 'legend-item:mouseenter', action: ['list-active:active', 'element-active:active'] }],
    end: [{ trigger: 'legend-item:mouseleave', action: ['list-active:reset', 'element-active:reset'] }],
});
// legend hover，element active
(0, core_10.registerInteraction)('legend-highlight', {
    start: [
        { trigger: 'legend-item:mouseenter', action: ['legend-item-highlight:highlight', 'element-highlight:highlight'] },
    ],
    end: [{ trigger: 'legend-item:mouseleave', action: ['legend-item-highlight:reset', 'element-highlight:reset'] }],
});
// legend hover，element active
(0, core_10.registerInteraction)('axis-label-highlight', {
    start: [
        { trigger: 'axis-label:mouseenter', action: ['axis-label-highlight:highlight', 'element-highlight:highlight'] },
    ],
    end: [{ trigger: 'axis-label:mouseleave', action: ['axis-label-highlight:reset', 'element-highlight:reset'] }],
});
// legend hover，element active
(0, core_10.registerInteraction)('element-list-highlight', {
    start: [{ trigger: 'element:mouseenter', action: ['list-highlight:highlight', 'element-highlight:highlight'] }],
    end: [{ trigger: 'element:mouseleave', action: ['list-highlight:reset', 'element-highlight:reset'] }],
});
// 框选
(0, core_10.registerInteraction)('element-range-highlight', {
    showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'mask:mouseenter', action: 'cursor:move' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
        { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
    ],
    start: [
        {
            trigger: 'plot:mousedown',
            isEnable: function (context) {
                // 不要点击在 mask 上重新开始
                return !context.isInShape('mask');
            },
            action: ['rect-mask:start', 'rect-mask:show'],
        },
        {
            trigger: 'mask:dragstart',
            action: ['rect-mask:moveStart'],
        },
    ],
    processing: [
        {
            trigger: 'plot:mousemove',
            action: ['rect-mask:resize'],
        },
        {
            trigger: 'mask:drag',
            action: ['rect-mask:move'],
        },
        {
            trigger: 'mask:change',
            action: ['element-range-highlight:highlight'],
        },
    ],
    end: [
        { trigger: 'plot:mouseup', action: ['rect-mask:end'] },
        { trigger: 'mask:dragend', action: ['rect-mask:moveEnd'] },
        {
            trigger: 'document:mouseup',
            isEnable: function (context) {
                return !context.isInPlot();
            },
            action: ['element-range-highlight:clear', 'rect-mask:end', 'rect-mask:hide'],
        },
    ],
    rollback: [{ trigger: 'dblclick', action: ['element-range-highlight:clear', 'rect-mask:hide'] }],
});
(0, core_10.registerInteraction)('brush', {
    showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
    ],
    start: [
        {
            trigger: 'mousedown',
            isEnable: isPointInView,
            action: ['brush:start', 'rect-mask:start', 'rect-mask:show'],
        },
    ],
    processing: [
        {
            trigger: 'mousemove',
            isEnable: isPointInView,
            action: ['rect-mask:resize'],
        },
    ],
    end: [
        {
            trigger: 'mouseup',
            isEnable: isPointInView,
            action: ['brush:filter', 'brush:end', 'rect-mask:end', 'rect-mask:hide', 'reset-button:show'],
        },
    ],
    rollback: [{ trigger: 'reset-button:click', action: ['brush:reset', 'reset-button:hide', 'cursor:crosshair'] }],
});
(0, core_10.registerInteraction)('brush-visible', {
    showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
    ],
    start: [
        {
            trigger: 'plot:mousedown',
            action: ['rect-mask:start', 'rect-mask:show'],
        },
    ],
    processing: [
        {
            trigger: 'plot:mousemove',
            action: ['rect-mask:resize'],
        },
        { trigger: 'mask:change', action: ['element-range-highlight:highlight'] },
    ],
    end: [
        {
            trigger: 'plot:mouseup',
            action: ['rect-mask:end', 'rect-mask:hide', 'element-filter:filter', 'element-range-highlight:clear'],
        },
    ],
    rollback: [
        {
            trigger: 'dblclick',
            action: ['element-filter:clear'],
        },
    ],
});
(0, core_10.registerInteraction)('brush-x', {
    showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
    ],
    start: [
        {
            trigger: 'mousedown',
            isEnable: isPointInView,
            action: ['brush-x:start', 'x-rect-mask:start', 'x-rect-mask:show'],
        },
    ],
    processing: [
        {
            trigger: 'mousemove',
            isEnable: isPointInView,
            action: ['x-rect-mask:resize'],
        },
    ],
    end: [
        {
            trigger: 'mouseup',
            isEnable: isPointInView,
            action: ['brush-x:filter', 'brush-x:end', 'x-rect-mask:end', 'x-rect-mask:hide'],
        },
    ],
    rollback: [{ trigger: 'dblclick', action: ['brush-x:reset'] }],
});
(0, core_10.registerInteraction)('element-path-highlight', {
    showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
    ],
    start: [
        { trigger: 'mousedown', isEnable: isPointInView, action: 'path-mask:start' },
        { trigger: 'mousedown', isEnable: isPointInView, action: 'path-mask:show' },
    ],
    processing: [{ trigger: 'mousemove', action: 'path-mask:addPoint' }],
    end: [{ trigger: 'mouseup', action: 'path-mask:end' }],
    rollback: [{ trigger: 'dblclick', action: 'path-mask:hide' }],
});
(0, core_10.registerInteraction)('brush-x-multi', {
    showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'mask:mouseenter', action: 'cursor:move' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
        { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
    ],
    start: [
        {
            trigger: 'mousedown',
            isEnable: isPointInView,
            action: ['x-rect-multi-mask:start', 'x-rect-multi-mask:show'],
        },
        {
            trigger: 'mask:dragstart',
            action: ['x-rect-multi-mask:moveStart'],
        },
    ],
    processing: [
        {
            trigger: 'mousemove',
            isEnable: function (context) { return !(0, util_1.isMultipleMask)(context); },
            action: ['x-rect-multi-mask:resize'],
        },
        {
            trigger: 'multi-mask:change',
            action: 'element-range-highlight:highlight',
        },
        {
            trigger: 'mask:drag',
            action: ['x-rect-multi-mask:move'],
        },
    ],
    end: [
        {
            trigger: 'mouseup',
            action: ['x-rect-multi-mask:end'],
        },
        { trigger: 'mask:dragend', action: ['x-rect-multi-mask:moveEnd'] },
    ],
    rollback: [
        {
            trigger: 'dblclick',
            action: ['x-rect-multi-mask:clear', 'cursor:crosshair'],
        },
        {
            trigger: 'multi-mask:clearAll',
            action: ['element-range-highlight:clear'],
        },
        {
            trigger: 'multi-mask:clearSingle',
            action: ['element-range-highlight:highlight'],
        },
    ],
});
// 点击选中，允许取消
(0, core_10.registerInteraction)('element-single-selected', {
    start: [{ trigger: 'element:click', action: 'element-single-selected:toggle' }],
});
// 筛选数据
(0, core_10.registerInteraction)('legend-filter', {
    showEnable: [
        { trigger: 'legend-item:mouseenter', action: ['cursor:pointer', 'list-radio:show'] },
        { trigger: 'legend-item:mouseleave', action: ['cursor:default', 'list-radio:hide'] },
    ],
    start: [
        {
            trigger: 'legend-item:click',
            isEnable: function (context) {
                return !context.isInShape('legend-item-radio');
            },
            action: ['legend-item-highlight:reset', 'element-highlight:reset', 'list-unchecked:toggle', 'data-filter:filter', 'list-radio:show'],
        },
        //  正反选数据: 只有当 radio === truthy 的时候才会有 legend-item-radio 这个元素
        {
            trigger: 'legend-item-radio:mouseenter',
            action: ['list-radio:showTip'],
        },
        {
            trigger: 'legend-item-radio:mouseleave',
            action: ['list-radio:hideTip'],
        },
        {
            trigger: 'legend-item-radio:click',
            action: ['list-focus:toggle', 'data-filter:filter', 'list-radio:show'],
        },
    ],
});
// 筛选数据
(0, core_10.registerInteraction)('continuous-filter', {
    start: [{ trigger: 'legend:valuechanged', action: 'data-filter:filter' }],
});
// 筛选数据
(0, core_10.registerInteraction)('continuous-visible-filter', {
    start: [{ trigger: 'legend:valuechanged', action: 'element-filter:filter' }],
});
// 筛选图形
(0, core_10.registerInteraction)('legend-visible-filter', {
    showEnable: [
        { trigger: 'legend-item:mouseenter', action: 'cursor:pointer' },
        { trigger: 'legend-item:mouseleave', action: 'cursor:default' },
    ],
    start: [{ trigger: 'legend-item:click', action: ['legend-item-highlight:reset', 'element-highlight:reset', 'list-unchecked:toggle', 'element-filter:filter'] }],
});
// 出现背景框
(0, core_10.registerInteraction)('active-region', {
    start: [{ trigger: 'plot:mousemove', action: 'active-region:show' }],
    end: [{ trigger: 'plot:mouseleave', action: 'active-region:hide' }],
});
// 显示坐标轴标题详情信息
(0, core_10.registerInteraction)('axis-description', {
    start: [{ trigger: 'axis-description:mousemove', action: 'axis-description:show' }],
    end: [{ trigger: 'axis-description:mouseleave', action: 'axis-description:hide' }]
});
function isWheelDown(event) {
    event.gEvent.preventDefault();
    return event.gEvent.originalEvent.deltaY > 0;
}
(0, core_10.registerInteraction)('view-zoom', {
    start: [
        {
            trigger: 'plot:mousewheel',
            isEnable: function (context) {
                return isWheelDown(context.event);
            },
            action: 'scale-zoom:zoomOut',
            throttle: { wait: 100, leading: true, trailing: false },
        },
        {
            trigger: 'plot:mousewheel',
            isEnable: function (context) {
                return !isWheelDown(context.event);
            },
            action: 'scale-zoom:zoomIn',
            throttle: { wait: 100, leading: true, trailing: false },
        },
    ],
});
(0, core_10.registerInteraction)('sibling-tooltip', {
    start: [{ trigger: 'plot:mousemove', action: 'sibling-tooltip:show' }],
    end: [{ trigger: 'plot:mouseleave', action: 'sibling-tooltip:hide' }],
});
(0, core_10.registerInteraction)('plot-mousewheel-scroll', {
    start: [{ trigger: 'plot:mousewheel', action: 'mousewheel-scroll:scroll' }],
});
// 暴露一些常量
var constant_1 = require("./constant");
Object.defineProperty(exports, "VIEW_LIFE_CIRCLE", { enumerable: true, get: function () { return constant_1.VIEW_LIFE_CIRCLE; } });
tslib_1.__exportStar(require("./core"), exports);
//# sourceMappingURL=index.js.map