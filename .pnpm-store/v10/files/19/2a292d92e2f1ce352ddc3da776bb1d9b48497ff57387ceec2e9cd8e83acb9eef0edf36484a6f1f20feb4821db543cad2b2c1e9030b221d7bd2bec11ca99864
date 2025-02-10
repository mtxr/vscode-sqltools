"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqltoolsResolve = void 0;
const env_paths_1 = __importDefault(require("env-paths"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const resolve_1 = require("resolve");
const mkdir = __importStar(require("make-dir"));
const SQLTOOLS_PATHS = env_paths_1.default(`vscode-${process.env.EXT_NAMESPACE || 'sqltools'}`, { suffix: null });
if (!fs_1.default.existsSync(SQLTOOLS_PATHS.data)) {
    mkdir.sync(SQLTOOLS_PATHS.data);
}
if (!fs_1.default.existsSync(getDataPath('node_modules'))) {
    mkdir.sync(getDataPath('node_modules'));
}
function getDataPath(...args) {
    return path_1.default.resolve(SQLTOOLS_PATHS.data, ...args);
}
exports.sqltoolsResolve = (name) => resolve_1.sync(name, { basedir: getDataPath() });
const sqltoolsRequire = (name) => require(exports.sqltoolsResolve(name));
exports.default = sqltoolsRequire;
