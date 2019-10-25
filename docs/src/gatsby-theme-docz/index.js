/** @jsx jsx */
import { Styled, ThemeProvider, jsx } from 'theme-ui';
import { theme, useConfig, ComponentsProvider } from 'docz';

import defaultTheme from '~theme';
import components from '~components';
import { Code } from './components/Code';
import 'gatsby-remark-vscode/styles.css';
import './styles.css';

const bsaeComponents = {
  ...components,
  inlineCode: Code.InlineCode,
  Code: Code,
}

const Theme = ({ children }) => {
  const config = useConfig();
  return (
    <ThemeProvider theme={config.themeConfig}>
      <ComponentsProvider components={bsaeComponents}>
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  );
};

export const enhance = theme(
  defaultTheme,
  ({ mode = 'light', showPlaygroundEditor = true, showLiveError = true, ...config }) => ({
    ...config,
    showLiveError,
    showPlaygroundEditor,
    initialColorMode: mode,
  })
);

export default enhance(Theme);
