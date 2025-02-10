"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arcToCubic = void 0;
var TAU = Math.PI * 2;
var mapToEllipse = function (_a, rx, ry, cosphi, sinphi, centerx, centery) {
    var x = _a.x, y = _a.y;
    x *= rx;
    y *= ry;
    var xp = cosphi * x - sinphi * y;
    var yp = sinphi * x + cosphi * y;
    return {
        x: xp + centerx,
        y: yp + centery
    };
};
var approxUnitArc = function (ang1, ang2) {
    // If 90 degree circular arc, use a constant
    // as derived from http://spencermortensen.com/articles/bezier-circle
    var a = ang2 === 1.5707963267948966
        ? 0.551915024494
        : ang2 === -1.5707963267948966
            ? -0.551915024494
            : 4 / 3 * Math.tan(ang2 / 4);
    var x1 = Math.cos(ang1);
    var y1 = Math.sin(ang1);
    var x2 = Math.cos(ang1 + ang2);
    var y2 = Math.sin(ang1 + ang2);
    return [
        {
            x: x1 - y1 * a,
            y: y1 + x1 * a
        },
        {
            x: x2 + y2 * a,
            y: y2 - x2 * a
        },
        {
            x: x2,
            y: y2
        }
    ];
};
var vectorAngle = function (ux, uy, vx, vy) {
    var sign = (ux * vy - uy * vx < 0) ? -1 : 1;
    var dot = ux * vx + uy * vy;
    if (dot > 1) {
        dot = 1;
    }
    if (dot < -1) {
        dot = -1;
    }
    return sign * Math.acos(dot);
};
var getArcCenter = function (px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp) {
    var rxsq = Math.pow(rx, 2);
    var rysq = Math.pow(ry, 2);
    var pxpsq = Math.pow(pxp, 2);
    var pypsq = Math.pow(pyp, 2);
    var radicant = (rxsq * rysq) - (rxsq * pypsq) - (rysq * pxpsq);
    if (radicant < 0) {
        radicant = 0;
    }
    radicant /= (rxsq * pypsq) + (rysq * pxpsq);
    radicant = Math.sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);
    var centerxp = radicant * rx / ry * pyp;
    var centeryp = radicant * -ry / rx * pxp;
    var centerx = cosphi * centerxp - sinphi * centeryp + (px + cx) / 2;
    var centery = sinphi * centerxp + cosphi * centeryp + (py + cy) / 2;
    var vx1 = (pxp - centerxp) / rx;
    var vy1 = (pyp - centeryp) / ry;
    var vx2 = (-pxp - centerxp) / rx;
    var vy2 = (-pyp - centeryp) / ry;
    var ang1 = vectorAngle(1, 0, vx1, vy1);
    var ang2 = vectorAngle(vx1, vy1, vx2, vy2);
    if (sweepFlag === 0 && ang2 > 0) {
        ang2 -= TAU;
    }
    if (sweepFlag === 1 && ang2 < 0) {
        ang2 += TAU;
    }
    return [centerx, centery, ang1, ang2];
};
var arcToBezier = function (_a) {
    var px = _a.px, py = _a.py, cx = _a.cx, cy = _a.cy, rx = _a.rx, ry = _a.ry, _b = _a.xAxisRotation, xAxisRotation = _b === void 0 ? 0 : _b, _c = _a.largeArcFlag, largeArcFlag = _c === void 0 ? 0 : _c, _d = _a.sweepFlag, sweepFlag = _d === void 0 ? 0 : _d;
    var curves = [];
    if (rx === 0 || ry === 0) {
        return [{ x1: 0, y1: 0, x2: 0, y2: 0, x: cx, y: cy }];
    }
    var sinphi = Math.sin(xAxisRotation * TAU / 360);
    var cosphi = Math.cos(xAxisRotation * TAU / 360);
    var pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2;
    var pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2;
    if (pxp === 0 && pyp === 0) {
        return [{ x1: 0, y1: 0, x2: 0, y2: 0, x: cx, y: cy }];
    }
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    var lambda = Math.pow(pxp, 2) / Math.pow(rx, 2) +
        Math.pow(pyp, 2) / Math.pow(ry, 2);
    if (lambda > 1) {
        rx *= Math.sqrt(lambda);
        ry *= Math.sqrt(lambda);
    }
    var _e = getArcCenter(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp), centerx = _e[0], centery = _e[1], ang1 = _e[2], ang2 = _e[3];
    // If 'ang2' == 90.0000000001, then `ratio` will evaluate to
    // 1.0000000001. This causes `segments` to be greater than one, which is an
    // unecessary split, and adds extra points to the bezier curve. To alleviate
    // this issue, we round to 1.0 when the ratio is close to 1.0.
    var ratio = Math.abs(ang2) / (TAU / 4);
    if (Math.abs(1.0 - ratio) < 0.0000001) {
        ratio = 1.0;
    }
    var segments = Math.max(Math.ceil(ratio), 1);
    ang2 /= segments;
    for (var i = 0; i < segments; i++) {
        curves.push(approxUnitArc(ang1, ang2));
        ang1 += ang2;
    }
    return curves.map(function (curve) {
        var _a = mapToEllipse(curve[0], rx, ry, cosphi, sinphi, centerx, centery), x1 = _a.x, y1 = _a.y;
        var _b = mapToEllipse(curve[1], rx, ry, cosphi, sinphi, centerx, centery), x2 = _b.x, y2 = _b.y;
        var _c = mapToEllipse(curve[2], rx, ry, cosphi, sinphi, centerx, centery), x = _c.x, y = _c.y;
        return { x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y };
    });
};
function arcToCubic(x1, y1, rx, ry, angle, LAF, SF, x2, y2) {
    var curves = arcToBezier({
        px: x1,
        py: y1,
        cx: x2,
        cy: y2,
        rx: rx,
        ry: ry,
        xAxisRotation: angle,
        largeArcFlag: LAF,
        sweepFlag: SF,
    });
    return curves.reduce(function (prev, cur) {
        var x1 = cur.x1, y1 = cur.y1, x2 = cur.x2, y2 = cur.y2, x = cur.x, y = cur.y;
        prev.push(x1, y1, x2, y2, x, y);
        return prev;
    }, []);
}
exports.arcToCubic = arcToCubic;
//# sourceMappingURL=arc-2-cubic.js.map