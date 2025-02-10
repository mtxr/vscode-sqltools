var GEOMETRY_LABELS_MAP = {};
var GEOMETRY_LABELS_LAYOUT_MAP = {};
/**
 * 获取 `type` 对应的 [[GeometryLabel]] 类
 * @param type
 * @returns
 */
export function getGeometryLabel(type) {
    return GEOMETRY_LABELS_MAP[type.toLowerCase()];
}
/**
 * 注册定义的 GeometryLabel 类
 * @param type GeometryLabel 类型名称
 * @param ctor GeometryLabel 类
 */
export function registerGeometryLabel(type, ctor) {
    GEOMETRY_LABELS_MAP[type.toLowerCase()] = ctor;
}
/**
 * 获取 `type` 对应的 [[GeometryLabelsLayoutFn]] label 布局函数
 * @param type 布局函数名称
 * @returns
 */
export function getGeometryLabelLayout(type) {
    return GEOMETRY_LABELS_LAYOUT_MAP[type.toLowerCase()];
}
/**
 * 注册定义的 label 布局函数
 * @param type label 布局函数名称
 * @param layoutFn label 布局函数
 */
export function registerGeometryLabelLayout(type, layoutFn) {
    GEOMETRY_LABELS_LAYOUT_MAP[type.toLowerCase()] = layoutFn;
}
//# sourceMappingURL=index.js.map