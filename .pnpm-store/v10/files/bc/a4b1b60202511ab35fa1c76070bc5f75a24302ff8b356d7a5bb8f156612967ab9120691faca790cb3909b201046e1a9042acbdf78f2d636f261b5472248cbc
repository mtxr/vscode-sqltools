"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.group = void 0;
var tslib_1 = require("tslib");
var util_1 = require("@antv/util");
/** @ignore */
function group(data, fields, appendConditions) {
    var e_1, _a;
    if (appendConditions === void 0) { appendConditions = {}; }
    if (!fields) {
        return [data];
    }
    var groups = (0, util_1.groupToMap)(data, fields);
    var array = [];
    if (fields.length === 1 && appendConditions[fields[0]]) {
        var values = appendConditions[fields[0]];
        try {
            for (var values_1 = tslib_1.__values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                var value = values_1_1.value;
                var arr = groups["_".concat(value)];
                if (arr) {
                    // 可能存在用户设置 values ，但是数据中没有对应的字段，则这时候 arr 就为 null
                    array.push(arr);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else {
        for (var k in groups) {
            if (groups.hasOwnProperty(k)) {
                var eachGroup = groups[k];
                array.push(eachGroup);
            }
        }
    }
    return array;
}
exports.group = group;
//# sourceMappingURL=group-data.js.map