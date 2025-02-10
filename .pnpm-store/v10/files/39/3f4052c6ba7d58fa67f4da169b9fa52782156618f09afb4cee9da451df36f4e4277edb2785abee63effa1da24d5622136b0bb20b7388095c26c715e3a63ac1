"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTheme = exports.getTheme = void 0;
var util_1 = require("@antv/util");
var util_2 = require("./util");
var defaultTheme = (0, util_2.createTheme)({});
// 所有已经存在的主题
var Themes = {
    default: defaultTheme,
};
/**
 * 获取主题配置信息。
 * @param theme 主题名
 */
function getTheme(theme) {
    return (0, util_1.get)(Themes, (0, util_1.lowerCase)(theme), Themes.default);
}
exports.getTheme = getTheme;
/**
 * 注册新的主题配置信息。
 * @param theme 主题名。
 * @param value 具体的主题配置。
 */
function registerTheme(theme, value) {
    Themes[(0, util_1.lowerCase)(theme)] = (0, util_2.createTheme)(value);
}
exports.registerTheme = registerTheme;
//# sourceMappingURL=index.js.map