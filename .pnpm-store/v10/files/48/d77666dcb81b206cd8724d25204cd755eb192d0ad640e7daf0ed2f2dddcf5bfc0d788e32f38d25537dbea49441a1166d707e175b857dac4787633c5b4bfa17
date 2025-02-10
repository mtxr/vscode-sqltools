"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionStart = exports.FUNNEL_LEGEND_FILTER = void 0;
var g2_1 = require("@antv/g2");
var funnel_conversion_tag_1 = require("./funnel-conversion-tag");
var FUNNEL_CONVERSION_TAG = 'funnel-conversion-tag';
exports.FUNNEL_LEGEND_FILTER = 'funnel-afterrender';
exports.interactionStart = { trigger: 'afterrender', action: "".concat(FUNNEL_CONVERSION_TAG, ":change") };
(0, g2_1.registerAction)(FUNNEL_CONVERSION_TAG, funnel_conversion_tag_1.ConversionTagAction);
(0, g2_1.registerInteraction)(exports.FUNNEL_LEGEND_FILTER, {
    start: [exports.interactionStart],
});
//# sourceMappingURL=index.js.map