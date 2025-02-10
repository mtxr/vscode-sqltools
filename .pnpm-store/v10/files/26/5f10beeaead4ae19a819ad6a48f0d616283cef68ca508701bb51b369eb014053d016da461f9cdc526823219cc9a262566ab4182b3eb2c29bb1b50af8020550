/**
 * 类似 lodash.flow 的方法
 * @param flows
 */
export function flow() {
    var flows = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        flows[_i] = arguments[_i];
    }
    return function (param) {
        return flows.reduce(function (result, f) {
            return f(result);
        }, param);
    };
}
//# sourceMappingURL=flow.js.map