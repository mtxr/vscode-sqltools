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
exports.__esModule = true;
exports.createLogger = void 0;
var logger;
var isVSCodeContext = function () {
    try {
        require.resolve('vscode');
        return true;
    }
    catch (error) {
        return false;
    }
};
if (process.env.PRODUCT === 'ext' && isVSCodeContext()) {
    logger = require('./lib/vscode')["default"];
}
else {
    logger = require('./lib/general')["default"];
}
function createLogger(ns, bindings) {
    if (bindings === void 0) { bindings = {}; }
    if (!ns)
        return logger;
    return logger.child(__assign(__assign({}, bindings), { ns: ns }));
}
exports.createLogger = createLogger;
exports["default"] = logger;
