"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalizedValue = void 0;
var stat_1 = require("./stat");
/**
 * parse the value position
 * @param val
 * @param scale
 */
function getNormalizedValue(val, scale) {
    if (!scale) {
        return null;
    }
    var scaled;
    switch (val) {
        case 'start':
            return 0;
        case 'center':
            return 0.5;
        case 'end':
            return 1;
        case 'median': {
            scaled = scale.isCategory ? (0, stat_1.getMedian)(scale.values.map(function (_, idx) { return idx; })) : (0, stat_1.getMedian)(scale.values);
            break;
        }
        case 'mean': {
            scaled = scale.isCategory ? (scale.values.length - 1) / 2 : (0, stat_1.getMean)(scale.values);
            break;
        }
        case 'min':
            scaled = scale.isCategory ? 0 : scale[val];
            break;
        case 'max':
            scaled = scale.isCategory ? scale.values.length - 1 : scale[val];
            break;
        default:
            scaled = val;
            break;
    }
    return scale.scale(scaled);
}
exports.getNormalizedValue = getNormalizedValue;
//# sourceMappingURL=annotation.js.map