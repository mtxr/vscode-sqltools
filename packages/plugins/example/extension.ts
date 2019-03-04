import { commands } from 'vscode';
import { EXT_NAME } from '@sqltools/core/constants';

const register = () => {
  commands.registerTextEditorCommand(`${EXT_NAME}.exmapleEditorCommand`, () => {});
  commands.registerCommand(`${EXT_NAME}.exmapleCommand`, () => {});
  // @TODO: registerTextEditorCommand should be a method of the extension
}

export default { register };