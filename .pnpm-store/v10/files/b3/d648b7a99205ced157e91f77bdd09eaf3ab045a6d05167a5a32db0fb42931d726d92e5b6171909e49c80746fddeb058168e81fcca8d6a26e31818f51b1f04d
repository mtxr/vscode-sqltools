"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffScreenContext = void 0;
// 全局设置一个唯一离屏的 ctx，用于计算 isPointInPath
var offScreenCtx = null;
function getOffScreenContext() {
    if (!offScreenCtx) {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        offScreenCtx = canvas.getContext('2d');
    }
    return offScreenCtx;
}
exports.getOffScreenContext = getOffScreenContext;
//# sourceMappingURL=offscreen.js.map