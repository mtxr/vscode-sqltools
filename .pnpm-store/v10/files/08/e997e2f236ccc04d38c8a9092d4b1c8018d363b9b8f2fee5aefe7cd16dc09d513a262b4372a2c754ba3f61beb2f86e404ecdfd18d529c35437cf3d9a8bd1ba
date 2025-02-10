import { Mix } from './plots/mix';
/** 实验室图表所处的阶段 */
export var Stage;
(function (Stage) {
    Stage["DEV"] = "DEV";
    Stage["BETA"] = "BETA";
    Stage["STABLE"] = "STABLE";
})(Stage || (Stage = {}));
/**
 * 不同阶段打印一些消息给开发者
 * @param stage
 */
export function notice(stage, plotType) {
    console.warn(stage === Stage.DEV
        ? "Plot '".concat(plotType, "' is in DEV stage, just give us issues.")
        : stage === Stage.BETA
            ? "Plot '".concat(plotType, "' is in BETA stage, DO NOT use it in production env.")
            : stage === Stage.STABLE
                ? "Plot '".concat(plotType, "' is in STABLE stage, import it by \"import { ").concat(plotType, " } from '@antv/g2plot'\".")
                : 'invalid Stage type.');
}
/**
 * 实验室图表，实验室中的图表分成不同的阶段。
 */
var Lab = /** @class */ (function () {
    function Lab() {
    }
    Object.defineProperty(Lab, "MultiView", {
        get: function () {
            notice(Stage.STABLE, 'MultiView');
            return Mix;
        },
        enumerable: false,
        configurable: true
    });
    return Lab;
}());
export { Lab };
//# sourceMappingURL=lab.js.map