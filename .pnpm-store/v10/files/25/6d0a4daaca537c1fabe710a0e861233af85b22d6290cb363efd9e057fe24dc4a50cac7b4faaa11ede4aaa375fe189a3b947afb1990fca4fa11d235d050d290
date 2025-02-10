"use strict";
/*

> 先做一个针对 G2 场景的极简版本，只有 EQ，而没有不等式的！

```ts
import { Solver, Constraint, Bounds, Operator } from './constraint';

const solver = new Solver();

const b1 = new Bounds();
const b2 = new Bounds();

// -1 * b1.x + b2.width - 200 = 0
const c1 = new Constraint(Operator.EQ, [-1， b1.x], b2.width, -200);
// -1 * b1.x + b1.width - 400 < 0
const c2 = new Constraint(Operator.LT, [-1， b1.x], b1.width, -400);

solver.addConstraint(c1, c2);

// get the b1 b2's layout information
const layout = solver.calc();
```

 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = exports.Constraint = exports.Variable = exports.Bounds = exports.Solver = void 0;
var solver_1 = require("./solver");
Object.defineProperty(exports, "Solver", { enumerable: true, get: function () { return solver_1.Solver; } });
var bounds_1 = require("./bounds");
Object.defineProperty(exports, "Bounds", { enumerable: true, get: function () { return bounds_1.Bounds; } });
var variable_1 = require("./variable");
Object.defineProperty(exports, "Variable", { enumerable: true, get: function () { return variable_1.Variable; } });
var constraint_1 = require("./constraint");
Object.defineProperty(exports, "Constraint", { enumerable: true, get: function () { return constraint_1.Constraint; } });
var types_1 = require("./types");
Object.defineProperty(exports, "Operator", { enumerable: true, get: function () { return types_1.Operator; } });
//# sourceMappingURL=index.js.map