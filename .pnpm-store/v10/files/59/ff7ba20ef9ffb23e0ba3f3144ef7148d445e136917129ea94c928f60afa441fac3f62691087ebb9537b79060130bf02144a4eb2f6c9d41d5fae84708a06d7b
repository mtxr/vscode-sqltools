/**
 * 获取样式
 * @param  {Object} dom DOM节点
 * @param  {String} name 样式名
 * @param  {Any} defaultValue 默认值
 * @return {String} 属性值
 */
export default function getStyle(dom: HTMLElement, name: string, defaultValue?: any) {
  let v;
  try {
    v = window.getComputedStyle ?
      window.getComputedStyle(dom, null)[name] :
      dom.style[name]; // 一般不会走到这个逻辑，dom.style 获取的是标签 style 属性，也不准确
  } catch (e) {
    // do nothing
  } finally {
    v = v === undefined ? defaultValue : v;
  }
  return v;
}
