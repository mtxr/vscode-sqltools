"use strict";
/* G2 的一个壳子，不包含 Geometry，由开发者自己定义和引入 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = exports.Scale = exports.Coordinate = exports.DIRECTION = exports.LAYER = exports.getAnimation = exports.registerAnimation = exports.getEngine = exports.registerEngine = exports.registerTheme = exports.getTheme = exports.registerFacet = exports.getFacet = exports.getActionClass = exports.registerAction = exports.registerInteraction = exports.getInteraction = exports.getGeometryLabelLayout = exports.getGeometryLabel = exports.registerGeometryLabelLayout = exports.registerGeometryLabel = exports.getShapeFactory = exports.registerShapeFactory = exports.registerShape = exports.registerGeometry = exports.registerComponentController = exports.InteractionAction = exports.Facet = exports.Action = exports.Interaction = exports.GeometryLabel = exports.Element = exports.Geometry = exports.TooltipController = exports.ComponentController = exports.Event = exports.View = exports.Chart = exports.VERSION = void 0;
exports.VERSION = '4.2.11';
// 核心基类导出
var chart_1 = require("./chart"); // Chart, View 类
Object.defineProperty(exports, "Chart", { enumerable: true, get: function () { return chart_1.Chart; } });
Object.defineProperty(exports, "View", { enumerable: true, get: function () { return chart_1.View; } });
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return chart_1.Event; } });
var base_1 = require("./chart/controller/base"); // G2 组件基类
Object.defineProperty(exports, "ComponentController", { enumerable: true, get: function () { return base_1.Controller; } });
var tooltip_1 = require("./chart/controller/tooltip"); // G2 tooltip 组件基类
Object.defineProperty(exports, "TooltipController", { enumerable: true, get: function () { return __importDefault(tooltip_1).default; } });
var base_2 = require("./geometry/base"); // Geometry 基类
Object.defineProperty(exports, "Geometry", { enumerable: true, get: function () { return __importDefault(base_2).default; } });
var element_1 = require("./geometry/element"); // Element 类
Object.defineProperty(exports, "Element", { enumerable: true, get: function () { return __importDefault(element_1).default; } });
var base_3 = require("./geometry/label/base"); // Geometry Label 基类
Object.defineProperty(exports, "GeometryLabel", { enumerable: true, get: function () { return __importDefault(base_3).default; } });
var interaction_1 = require("./interaction"); // Interaction, Action 基类
Object.defineProperty(exports, "Interaction", { enumerable: true, get: function () { return interaction_1.Interaction; } });
Object.defineProperty(exports, "Action", { enumerable: true, get: function () { return interaction_1.Action; } });
var facet_1 = require("./facet"); // Facet 基类
Object.defineProperty(exports, "Facet", { enumerable: true, get: function () { return facet_1.Facet; } });
var base_4 = require("./interaction/action/base"); // Interaction Action 基类
Object.defineProperty(exports, "InteractionAction", { enumerable: true, get: function () { return __importDefault(base_4).default; } });
// 注册 ComponentController
var chart_2 = require("./chart");
Object.defineProperty(exports, "registerComponentController", { enumerable: true, get: function () { return chart_2.registerComponentController; } });
// 注册 Geometry
var chart_3 = require("./chart");
Object.defineProperty(exports, "registerGeometry", { enumerable: true, get: function () { return chart_3.registerGeometry; } });
// 注册 Geometry Shape
var base_5 = require("./geometry/shape/base");
Object.defineProperty(exports, "registerShape", { enumerable: true, get: function () { return base_5.registerShape; } });
Object.defineProperty(exports, "registerShapeFactory", { enumerable: true, get: function () { return base_5.registerShapeFactory; } });
Object.defineProperty(exports, "getShapeFactory", { enumerable: true, get: function () { return base_5.getShapeFactory; } });
// 注册 Geometry label 以及 Geometry Label 布局函数
var label_1 = require("./geometry/label");
Object.defineProperty(exports, "registerGeometryLabel", { enumerable: true, get: function () { return label_1.registerGeometryLabel; } });
Object.defineProperty(exports, "registerGeometryLabelLayout", { enumerable: true, get: function () { return label_1.registerGeometryLabelLayout; } });
Object.defineProperty(exports, "getGeometryLabel", { enumerable: true, get: function () { return label_1.getGeometryLabel; } });
Object.defineProperty(exports, "getGeometryLabelLayout", { enumerable: true, get: function () { return label_1.getGeometryLabelLayout; } });
// 注册 interaction
var interaction_2 = require("./interaction");
Object.defineProperty(exports, "getInteraction", { enumerable: true, get: function () { return interaction_2.getInteraction; } });
Object.defineProperty(exports, "registerInteraction", { enumerable: true, get: function () { return interaction_2.registerInteraction; } });
Object.defineProperty(exports, "registerAction", { enumerable: true, get: function () { return interaction_2.registerAction; } });
Object.defineProperty(exports, "getActionClass", { enumerable: true, get: function () { return interaction_2.getActionClass; } });
// 注册 facet
var facet_2 = require("./facet");
Object.defineProperty(exports, "getFacet", { enumerable: true, get: function () { return facet_2.getFacet; } });
Object.defineProperty(exports, "registerFacet", { enumerable: true, get: function () { return facet_2.registerFacet; } });
// 注册主题
var theme_1 = require("./theme");
Object.defineProperty(exports, "getTheme", { enumerable: true, get: function () { return theme_1.getTheme; } });
Object.defineProperty(exports, "registerTheme", { enumerable: true, get: function () { return theme_1.registerTheme; } });
// G engine 管理相关
var engine_1 = require("./engine");
Object.defineProperty(exports, "registerEngine", { enumerable: true, get: function () { return engine_1.registerEngine; } });
Object.defineProperty(exports, "getEngine", { enumerable: true, get: function () { return engine_1.getEngine; } });
// 注册动画函数
var animation_1 = require("./animate/animation");
Object.defineProperty(exports, "registerAnimation", { enumerable: true, get: function () { return animation_1.registerAnimation; } });
Object.defineProperty(exports, "getAnimation", { enumerable: true, get: function () { return animation_1.getAnimation; } });
var constant_1 = require("./constant");
Object.defineProperty(exports, "LAYER", { enumerable: true, get: function () { return constant_1.LAYER; } });
Object.defineProperty(exports, "DIRECTION", { enumerable: true, get: function () { return constant_1.DIRECTION; } });
var dependents_1 = require("./dependents");
Object.defineProperty(exports, "Coordinate", { enumerable: true, get: function () { return dependents_1.Coordinate; } });
Object.defineProperty(exports, "Scale", { enumerable: true, get: function () { return dependents_1.Scale; } });
// 一些工具方法导出
var attr_1 = require("./util/attr");
var legend_1 = require("./util/legend");
var graphics_1 = require("./util/graphics");
var transform_1 = require("./util/transform");
var tooltip_2 = require("./util/tooltip");
var util_1 = require("./interaction/action/util");
var get_path_points_1 = require("./geometry/shape/util/get-path-points");
var line_1 = require("./geometry/shape/line");
exports.Util = {
    getLegendItems: legend_1.getLegendItems,
    translate: transform_1.translate,
    rotate: transform_1.rotate,
    zoom: transform_1.zoom,
    transform: transform_1.transform,
    getAngle: graphics_1.getAngle,
    getSectorPath: graphics_1.getSectorPath,
    polarToCartesian: graphics_1.polarToCartesian,
    getDelegationObject: util_1.getDelegationObject,
    getTooltipItems: tooltip_2.getTooltipItems,
    getMappingValue: attr_1.getMappingValue,
    // shape 的一些操作方法
    getPath: line_1.getPath,
    getPathPoints: get_path_points_1.getPathPoints,
};
//# sourceMappingURL=core.js.map