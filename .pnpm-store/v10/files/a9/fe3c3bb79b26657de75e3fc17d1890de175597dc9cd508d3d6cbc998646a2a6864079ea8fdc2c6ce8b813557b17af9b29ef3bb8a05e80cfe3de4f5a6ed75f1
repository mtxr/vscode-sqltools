import { __extends, __values } from "tslib";
import { FIELD_ORIGIN } from '../constant';
import Geometry from './base';
import Element from './element';
/** 引入对应的 ShapeFactory */
import './shape/line';
import { isModelChange } from './util/is-model-change';
import { diff } from './util/diff';
/**
 * Path 几何标记。
 * 用于绘制路径图等。
 */
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.type = 'path';
        _this.shapeType = 'line';
        var _a = cfg.connectNulls, connectNulls = _a === void 0 ? false : _a, _b = cfg.showSinglePoint, showSinglePoint = _b === void 0 ? true : _b;
        _this.connectNulls = connectNulls;
        _this.showSinglePoint = showSinglePoint;
        return _this;
    }
    /**
     * 创建所有的 Element 实例，对于 Path、Line、Area，一组数据对应一个 Element。
     * @param mappingData
     * @param [isUpdate]
     * @returns elements
     */
    Path.prototype.updateElements = function (mappingDataArray, isUpdate) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (isUpdate === void 0) { isUpdate = false; }
        // Path 的每个 element 对应一组数据
        var keyData = new Map();
        var keyIndex = new Map();
        var keys = [];
        var index = 0;
        for (var i = 0; i < mappingDataArray.length; i++) {
            var mappingData = mappingDataArray[i];
            var key = this.getElementId(mappingData);
            keys.push(key);
            keyData.set(key, mappingData);
            keyIndex.set(key, index);
            index++;
        }
        this.elements = new Array(index);
        var _d = diff(this.lastElementsMap, keys), added = _d.added, updated = _d.updated, removed = _d.removed;
        try {
            for (var added_1 = __values(added), added_1_1 = added_1.next(); !added_1_1.done; added_1_1 = added_1.next()) {
                var key = added_1_1.value;
                var mappingData = keyData.get(key);
                var shapeFactory = this.getShapeFactory();
                var shapeCfg = this.getShapeInfo(mappingData);
                var i = keyIndex.get(key);
                var element = new Element({
                    shapeFactory: shapeFactory,
                    container: this.container,
                    offscreenGroup: this.getOffscreenGroup(),
                    elementIndex: i,
                });
                element.geometry = this;
                element.animate = this.animateOption;
                element.draw(shapeCfg, isUpdate); // 绘制 shape
                this.elementsMap[key] = element;
                this.elements[i] = element;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (added_1_1 && !added_1_1.done && (_a = added_1.return)) _a.call(added_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var updated_1 = __values(updated), updated_1_1 = updated_1.next(); !updated_1_1.done; updated_1_1 = updated_1.next()) {
                var key = updated_1_1.value;
                var mappingData = keyData.get(key);
                var element = this.lastElementsMap[key];
                var i = keyIndex.get(key);
                var shapeCfg = this.getShapeInfo(mappingData);
                var preShapeCfg = element.getModel();
                if (this.isCoordinateChanged || isModelChange(preShapeCfg, shapeCfg)) {
                    element.animate = this.animateOption;
                    // 通过绘制数据的变更来判断是否需要更新，因为用户有可能会修改图形属性映射
                    element.update(shapeCfg); // 更新对应的 element
                }
                this.elementsMap[key] = element;
                this.elements[i] = element;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (updated_1_1 && !updated_1_1.done && (_b = updated_1.return)) _b.call(updated_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var removed_1 = __values(removed), removed_1_1 = removed_1.next(); !removed_1_1.done; removed_1_1 = removed_1.next()) {
                var key = removed_1_1.value;
                var element = this.lastElementsMap[key];
                // 更新动画配置，用户有可能在更新之前有对动画进行配置操作
                element.animate = this.animateOption;
                element.destroy();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (removed_1_1 && !removed_1_1.done && (_c = removed_1.return)) _c.call(removed_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    /**
     * 获取组成一条线（一组数据）的所有点以及数据
     * @param mappingData 映射后的数组
     */
    Path.prototype.getPointsAndData = function (mappingData) {
        var points = [];
        var data = [];
        for (var i = 0, len = mappingData.length; i < len; i++) {
            var obj = mappingData[i];
            points.push({
                x: obj.x,
                y: obj.y,
            });
            data.push(obj[FIELD_ORIGIN]);
        }
        return {
            points: points,
            data: data,
        };
    };
    Path.prototype.getShapeInfo = function (mappingData) {
        var shapeCfg = this.getDrawCfg(mappingData[0]);
        var _a = this.getPointsAndData(mappingData), points = _a.points, data = _a.data;
        shapeCfg.mappingData = mappingData;
        shapeCfg.data = data;
        shapeCfg.isStack = !!this.getAdjust('stack');
        shapeCfg.points = points;
        shapeCfg.connectNulls = this.connectNulls;
        shapeCfg.showSinglePoint = this.showSinglePoint;
        return shapeCfg;
    };
    return Path;
}(Geometry));
export default Path;
//# sourceMappingURL=path.js.map