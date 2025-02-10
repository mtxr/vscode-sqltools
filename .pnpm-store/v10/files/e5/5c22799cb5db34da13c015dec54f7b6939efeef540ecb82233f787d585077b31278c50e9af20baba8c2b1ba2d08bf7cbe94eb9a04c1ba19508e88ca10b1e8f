import { distance } from '../util';
export default function arc(cx, cy, r, startAngle, endAngle, lineWidth, x, y) {
    var angle = (Math.atan2(y - cy, x - cx) + Math.PI * 2) % (Math.PI * 2); // 转换到 0 - 2 * Math.PI 之间
    if (angle < startAngle || angle > endAngle) {
        return false;
    }
    var point = {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
    };
    return distance(point.x, point.y, x, y) <= lineWidth / 2;
}
//# sourceMappingURL=arc.js.map