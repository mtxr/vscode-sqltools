"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g2_1 = require("@antv/g2");
var marker_active_1 = require("./marker-active");
(0, g2_1.registerAction)('marker-active', marker_active_1.MarkerActiveAction);
(0, g2_1.registerInteraction)('marker-active', {
    start: [
        {
            trigger: 'tooltip:show',
            action: 'marker-active:active',
        },
    ],
    end: [
        {
            trigger: 'tooltip:hide',
            action: 'marker-active:reset',
        },
    ],
});
//# sourceMappingURL=index.js.map