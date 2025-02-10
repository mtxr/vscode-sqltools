
import getStyle from './get-style';
import getHeight from './get-height';

export default function getOuterHeight(el: HTMLElement, defaultValue?: any): number {
  const height = getHeight(el, defaultValue);
  const bTop = parseFloat(getStyle(el, 'borderTopWidth')) || 0;
  const pTop = parseFloat(getStyle(el, 'paddingTop')) || 0;
  const pBottom = parseFloat(getStyle(el, 'paddingBottom')) || 0;
  const bBottom = parseFloat(getStyle(el, 'borderBottomWidth')) || 0;
  const mTop = parseFloat(getStyle(el, 'marginTop')) || 0;
  const mBottom = parseFloat(getStyle(el, 'marginBottom')) || 0;
  return height + bTop + bBottom + pTop + pBottom + mTop + mBottom;
}
