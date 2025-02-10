/**
 * 创建DOM 节点
 * @param  {String} str Dom 字符串
 * @return {HTMLElement}  DOM 节点
 */

let TABLE:HTMLTableElement;
let TABLE_TR:HTMLTableRowElement;
let FRAGMENT_REG:RegExp;
let CONTAINERS:{
  '*': HTMLDivElement;
  [key:string]: any;
};

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

export default function createDom(str:string): any {
  if (!TABLE) {
    initConstants();
  }
  let name = FRAGMENT_REG.test(str) && RegExp.$1;
  if (!name || !(name in CONTAINERS)) {
    name = '*';
  }
  const container = CONTAINERS[name];
  str = typeof str === 'string' ? str.replace(/(^\s*)|(\s*$)/g, '') : str;
  container.innerHTML = '' + str;
  const dom = container.childNodes[0];
  if (dom && container.contains(dom)) {
    container.removeChild(dom);
  }
  return dom;
}
