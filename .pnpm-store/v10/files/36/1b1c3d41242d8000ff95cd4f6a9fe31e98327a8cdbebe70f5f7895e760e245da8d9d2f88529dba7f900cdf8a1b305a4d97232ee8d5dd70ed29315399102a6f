
import getStyle from './get-style';
import getWidth from './get-width';

export default function getOuterWidth(el: HTMLElement, defaultValue?: any): number {
  const width = getWidth(el, defaultValue);
  const bLeft = parseFloat(getStyle(el, 'borderLeftWidth')) || 0;
  const pLeft = parseFloat(getStyle(el, 'paddingLeft')) || 0;
  const pRight = parseFloat(getStyle(el, 'paddingRight')) || 0;
  const bRight = parseFloat(getStyle(el, 'borderRightWidth')) || 0;
  const mRight = parseFloat(getStyle(el, 'marginRight')) || 0;
  const mLeft = parseFloat(getStyle(el, 'marginLeft')) || 0;
  return width + bLeft + bRight + pLeft + pRight + mLeft + mRight;
}
