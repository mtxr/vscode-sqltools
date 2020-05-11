const path = require('path');
const rootPkgJson = require('../../../package.json');

module.exports = ({ EXT_NAMESPACE, IS_PREVIEW, DISPLAY_NAME, outdir, IS_PRODUCTION }) => ({
  to: path.resolve(outdir, 'package.json'),
  transform: (content) => {
    content = JSON.parse(content.toString());
    const configurationOriginal = content.contributes.configuration;
    delete content.contributes.configuration;

    Object.keys(content.scripts || {}).forEach(k => {
      if (!k.startsWith('tool:') && !k.startsWith('dep:')) {
        delete content.scripts[k];
      }
    });
    delete content.dependencies;
    delete content.devDependencies;
    delete content.build;

    content = JSON.parse(JSON.stringify(content)
      .replace(/(?:(?<!vscode\-))sqltools([\/\.\-])/g, `${EXT_NAMESPACE}$1`)
      .replace(/SQLTools/g, `${DISPLAY_NAME}`));
    content.contributes.configuration = configurationOriginal;
    content.name = EXT_NAMESPACE;
    content.displayName = DISPLAY_NAME;
    content.version = rootPkgJson.version;
    if (IS_PREVIEW) {
      content.preview = true;
      content.displayName += ' (alpha)';
    }
    return JSON.stringify(content, null, IS_PRODUCTION ? undefined : 2);
  }
});