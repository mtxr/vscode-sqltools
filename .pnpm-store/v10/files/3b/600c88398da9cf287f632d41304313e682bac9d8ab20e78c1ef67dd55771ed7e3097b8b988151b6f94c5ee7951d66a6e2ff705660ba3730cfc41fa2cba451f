"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronNotSupportedError = void 0;
const response_error_1 = __importDefault(require("./response-error"));
const notification_1 = require("../notification");
class ElectronNotSupportedError extends response_error_1.default {
    constructor(message = `Electron is not supported. You should enable \'sqltools.useNodeRuntime\' and have NodeJS installed to continue.`) {
        super(1001, message, {
            notification: notification_1.ElectronNotSupportedNotification,
            dontNotify: true
        });
    }
}
exports.ElectronNotSupportedError = ElectronNotSupportedError;
exports.default = ElectronNotSupportedError;
