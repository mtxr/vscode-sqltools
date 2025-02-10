import { useContext } from 'react';
import { genStyleUtils } from '@ant-design/cssinjs-utils';
import { ConfigContext, defaultIconPrefixCls } from '../../config-provider/context';
import { genCommonStyle, genLinkStyle, genIconStyle } from '../../style';
import useLocalToken, { unitless } from '../useToken';
export const {
  genStyleHooks,
  genComponentStyleHook,
  genSubStyleComponent
} = genStyleUtils({
  usePrefix: () => {
    const {
      getPrefixCls,
      iconPrefixCls
    } = useContext(ConfigContext);
    const rootPrefixCls = getPrefixCls();
    return {
      rootPrefixCls,
      iconPrefixCls
    };
  },
  useToken: () => {
    const [theme, realToken, hashId, token, cssVar] = useLocalToken();
    return {
      theme,
      realToken,
      hashId,
      token,
      cssVar
    };
  },
  useCSP: () => {
    const {
      csp
    } = useContext(ConfigContext);
    return csp !== null && csp !== void 0 ? csp : {};
  },
  getResetStyles: (token, config) => {
    var _a;
    return [{
      '&': genLinkStyle(token)
    }, genIconStyle((_a = config === null || config === void 0 ? void 0 : config.prefix.iconPrefixCls) !== null && _a !== void 0 ? _a : defaultIconPrefixCls)];
  },
  getCommonStyle: genCommonStyle,
  getCompUnitless: () => unitless
});