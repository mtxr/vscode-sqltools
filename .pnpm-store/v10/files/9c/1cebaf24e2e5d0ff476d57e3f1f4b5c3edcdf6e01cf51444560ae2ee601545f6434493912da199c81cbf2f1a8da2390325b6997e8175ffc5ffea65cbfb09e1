var isBetween = function (value, min, max) { return value >= min && value <= max; };
export default function getLineIntersect(p0, p1, p2, p3) {
    var tolerance = 0.001;
    var E = {
        x: p2.x - p0.x,
        y: p2.y - p0.y,
    };
    var D0 = {
        x: p1.x - p0.x,
        y: p1.y - p0.y,
    };
    var D1 = {
        x: p3.x - p2.x,
        y: p3.y - p2.y,
    };
    var kross = D0.x * D1.y - D0.y * D1.x;
    var sqrKross = kross * kross;
    var sqrLen0 = D0.x * D0.x + D0.y * D0.y;
    var sqrLen1 = D1.x * D1.x + D1.y * D1.y;
    var point = null;
    if (sqrKross > tolerance * sqrLen0 * sqrLen1) {
        var s = (E.x * D1.y - E.y * D1.x) / kross;
        var t = (E.x * D0.y - E.y * D0.x) / kross;
        if (isBetween(s, 0, 1) && isBetween(t, 0, 1)) {
            point = {
                x: p0.x + s * D0.x,
                y: p0.y + s * D0.y,
            };
        }
    }
    return point;
}
;
//# sourceMappingURL=get-line-intersect.js.map