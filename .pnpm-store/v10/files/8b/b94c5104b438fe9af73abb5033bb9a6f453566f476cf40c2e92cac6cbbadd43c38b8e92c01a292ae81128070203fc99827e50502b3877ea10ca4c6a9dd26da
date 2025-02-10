import Theme from '../util/theme';

// tooltip 相关 dom 的 css 类名
import * as CssConst from './css-const';

export default {
  // css style for tooltip
  [`${CssConst.CONTAINER_CLASS}`]: {
    position: 'absolute',
    visibility: 'visible',
    // @2018-07-25 by blue.lb 这里去掉浮动，火狐上存在样式错位
    // whiteSpace: 'nowrap',
    zIndex: 8,
    transition:
      'visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1), ' +
      'left 0.4s cubic-bezier(0.23, 1, 0.32, 1), ' +
      'top 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0px 0px 10px #aeaeae',
    borderRadius: '3px',
    color: 'rgb(87, 87, 87)',
    fontSize: '12px',
    fontFamily: Theme.fontFamily,
    lineHeight: '20px',
    padding: '10px 10px 6px 10px',
  },
  [`${CssConst.TITLE_CLASS}`]: {
    marginBottom: '4px',
  },
  [`${CssConst.LIST_CLASS}`]: {
    margin: '0px',
    listStyleType: 'none',
    padding: '0px',
  },
  [`${CssConst.LIST_ITEM_CLASS}`]: {
    listStyleType: 'none',
    marginBottom: '4px',
  },
  [`${CssConst.MARKER_CLASS}`]: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  },
  [`${CssConst.VALUE_CLASS}`]: {
    display: 'inline-block',
    float: 'right',
    marginLeft: '30px',
  },
  [`${CssConst.CROSSHAIR_X}`]: {
    position: 'absolute',
    width: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  [`${CssConst.CROSSHAIR_Y}`]: {
    position: 'absolute',
    height: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
};
