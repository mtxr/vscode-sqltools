"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBBox = exports.getBBoxMethod = void 0;
var register_1 = require("./register");
Object.defineProperty(exports, "registerBBox", { enumerable: true, get: function () { return register_1.register; } });
Object.defineProperty(exports, "getBBoxMethod", { enumerable: true, get: function () { return register_1.getMethod; } });
var rect_1 = require("./rect");
var circle_1 = require("./circle");
var polyline_1 = require("./polyline");
var polygon_1 = require("./polygon");
var text_1 = require("./text");
var path_1 = require("./path");
var line_1 = require("./line");
var ellipse_1 = require("./ellipse");
register_1.register('rect', rect_1.default);
register_1.register('image', rect_1.default); // image 使用 rect 的包围盒计算
register_1.register('circle', circle_1.default);
register_1.register('marker', circle_1.default); // marker 使用 circle 的计算方案
register_1.register('polyline', polyline_1.default);
register_1.register('polygon', polygon_1.default);
register_1.register('text', text_1.default);
register_1.register('path', path_1.default);
register_1.register('line', line_1.default);
register_1.register('ellipse', ellipse_1.default);
//# sourceMappingURL=index.js.map