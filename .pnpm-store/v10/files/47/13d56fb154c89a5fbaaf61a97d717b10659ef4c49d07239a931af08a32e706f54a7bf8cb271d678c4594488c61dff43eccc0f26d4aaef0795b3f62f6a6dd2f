import { mod, toRadian, isSamePoint } from './util';
// 向量长度
function vMag(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
// u.v/|u||v|，计算夹角的余弦值
function vRatio(u, v) {
    // 当存在一个向量的长度为 0 时，夹角也为 0，即夹角的余弦值为 1
    return vMag(u) * vMag(v) ? (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v)) : 1;
}
// 向量角度
function vAngle(u, v) {
    return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
}
// A 0:rx 1:ry 2:x-axis-rotation 3:large-arc-flag 4:sweep-flag 5: x 6: y
export default function getArcParams(startPoint, params) {
    var rx = params[1];
    var ry = params[2];
    var xRotation = mod(toRadian(params[3]), Math.PI * 2);
    var arcFlag = params[4];
    var sweepFlag = params[5];
    // 弧形起点坐标
    var x1 = startPoint[0];
    var y1 = startPoint[1];
    // 弧形终点坐标
    var x2 = params[6];
    var y2 = params[7];
    var xp = (Math.cos(xRotation) * (x1 - x2)) / 2.0 + (Math.sin(xRotation) * (y1 - y2)) / 2.0;
    var yp = (-1 * Math.sin(xRotation) * (x1 - x2)) / 2.0 + (Math.cos(xRotation) * (y1 - y2)) / 2.0;
    var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
    if (lambda > 1) {
        rx *= Math.sqrt(lambda);
        ry *= Math.sqrt(lambda);
    }
    var diff = rx * rx * (yp * yp) + ry * ry * (xp * xp);
    var f = diff ? Math.sqrt((rx * rx * (ry * ry) - diff) / diff) : 1;
    if (arcFlag === sweepFlag) {
        f *= -1;
    }
    if (isNaN(f)) {
        f = 0;
    }
    // 旋转前的起点坐标，且当长半轴和短半轴的长度为 0 时，坐标按 (0, 0) 处理
    var cxp = ry ? (f * rx * yp) / ry : 0;
    var cyp = rx ? (f * -ry * xp) / rx : 0;
    // 椭圆圆心坐标
    var cx = (x1 + x2) / 2.0 + Math.cos(xRotation) * cxp - Math.sin(xRotation) * cyp;
    var cy = (y1 + y2) / 2.0 + Math.sin(xRotation) * cxp + Math.cos(xRotation) * cyp;
    // 起始点的单位向量
    var u = [(xp - cxp) / rx, (yp - cyp) / ry];
    // 终止点的单位向量
    var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
    // 计算起始点和圆心的连线，与 x 轴正方向的夹角
    var theta = vAngle([1, 0], u);
    // 计算圆弧起始点和终止点与椭圆圆心连线的夹角
    var dTheta = vAngle(u, v);
    if (vRatio(u, v) <= -1) {
        dTheta = Math.PI;
    }
    if (vRatio(u, v) >= 1) {
        dTheta = 0;
    }
    if (sweepFlag === 0 && dTheta > 0) {
        dTheta = dTheta - 2 * Math.PI;
    }
    if (sweepFlag === 1 && dTheta < 0) {
        dTheta = dTheta + 2 * Math.PI;
    }
    return {
        cx: cx,
        cy: cy,
        // 弧形的起点和终点相同时，长轴和短轴的长度按 0 处理
        rx: isSamePoint(startPoint, [x2, y2]) ? 0 : rx,
        ry: isSamePoint(startPoint, [x2, y2]) ? 0 : ry,
        startAngle: theta,
        endAngle: theta + dTheta,
        xRotation: xRotation,
        arcFlag: arcFlag,
        sweepFlag: sweepFlag,
    };
}
//# sourceMappingURL=arc-params.js.map