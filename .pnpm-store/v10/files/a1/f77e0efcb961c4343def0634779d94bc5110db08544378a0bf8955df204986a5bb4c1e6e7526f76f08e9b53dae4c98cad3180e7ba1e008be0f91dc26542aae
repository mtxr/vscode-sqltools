export function createBBox(x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height,
        minX: x,
        minY: y,
        maxX: x + width,
        maxY: y + height,
    };
}
export function intersectBBox(box1, box2) {
    var minX = Math.max(box1.minX, box2.minX);
    var minY = Math.max(box1.minY, box2.minY);
    var maxX = Math.min(box1.maxX, box2.maxX);
    var maxY = Math.min(box1.maxY, box2.maxY);
    return createBBox(minX, minY, maxX - minX, maxY - minY);
}
//# sourceMappingURL=box.js.map