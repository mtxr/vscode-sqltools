"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coordinate = exports.registerCoordinate = exports.getCoordinate = void 0;
var base_1 = require("./coord/base");
exports.Coordinate = base_1.default;
var cartesian_1 = require("./coord/cartesian");
var helix_1 = require("./coord/helix");
var polar_1 = require("./coord/polar");
var factory_1 = require("./factory");
Object.defineProperty(exports, "getCoordinate", { enumerable: true, get: function () { return factory_1.getCoordinate; } });
Object.defineProperty(exports, "registerCoordinate", { enumerable: true, get: function () { return factory_1.registerCoordinate; } });
factory_1.registerCoordinate('rect', cartesian_1.default);
factory_1.registerCoordinate('cartesian', cartesian_1.default);
factory_1.registerCoordinate('polar', polar_1.default);
factory_1.registerCoordinate('helix', helix_1.default);
//# sourceMappingURL=index.js.map