"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adjust = exports.registerAdjust = exports.getAdjust = void 0;
var tslib_1 = require("tslib");
var factory_1 = require("./factory");
Object.defineProperty(exports, "getAdjust", { enumerable: true, get: function () { return factory_1.getAdjust; } });
Object.defineProperty(exports, "registerAdjust", { enumerable: true, get: function () { return factory_1.registerAdjust; } });
var adjust_1 = require("./adjusts/adjust");
exports.Adjust = adjust_1.default;
var dodge_1 = require("./adjusts/dodge");
var jitter_1 = require("./adjusts/jitter");
var stack_1 = require("./adjusts/stack");
var symmetric_1 = require("./adjusts/symmetric");
// 注册内置的 adjust
factory_1.registerAdjust('Dodge', dodge_1.default);
factory_1.registerAdjust('Jitter', jitter_1.default);
factory_1.registerAdjust('Stack', stack_1.default);
factory_1.registerAdjust('Symmetric', symmetric_1.default);
tslib_1.__exportStar(require("./interface"), exports);
//# sourceMappingURL=index.js.map