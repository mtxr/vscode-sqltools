"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addViewAnimation = exports.getSiblingViews = exports.getViews = exports.findViewById = void 0;
var util_1 = require("@antv/util");
/**
 * 在 Chart 中查找特定 id 的子 View
 * @param chart
 * @param id
 */
function findViewById(chart, id) {
    return chart.views.find(function (view) { return view.id === id; });
}
exports.findViewById = findViewById;
/**
 * 获取同 view 同一级的所有 views
 * @param view 当前 view
 * @returns 同一级的 views
 * @ignore
 */
function getViews(view) {
    var parent = view.parent;
    return parent ? parent.views : [];
}
exports.getViews = getViews;
/**
 * 获取同 view 同一级的 views，不包括自身
 * @param view 当前 view
 * @returns 同一级的 views
 * @ignore
 */
function getSiblingViews(view) {
    return getViews(view).filter(function (sub) { return sub !== view; });
}
exports.getSiblingViews = getSiblingViews;
/**
 * 所有的 Geometries 都使用同一动画（各个图形如有区别，自行覆盖）并添加处理动画回调
 * @param view View
 * @param animation 动画配置
 */
function addViewAnimation(view, animation, geometries) {
    if (geometries === void 0) { geometries = view.geometries; }
    // 同时设置整个 view 动画选项
    if (typeof animation === 'boolean') {
        view.animate(animation);
    }
    else {
        view.animate(true);
    }
    // 所有的 Geometry 都使用同一动画（各个图形如有区别，自行覆盖）
    (0, util_1.each)(geometries, function (g) {
        var animationCfg;
        if ((0, util_1.isFunction)(animation)) {
            animationCfg = animation(g.type || g.shapeType, g) || true;
        }
        else {
            animationCfg = animation;
        }
        g.animate(animationCfg);
    });
}
exports.addViewAnimation = addViewAnimation;
//# sourceMappingURL=view.js.map