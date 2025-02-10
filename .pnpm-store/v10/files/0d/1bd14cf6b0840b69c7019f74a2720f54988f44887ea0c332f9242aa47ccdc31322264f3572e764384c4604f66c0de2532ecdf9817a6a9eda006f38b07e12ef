import getStyle from './get-style';

export default function getHeight(el: HTMLElement, defaultValue?: any): number {
  let width = getStyle(el, 'width', defaultValue);
  if (width === 'auto') {
    width = el.offsetWidth;
  }
  return parseFloat(width);
}
