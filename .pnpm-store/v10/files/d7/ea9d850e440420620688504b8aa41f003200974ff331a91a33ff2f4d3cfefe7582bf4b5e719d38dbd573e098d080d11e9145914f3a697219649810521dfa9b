"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPONENT_MAX_VIEW_PERCENTAGE = exports.MIN_CHART_HEIGHT = exports.MIN_CHART_WIDTH = exports.FIELD_ORIGIN = exports.GROUP_ATTRS = exports.ELEMENT_STATE = exports.PLOT_EVENTS = exports.GEOMETRY_LIFE_CIRCLE = exports.VIEW_LIFE_CIRCLE = exports.GROUP_Z_INDEX = exports.COMPONENT_TYPE = exports.DIRECTION = exports.LAYER = void 0;
/**
 * view 中三层 group 分层 key
 */
var LAYER;
(function (LAYER) {
    /** 前景层 */
    LAYER["FORE"] = "fore";
    /** 中间层 */
    LAYER["MID"] = "mid";
    /** 背景层 */
    LAYER["BG"] = "bg";
})(LAYER = exports.LAYER || (exports.LAYER = {}));
/**
 * 组件在画布的布局方位 12 方位
 */
var DIRECTION;
(function (DIRECTION) {
    DIRECTION["TOP"] = "top";
    DIRECTION["TOP_LEFT"] = "top-left";
    DIRECTION["TOP_RIGHT"] = "top-right";
    DIRECTION["RIGHT"] = "right";
    DIRECTION["RIGHT_TOP"] = "right-top";
    DIRECTION["RIGHT_BOTTOM"] = "right-bottom";
    DIRECTION["LEFT"] = "left";
    DIRECTION["LEFT_TOP"] = "left-top";
    DIRECTION["LEFT_BOTTOM"] = "left-bottom";
    DIRECTION["BOTTOM"] = "bottom";
    DIRECTION["BOTTOM_LEFT"] = "bottom-left";
    DIRECTION["BOTTOM_RIGHT"] = "bottom-right";
    DIRECTION["RADIUS"] = "radius";
    DIRECTION["CIRCLE"] = "circle";
    // no direction information
    DIRECTION["NONE"] = "none";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
/**
 * 组件的类型，可能会影响到布局算法
 */
var COMPONENT_TYPE;
(function (COMPONENT_TYPE) {
    /** axis 组件 */
    COMPONENT_TYPE["AXIS"] = "axis";
    /** grid 组件 */
    COMPONENT_TYPE["GRID"] = "grid";
    /** legend 组件 */
    COMPONENT_TYPE["LEGEND"] = "legend";
    /** tooltip 组件 */
    COMPONENT_TYPE["TOOLTIP"] = "tooltip";
    /** annotation 组件 */
    COMPONENT_TYPE["ANNOTATION"] = "annotation";
    /** 缩略轴组件 */
    COMPONENT_TYPE["SLIDER"] = "slider";
    /** 滚动条组件 */
    COMPONENT_TYPE["SCROLLBAR"] = "scrollbar";
    /** 其他组件，自定义组件 */
    COMPONENT_TYPE["OTHER"] = "other";
})(COMPONENT_TYPE = exports.COMPONENT_TYPE || (exports.COMPONENT_TYPE = {}));
/**
 * 三层 group 的 z index
 */
exports.GROUP_Z_INDEX = {
    FORE: 3,
    MID: 2,
    BG: 1,
};
/**
 * View 的生命周期阶段（和 3.x 的生命周期略有不同）
 * 我们需要先确定在那写场景需要用到生命周期，如果只是为了在生命周期插入一下什么组件之类的，那么在现有架构就是不需要的
 */
var VIEW_LIFE_CIRCLE;
(function (VIEW_LIFE_CIRCLE) {
    VIEW_LIFE_CIRCLE["BEFORE_RENDER"] = "beforerender";
    VIEW_LIFE_CIRCLE["AFTER_RENDER"] = "afterrender";
    VIEW_LIFE_CIRCLE["BEFORE_PAINT"] = "beforepaint";
    VIEW_LIFE_CIRCLE["AFTER_PAINT"] = "afterpaint";
    VIEW_LIFE_CIRCLE["BEFORE_CHANGE_DATA"] = "beforechangedata";
    VIEW_LIFE_CIRCLE["AFTER_CHANGE_DATA"] = "afterchangedata";
    VIEW_LIFE_CIRCLE["BEFORE_CLEAR"] = "beforeclear";
    VIEW_LIFE_CIRCLE["AFTER_CLEAR"] = "afterclear";
    VIEW_LIFE_CIRCLE["BEFORE_DESTROY"] = "beforedestroy";
    VIEW_LIFE_CIRCLE["BEFORE_CHANGE_SIZE"] = "beforechangesize";
    VIEW_LIFE_CIRCLE["AFTER_CHANGE_SIZE"] = "afterchangesize";
})(VIEW_LIFE_CIRCLE = exports.VIEW_LIFE_CIRCLE || (exports.VIEW_LIFE_CIRCLE = {}));
/**
 * geometry 的生命周期
 */
var GEOMETRY_LIFE_CIRCLE;
(function (GEOMETRY_LIFE_CIRCLE) {
    GEOMETRY_LIFE_CIRCLE["BEFORE_DRAW_ANIMATE"] = "beforeanimate";
    GEOMETRY_LIFE_CIRCLE["AFTER_DRAW_ANIMATE"] = "afteranimate";
    GEOMETRY_LIFE_CIRCLE["BEFORE_RENDER_LABEL"] = "beforerenderlabel";
    GEOMETRY_LIFE_CIRCLE["AFTER_RENDER_LABEL"] = "afterrenderlabel";
})(GEOMETRY_LIFE_CIRCLE = exports.GEOMETRY_LIFE_CIRCLE || (exports.GEOMETRY_LIFE_CIRCLE = {}));
/**
 * 绘图区的事件列表
 */
var PLOT_EVENTS;
(function (PLOT_EVENTS) {
    // mouse 事件
    PLOT_EVENTS["MOUSE_ENTER"] = "plot:mouseenter";
    PLOT_EVENTS["MOUSE_DOWN"] = "plot:mousedown";
    PLOT_EVENTS["MOUSE_MOVE"] = "plot:mousemove";
    PLOT_EVENTS["MOUSE_UP"] = "plot:mouseup";
    PLOT_EVENTS["MOUSE_LEAVE"] = "plot:mouseleave";
    // 移动端事件
    PLOT_EVENTS["TOUCH_START"] = "plot:touchstart";
    PLOT_EVENTS["TOUCH_MOVE"] = "plot:touchmove";
    PLOT_EVENTS["TOUCH_END"] = "plot:touchend";
    PLOT_EVENTS["TOUCH_CANCEL"] = "plot:touchcancel";
    // click 事件
    PLOT_EVENTS["CLICK"] = "plot:click";
    PLOT_EVENTS["DBLCLICK"] = "plot:dblclick";
    PLOT_EVENTS["CONTEXTMENU"] = "plot:contextmenu";
    PLOT_EVENTS["LEAVE"] = "plot:leave";
    PLOT_EVENTS["ENTER"] = "plot:enter";
})(PLOT_EVENTS = exports.PLOT_EVENTS || (exports.PLOT_EVENTS = {}));
/**
 * Element 图形交互状态
 */
var ELEMENT_STATE;
(function (ELEMENT_STATE) {
    ELEMENT_STATE["ACTIVE"] = "active";
    ELEMENT_STATE["INACTIVE"] = "inactive";
    ELEMENT_STATE["SELECTED"] = "selected";
    ELEMENT_STATE["DEFAULT"] = "default";
})(ELEMENT_STATE = exports.ELEMENT_STATE || (exports.ELEMENT_STATE = {}));
/** 参与分组的图形属性名 */
exports.GROUP_ATTRS = ['color', 'shape', 'size'];
/** 存储原始数据的字段名 */
exports.FIELD_ORIGIN = '_origin';
/** 最小的图表宽度 */
exports.MIN_CHART_WIDTH = 1;
/** 最小的图表高度 */
exports.MIN_CHART_HEIGHT = 1;
/** 辅助组件占图表的尺寸的最大比例：如图表上方的图例最多占图表高度的25% */
exports.COMPONENT_MAX_VIEW_PERCENTAGE = 0.25;
//# sourceMappingURL=constant.js.map