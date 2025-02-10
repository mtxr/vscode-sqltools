"use strict";
/**
 * 创建DOM 节点
 * @param  {String} str Dom 字符串
 * @return {HTMLElement}  DOM 节点
 */
Object.defineProperty(exports, "__esModule", { value: true });
var TABLE;
var TABLE_TR;
var FRAGMENT_REG;
var CONTAINERS;
function initConstants() {
    TABLE = document.createElement('table');
    TABLE_TR = document.createElement('tr');
    FRAGMENT_REG = /^\s*<(\w+|!)[^>]*>/;
    CONTAINERS = {
        tr: document.createElement('tbody'),
        tbody: TABLE,
        thead: TABLE,
        tfoot: TABLE,
        td: TABLE_TR,
        th: TABLE_TR,
        '*': document.createElement('div'),
    };
}
function createDom(str) {
    if (!TABLE) {
        initConstants();
    }
    var name = FRAGMENT_REG.test(str) && RegExp.$1;
    if (!name || !(name in CONTAINERS)) {
        name = '*';
    }
    var container = CONTAINERS[name];
    str = typeof str === 'string' ? str.replace(/(^\s*)|(\s*$)/g, '') : str;
    container.innerHTML = '' + str;
    var dom = container.childNodes[0];
    if (dom && container.contains(dom)) {
        container.removeChild(dom);
    }
    return dom;
}
exports.default = createDom;
//# sourceMappingURL=create-dom.js.map