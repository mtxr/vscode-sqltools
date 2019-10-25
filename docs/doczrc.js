const path = require('path');

const PUBLIC = path.resolve(__dirname, 'assets');

const primary = 'rgb(5, 4, 49)';

const header = {
  bg: primary,
  border: 'transparent',
  text: 'white'
};

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
  typescript: true,
  public: PUBLIC,// '/assets',
  themeConfig: {
    colors: {
      inlineCodeBg: '#e5e5e5',
      border: 'transparent',
      header,
      sidebar: {
        bg: '#00000008',
        navLinkActive: '#4D4BA9',
      },
      modes: {
        dark: {
          inlineCodeBg: '#060606',
          background: '#1a1d23',
          border: 'transparent',
          header,
          sidebar: {
            bg: '#FFFFFF08',
          },
        }
      },
    },
    styles: {
      root: {
        fontSize: 'medium'
      },
      a: {
        fill: 'primary'
      },
      inlineCode: {
        fontSize: '.85em',
        padding: '0.15em 0.2em',
        borderRadius: '0.2em',
        bg: 'inlineCodeBg',
      },
      pre: {
        paddingLeft: 0,
        fontSize: '1em',
        lineHeight: '1.3',
        '::after': {
          background: '#ffffff08',
          width: '2.5em',
          content: `' '`,
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }
      }
    }
  },
  htmlContext: {
    favicon: '/public/favicon.png',
  },
  gatsbyRemarkPlugins: [
    { resolve: 'gatsby-remark-code-titles' },
    {
      resolve: `gatsby-remark-vscode`,
      options: {
        injectStyles: false,
      },
    },
  ]
}
