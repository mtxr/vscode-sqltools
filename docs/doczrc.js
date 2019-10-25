import codeTitlesPlugin from "gatsby-remark-code-titles";
import * as path from 'path';
import * as themeColors from './src/theme/colors';

const PUBLIC = path.resolve(__dirname, 'assets');
const SRC = path.resolve(__dirname, 'src')

export default {
  title: 'SQLTools',
  description: 'SQLTools for VSCode',
  menu: [
    {
      name: 'Welcome',
      menu: ['Getting Started', 'Changelog'],
    },
    'Features',
    'Connection Drivers',
    {
      name: 'Contributing',
      menu: ['How to contribute to SQLTools'],
    },
  ],
  plugins: [
  ],
  public: './public',
  dest: 'dist',
  typescript: true,
  htmlContext: {
    favicon: '/public/favicon.png',
  },
  editBranch: 'master',
  themeConfig: {
    colors: {
      primary: themeColors.colors.p500,
      link: themeColors.colors.p500,
      blue: themeColors.colors.b500,
      blueLight: themeColors.colors.b300,
      skyBlue: themeColors.colors.b300,
      background: themeColors.colors.white,
      gray: themeColors.colors.n500,
      grayDark: themeColors.colors.n700,
      grayExtraDark: themeColors.colors.n900,
      grayLight: themeColors.colors.n300,
      grayExtraLight: themeColors.colors.n100
    }
  },
  // mdPlugins: [codeTitlesPlugin],
  onCreateWebpackChain: config => {
    console.log(config);
    config.resolve.alias
      .set('@fonts', `${PUBLIC}/fonts`)
      .set('@images', `${PUBLIC}/images`)
      .set('@components', `${SRC}/theme/components`)
      .set('@styles', `${SRC}/theme/styles`)

    return config
  },
  // themeConfig: {
  //   colors: {
  //     inlineCodeBg: '#e5e5e5',
  //     border: 'transparent',
  //     header,
  //     sidebar: {
  //       bg: '#00000008',
  //       navLinkActive: '#4D4BA9',
  //     },
  //     modes: {
  //       dark: {
  //         inlineCodeBg: '#060606',
  //         background: '#1a1d23',
  //         border: 'transparent',
  //         header,
  //         sidebar: {
  //           bg: '#FFFFFF08',
  //         },
  //       }
  //     },
  //   },
  //   styles: {
  //     root: {
  //       fontSize: 'medium'
  //     },
  //     a: {
  //       fill: 'primary'
  //     },
  //     inlineCode: {
  //       fontSize: '.85em',
  //       padding: '0.15em 0.2em',
  //       borderRadius: '0.2em',
  //       bg: 'inlineCodeBg',
  //     },
  //     pre: {
  //       paddingLeft: 0,
  //       fontSize: '1em',
  //       lineHeight: '1.3',
  //       '::after': {
  //         background: '#ffffff08',
  //         width: '2.5em',
  //         content: `' '`,
  //         height: '100%',
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         zIndex: 0,
  //       }
  //     }
  //   }
  // },
  // gatsbyRemarkPlugins: [
  //   { resolve: 'gatsby-remark-code-titles' },
  //   {
  //     resolve: `gatsby-remark-vscode`,
  //     options: {
  //       injectStyles: false,
  //     },
  //   },
  // ]
}
