"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_es_1 = require("lodash-es");
var regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/gi;
var regexDot = /[^\s\,]+/gi;
function parsePath(p) {
    var path = p || [];
    if (lodash_es_1.isArray(path)) {
        return path;
    }
    if (lodash_es_1.isString(path)) {
        path = path.match(regexTags);
        lodash_es_1.each(path, function (item, index) {
            // @ts-ignore
            item = item.match(regexDot);
            if (item[0].length > 1) {
                var tag = item[0].charAt(0);
                // @ts-ignore
                item.splice(1, 0, item[0].substr(1));
                // @ts-ignore
                item[0] = tag;
            }
            // @ts-ignore
            lodash_es_1.each(item, function (sub, i) {
                // @ts-ignore
                if (!isNaN(sub)) {
                    // @ts-ignore
                    item[i] = +sub;
                }
            });
            // @ts-ignore
            path[index] = item;
        });
        return path;
    }
}
exports.default = parsePath;
//# sourceMappingURL=parse-path.js.map