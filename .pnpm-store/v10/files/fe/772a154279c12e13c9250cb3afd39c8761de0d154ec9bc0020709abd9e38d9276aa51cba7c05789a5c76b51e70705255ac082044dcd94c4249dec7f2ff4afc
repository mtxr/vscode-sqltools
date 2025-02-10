"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanvasPattern = void 0;
var dot_1 = require("./dot");
var line_1 = require("./line");
var square_1 = require("./square");
/**
 * 获取内置的 CanvasPattern 方法
 * @param options
 * @returns
 */
function getCanvasPattern(options) {
    var type = options.type, cfg = options.cfg;
    var pattern;
    switch (type) {
        case 'dot':
            pattern = (0, dot_1.createDotPattern)(cfg);
            break;
        case 'line':
            pattern = (0, line_1.createLinePattern)(cfg);
            break;
        case 'square':
            pattern = (0, square_1.createSquarePattern)(cfg);
            break;
        default:
            break;
    }
    return pattern;
}
exports.getCanvasPattern = getCanvasPattern;
//# sourceMappingURL=index.js.map