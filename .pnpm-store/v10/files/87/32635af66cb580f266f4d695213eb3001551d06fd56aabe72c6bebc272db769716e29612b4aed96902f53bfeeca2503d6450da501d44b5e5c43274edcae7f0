// 全局设置一个唯一离屏的 ctx，用于计算 isPointInPath
var offScreenCtx = null;
export function getOffScreenContext() {
    if (!offScreenCtx) {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        offScreenCtx = canvas.getContext('2d');
    }
    return offScreenCtx;
}
//# sourceMappingURL=offscreen.js.map