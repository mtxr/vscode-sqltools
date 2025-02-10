"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g2_1 = require("@antv/g2");
(0, g2_1.registerInteraction)('drag-move', {
    start: [{ trigger: 'plot:mousedown', action: 'scale-translate:start' }],
    processing: [
        {
            trigger: 'plot:mousemove',
            action: 'scale-translate:translate',
            throttle: { wait: 100, leading: true, trailing: false },
        },
    ],
    end: [{ trigger: 'plot:mouseup', action: 'scale-translate:end' }],
});
//# sourceMappingURL=drag-move.js.map