// 全局设置一个唯一离屏的 ctx，用于计算 isPointInPath
let offScreenCtx = null;
export function getOffScreenContext() {
  if (!offScreenCtx) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    offScreenCtx = canvas.getContext('2d');
  }
  return offScreenCtx;
}
