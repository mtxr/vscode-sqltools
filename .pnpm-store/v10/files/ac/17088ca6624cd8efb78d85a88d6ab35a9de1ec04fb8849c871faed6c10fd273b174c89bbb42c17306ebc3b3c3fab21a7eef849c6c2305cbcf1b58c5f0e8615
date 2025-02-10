import { arcToCubic } from './arc-2-cubic';
import { quadToCubic } from './quad-2-cubic';
import { lineToCubic } from './line-2-cubic';
export function segmentToCubic(segment, params) {
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
            return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
        case 'Q':
            params.qx = s1;
            params.qy = s2;
            return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))));
        case 'L':
            // @ts-ignore
            return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2]));
        case 'H':
            // @ts-ignore
            return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], params.y1));
        case 'V':
            // @ts-ignore
            return ['C'].concat(lineToCubic(params.x1, params.y1, params.x1, segment[1]));
        case 'Z':
            // @ts-ignore
            return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y));
        default:
    }
    return segment;
}
//# sourceMappingURL=segment-2-cubic.js.map