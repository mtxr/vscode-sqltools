import { __rest } from "tslib";
import { deepMix } from '@antv/util';
import { createThemeByStyleSheet } from './create-by-style-sheet';
import { createLightStyleSheet } from '../style-sheet/light';
export function createTheme(themeCfg) {
    var _a = themeCfg.styleSheet, styleSheetCfg = _a === void 0 ? {} : _a, themeObject = __rest(themeCfg, ["styleSheet"]);
    // ① 创建样式表 (默认创建 light 的样式表)
    var styleSheet = createLightStyleSheet(styleSheetCfg);
    // ② 创建主题
    return deepMix({}, createThemeByStyleSheet(styleSheet), themeObject);
}
//# sourceMappingURL=create-theme.js.map