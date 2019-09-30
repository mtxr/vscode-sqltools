import * as path from 'path';

const PUBLIC = path.resolve(__dirname, 'assets');

export default {
  title: 'SQLTools',
  description: 'SQLTools for VSCode',
  menu: [
    {
      name: 'Welcome',
      menu: ['Getting Started', 'Changelog']
    },
    'Features',
    'Connection Drivers',
    {
      name:'Contributing',
      menu: ['How to contribute to SQLTools']
    }
  ],
  typescript: true,
  public: '/assets',
  htmlContext: {
    favicon: 'https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/icon.png',
  },
  onCreateWebpackChain: config => {
    config.resolve.alias.set('@assets', PUBLIC);

    return config;
  },
};
