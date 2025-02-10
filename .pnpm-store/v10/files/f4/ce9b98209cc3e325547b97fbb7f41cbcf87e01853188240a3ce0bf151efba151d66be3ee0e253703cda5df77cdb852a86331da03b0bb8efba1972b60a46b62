import { each, mix } from '@antv/util';
import { ListItem } from '../types';

// 获取多个状态量的合并值
export function getStatesStyle(item: ListItem, elementName: string, stateStyles: object) {
  const styleName = `${elementName}Style`; // activeStyle
  let styles = null;
  each(stateStyles, (v, state) => {
    if (item[state] && v[styleName]) {
      if (!styles) {
        styles = {};
      }
      mix(styles, v[styleName]); // 合并样式
    }
  });
  return styles;
}
