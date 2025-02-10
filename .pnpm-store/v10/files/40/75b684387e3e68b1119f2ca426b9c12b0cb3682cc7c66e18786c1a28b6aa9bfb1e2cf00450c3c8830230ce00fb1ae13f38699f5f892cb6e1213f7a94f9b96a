"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePath = exports.parseRadius = void 0;
var util_1 = require("@antv/util");
var regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/gi;
var regexDot = /[^\s,]+/gi;
function parseRadius(radius) {
    var r1 = 0;
    var r2 = 0;
    var r3 = 0;
    var r4 = 0;
    if (util_1.isArray(radius)) {
        if (radius.length === 1) {
            r1 = r2 = r3 = r4 = radius[0];
        }
        else if (radius.length === 2) {
            r1 = r3 = radius[0];
            r2 = r4 = radius[1];
        }
        else if (radius.length === 3) {
            r1 = radius[0];
            r2 = r4 = radius[1];
            r3 = radius[2];
        }
        else {
            r1 = radius[0];
            r2 = radius[1];
            r3 = radius[2];
            r4 = radius[3];
        }
    }
    else {
        r1 = r2 = r3 = r4 = radius;
    }
    return {
        r1: r1,
        r2: r2,
        r3: r3,
        r4: r4,
    };
}
exports.parseRadius = parseRadius;
function parsePath(path) {
    path = path || [];
    if (util_1.isArray(path)) {
        return path;
    }
    if (util_1.isString(path)) {
        path = path.match(regexTags);
        util_1.each(path, function (item, index) {
            item = item.match(regexDot);
            if (item[0].length > 1) {
                var tag = item[0].charAt(0);
                item.splice(1, 0, item[0].substr(1));
                item[0] = tag;
            }
            util_1.each(item, function (sub, i) {
                if (!isNaN(sub)) {
                    item[i] = +sub;
                }
            });
            path[index] = item;
        });
        return path;
    }
}
exports.parsePath = parsePath;
//# sourceMappingURL=format.js.map