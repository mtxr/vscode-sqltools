import { isEqual, some } from '@antv/util';
/**
 * @ignore
 * Determines whether model is change
 * @param currentModel
 * @param preModel
 * @returns
 */
export function isModelChange(currentModel, preModel) {
    return some(['color', 'shape', 'size', 'x', 'y', 'isInCircle', 'data', 'style', 'defaultStyle', 'points', 'mappingData'], function (key) {
        return !isEqual(currentModel[key], preModel[key]);
    });
}
//# sourceMappingURL=is-model-change.js.map