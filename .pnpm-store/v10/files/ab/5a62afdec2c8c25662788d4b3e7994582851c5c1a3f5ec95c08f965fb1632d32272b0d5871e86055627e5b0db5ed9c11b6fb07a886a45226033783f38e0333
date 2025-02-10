"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheme = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
var create_by_style_sheet_1 = require("./create-by-style-sheet");
var light_1 = require("../style-sheet/light");
function createTheme(themeCfg) {
    var _a = themeCfg.styleSheet, styleSheetCfg = _a === void 0 ? {} : _a, themeObject = tslib_1.__rest(themeCfg, ["styleSheet"]);
    // ① 创建样式表 (默认创建 light 的样式表)
    var styleSheet = (0, light_1.createLightStyleSheet)(styleSheetCfg);
    // ② 创建主题
    return (0, util_1.deepMix)({}, (0, create_by_style_sheet_1.createThemeByStyleSheet)(styleSheet), themeObject);
}
exports.createTheme = createTheme;
//# sourceMappingURL=create-theme.js.map