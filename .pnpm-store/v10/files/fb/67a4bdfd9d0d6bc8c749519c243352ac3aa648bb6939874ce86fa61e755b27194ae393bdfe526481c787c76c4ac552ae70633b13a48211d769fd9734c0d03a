"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var render_1 = require("./render");
var TOOLTIP_CONTAINER_MAPPING = new Map();
var createNode = function (children, type, uuid) {
    var mountPoint = document.createElement('div');
    if (type === 'tooltip') {
        mountPoint.setAttribute('data-uuid', uuid);
        if (TOOLTIP_CONTAINER_MAPPING.has(uuid)) {
            mountPoint = TOOLTIP_CONTAINER_MAPPING.get(uuid);
        }
        else {
            TOOLTIP_CONTAINER_MAPPING.set(uuid, mountPoint);
        }
        mountPoint.className = 'g2-tooltip';
    }
    (0, render_1.render)(children, mountPoint);
    return mountPoint;
};
exports.default = createNode;
