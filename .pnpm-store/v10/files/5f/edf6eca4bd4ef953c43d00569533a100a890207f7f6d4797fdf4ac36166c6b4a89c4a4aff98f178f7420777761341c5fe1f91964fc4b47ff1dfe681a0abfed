"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSyncViewPadding = void 0;
/**
 * 默认的 syncViewPadding 逻辑
 * @param chart
 * @param views
 * @param PC: PaddingCalCtor
 */
function defaultSyncViewPadding(chart, views, PC) {
    var syncPadding = PC.instance();
    // 所有的 view 的 autoPadding 指向同一个引用
    views.forEach(function (v) {
        v.autoPadding = syncPadding.max(v.autoPadding.getPadding());
    });
}
exports.defaultSyncViewPadding = defaultSyncViewPadding;
//# sourceMappingURL=sync-view-padding.js.map