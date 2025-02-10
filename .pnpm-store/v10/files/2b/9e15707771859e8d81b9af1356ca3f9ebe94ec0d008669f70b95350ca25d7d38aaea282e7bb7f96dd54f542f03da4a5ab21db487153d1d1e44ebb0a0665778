/**
 * 默认的 syncViewPadding 逻辑
 * @param chart
 * @param views
 * @param PC: PaddingCalCtor
 */
export function defaultSyncViewPadding(chart, views, PC) {
    var syncPadding = PC.instance();
    // 所有的 view 的 autoPadding 指向同一个引用
    views.forEach(function (v) {
        v.autoPadding = syncPadding.max(v.autoPadding.getPadding());
    });
}
//# sourceMappingURL=sync-view-padding.js.map