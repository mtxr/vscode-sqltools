"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g2_1 = require("@antv/g2");
var node_drag_1 = require("./actions/node-drag");
(0, g2_1.registerAction)('sankey-node-drag', node_drag_1.SankeyNodeDragAction);
(0, g2_1.registerInteraction)('sankey-node-draggable', {
    showEnable: [
        { trigger: 'polygon:mouseenter', action: 'cursor:pointer' },
        { trigger: 'polygon:mouseleave', action: 'cursor:default' },
    ],
    start: [{ trigger: 'polygon:mousedown', action: 'sankey-node-drag:start' }],
    processing: [
        { trigger: 'plot:mousemove', action: 'sankey-node-drag:translate' },
        { isEnable: function (context) { return context.isDragging; }, trigger: 'plot:mousemove', action: 'cursor:move' },
    ],
    end: [{ trigger: 'plot:mouseup', action: 'sankey-node-drag:end' }],
});
//# sourceMappingURL=node-draggable.js.map