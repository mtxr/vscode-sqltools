"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.segmentToCubic = void 0;
var arc_2_cubic_1 = require("./arc-2-cubic");
var quad_2_cubic_1 = require("./quad-2-cubic");
var line_2_cubic_1 = require("./line-2-cubic");
function segmentToCubic(segment, params) {
    if ('TQ'.indexOf(segment[0]) < 0) {
        params.qx = null;
        params.qy = null;
    }
    var _a = segment.slice(1), s1 = _a[0], s2 = _a[1];
    switch (segment[0]) {
        case 'M':
            params.x = s1;
            params.y = s2;
            return segment;
        case 'A':
            return ['C'].concat(arc_2_cubic_1.arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
        case 'Q':
            params.qx = s1;
            params.qy = s2;
            return ['C'].concat(quad_2_cubic_1.quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
        case 'L':
            // @ts-ignore
            return ['C'].concat(line_2_cubic_1.lineToCubic(params.x1, params.y1, segment[1], segment[2]));
        case 'H':
            // @ts-ignore
            return ['C'].concat(line_2_cubic_1.lineToCubic(params.x1, params.y1, segment[1], params.y1));
        case 'V':
            // @ts-ignore
            return ['C'].concat(line_2_cubic_1.lineToCubic(params.x1, params.y1, params.x1, segment[1]));
        case 'Z':
            // @ts-ignore
            return ['C'].concat(line_2_cubic_1.lineToCubic(params.x1, params.y1, params.x, params.y));
        default:
    }
    return segment;
}
exports.segmentToCubic = segmentToCubic;
//# sourceMappingURL=segment-2-cubic.js.map