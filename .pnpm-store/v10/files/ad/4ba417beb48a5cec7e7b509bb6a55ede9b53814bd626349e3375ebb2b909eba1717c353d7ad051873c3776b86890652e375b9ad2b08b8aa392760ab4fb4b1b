"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingModuleError = void 0;
const response_error_1 = __importDefault(require("./response-error"));
const notification_1 = require("../notification");
class MissingModuleError extends response_error_1.default {
    constructor(deps, conn, mustUpgrade = false) {
        super(1000, `Missing module "${deps.map((d, i) => `${d.name}@${d.version || 'latest'}${i === deps.length - 2 ? ' and ' : (i === deps.length - 1 ? '' : ', ')}`).join('')}". Need to ${mustUpgrade ? 'upgrade' : 'install'}.`, {
            notification: notification_1.MissingModuleNotification,
            dontNotify: true,
            args: {
                conn,
                action: mustUpgrade ? 'upgrade' : 'install',
                deps,
            }
        });
    }
}
exports.MissingModuleError = MissingModuleError;
exports.default = MissingModuleError;
