import getStyle from './get-style';

export default function getHeight(el: HTMLElement, defaultValue?: any): number {
  let height = getStyle(el, 'height', defaultValue);
  if (height === 'auto') {
    height = el.offsetHeight;
  }
  return parseFloat(height);
}
