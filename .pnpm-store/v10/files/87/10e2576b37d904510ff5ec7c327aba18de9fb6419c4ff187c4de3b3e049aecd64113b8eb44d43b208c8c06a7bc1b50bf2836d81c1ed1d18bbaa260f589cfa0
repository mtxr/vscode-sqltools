"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var pino_1 = __importDefault(require("pino"));
function factory(opts, stream) {
    if (opts === void 0) { opts = {}; }
    var logger = pino_1["default"](__assign({ name: process.env.PRODUCT || 'UNINDENTIFIED', base: {}, level: process.env.NODE_ENV === 'development' ? 'debug' : 'info', formatters: {
            level: function (level) { return { level: level }; }
        }, prettyPrint: true }, opts), stream);
    logger.show = function () { return void 0; };
    return logger;
}
exports["default"] = factory;
