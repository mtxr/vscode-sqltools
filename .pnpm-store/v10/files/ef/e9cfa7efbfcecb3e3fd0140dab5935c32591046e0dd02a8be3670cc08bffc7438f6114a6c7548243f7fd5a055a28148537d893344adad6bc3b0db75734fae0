import { each, isArray, isString } from '@antv/util';
var regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/gi;
var regexDot = /[^\s,]+/gi;
export function parseRadius(radius) {
    var r1 = 0;
    var r2 = 0;
    var r3 = 0;
    var r4 = 0;
    if (isArray(radius)) {
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
export function parsePath(path) {
    path = path || [];
    if (isArray(path)) {
        return path;
    }
    if (isString(path)) {
        path = path.match(regexTags);
        each(path, function (item, index) {
            item = item.match(regexDot);
            if (item[0].length > 1) {
                var tag = item[0].charAt(0);
                item.splice(1, 0, item[0].substr(1));
                item[0] = tag;
            }
            each(item, function (sub, i) {
                if (!isNaN(sub)) {
                    item[i] = +sub;
                }
            });
            path[index] = item;
        });
        return path;
    }
}
//# sourceMappingURL=format.js.map