const path = require('path');
const { outdir, rootdir, EXT_NAMESPACE } = require('./constants');

const copyEntries = [{
  from: path.join(rootdir, 'README.md'),
  to: path.join(outdir, 'README.md'),
  transform: (content) => {
    content = content.toString();
    const hrPos = content.indexOf('<hr');
    return `# ${EXT_NAMESPACE} extension for Visual Studio Code\n${content.substring(hrPos).replace(/^<hr * \/>/, '')}`;
  },
}, {
  from: path.join(rootdir, 'static/icon.png'),
  to: path.join(outdir, 'static/icon.png')
}, {
  from: path.join(rootdir, '.vscodeignore'),
  to: path.join(outdir, '.vscodeignore'), toType: 'file'
}, {
  from: path.join(rootdir, 'LICENSE.md'),
  to: path.join(outdir, 'LICENSE.md')
}, {
  from: path.join(rootdir, 'CHANGELOG.md'),
  to: path.join(outdir, 'CHANGELOG.md')
}];

module.exports = copyEntries;
