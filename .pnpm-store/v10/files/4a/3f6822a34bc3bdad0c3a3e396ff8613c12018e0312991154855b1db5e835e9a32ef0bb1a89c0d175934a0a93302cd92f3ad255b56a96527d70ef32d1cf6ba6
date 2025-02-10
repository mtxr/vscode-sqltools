import { createDotPattern } from './dot';
import { createLinePattern } from './line';
import { createSquarePattern } from './square';
/**
 * 获取内置的 CanvasPattern 方法
 * @param options
 * @returns
 */
export function getCanvasPattern(options) {
    var type = options.type, cfg = options.cfg;
    var pattern;
    switch (type) {
        case 'dot':
            pattern = createDotPattern(cfg);
            break;
        case 'line':
            pattern = createLinePattern(cfg);
            break;
        case 'square':
            pattern = createSquarePattern(cfg);
            break;
        default:
            break;
    }
    return pattern;
}
//# sourceMappingURL=index.js.map