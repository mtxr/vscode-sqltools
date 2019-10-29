import * as path from 'path';
import * as theme from './src/theme/config';

const PUBLIC = path.resolve(__dirname, 'assets');
const SRC = path.resolve(__dirname, 'src')

export default {
  title: 'SQLTools',
  description: 'SQLTools for VSCode',
  wrapper:'src/docs-theme',
  menu: [
    {
      name: 'Home',
      order: 1
    },
    'Features',
    'Drivers',
    { name: 'Settings', menu: ['Properties']},
    {
      name: 'Contributing',
      menu: ['How to contribute to SQLTools'],
    },
    { name: 'Changelog', order: 100  }
  ],
  plugins: [
  ],
  public: './public',
  dest: 'dist',
  typescript: true,
  indexHtml: 'src/index.html',
  htmlContext: {
    favicon: '/public/favicon.png',
  },
  editBranch: 'master',
  themeConfig: {
    colors: {
      primary: theme.colors.p500,
      link: theme.colors.p500,
      blue: theme.colors.b500,
      blueLight: theme.colors.b300,
      skyBlue: theme.colors.b300,
      background: theme.colors.white,
      gray: theme.colors.n500,
      grayDark: theme.colors.n700,
      grayExtraDark: theme.colors.n900,
      grayLight: theme.colors.n300,
      grayExtraLight: theme.colors.n100,
      grayBg: '#CED4DE',
      yellow: '#FFDF00'
    },
    fontWeight: theme.fontWeight,
    transition: 'all 0.1s ease',
  },
  onCreateWebpackChain: config => {
    config.resolve.alias
      .set('@fonts', `${PUBLIC}/fonts`)
      .set('@images', `${PUBLIC}/images`)
      .set('@components', `${SRC}/theme/components`)
      .set('@styles', `${SRC}/theme/styles`)

    return config
  },
}
