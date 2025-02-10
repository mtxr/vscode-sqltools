import { reduce } from '@antv/util';
/**
 * 简单的模板引擎，使用方式如下（空格自动忽略）：
 * template('hello, {name}', { name: 'AntV' }); // hello, AntV
 * @param string
 * @param options
 */
export function template(source, data) {
    if (!data) {
        return source;
    }
    return reduce(
    // @ts-ignore
    data, function (r, v, k) { return r.replace(new RegExp("{\\s*".concat(k, "\\s*}"), 'g'), v); }, source);
}
//# sourceMappingURL=template.js.map