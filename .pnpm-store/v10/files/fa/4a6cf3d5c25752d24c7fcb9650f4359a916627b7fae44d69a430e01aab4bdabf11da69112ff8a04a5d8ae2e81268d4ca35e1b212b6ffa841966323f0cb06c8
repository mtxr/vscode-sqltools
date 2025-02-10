"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGeometryLabelLayout = exports.getGeometryLabelLayout = exports.registerGeometryLabel = exports.getGeometryLabel = void 0;
var GEOMETRY_LABELS_MAP = {};
var GEOMETRY_LABELS_LAYOUT_MAP = {};
/**
 * 获取 `type` 对应的 [[GeometryLabel]] 类
 * @param type
 * @returns
 */
function getGeometryLabel(type) {
    return GEOMETRY_LABELS_MAP[type.toLowerCase()];
}
exports.getGeometryLabel = getGeometryLabel;
/**
 * 注册定义的 GeometryLabel 类
 * @param type GeometryLabel 类型名称
 * @param ctor GeometryLabel 类
 */
function registerGeometryLabel(type, ctor) {
    GEOMETRY_LABELS_MAP[type.toLowerCase()] = ctor;
}
exports.registerGeometryLabel = registerGeometryLabel;
/**
 * 获取 `type` 对应的 [[GeometryLabelsLayoutFn]] label 布局函数
 * @param type 布局函数名称
 * @returns
 */
function getGeometryLabelLayout(type) {
    return GEOMETRY_LABELS_LAYOUT_MAP[type.toLowerCase()];
}
exports.getGeometryLabelLayout = getGeometryLabelLayout;
/**
 * 注册定义的 label 布局函数
 * @param type label 布局函数名称
 * @param layoutFn label 布局函数
 */
function registerGeometryLabelLayout(type, layoutFn) {
    GEOMETRY_LABELS_LAYOUT_MAP[type.toLowerCase()] = layoutFn;
}
exports.registerGeometryLabelLayout = registerGeometryLabelLayout;
//# sourceMappingURL=index.js.map