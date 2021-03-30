import Config from '@sqltools/util/config-manager';
import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { StatusBarAlignment, window } from 'vscode';

const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 10);
statusBar.tooltip = 'Select a connection';
statusBar.command = `${EXT_NAMESPACE}.selectConnection`;

const updateVisibility = () =>
  Config.showStatusbar ? statusBar.show() : statusBar.hide();

export const updateStatusBarText = (text = '') => {
  statusBar.text = `$(database) ${text || 'Connect'}`;
};

updateStatusBarText();

updateVisibility();

Config.addOnUpdateHook(
  ({ event }) => event.affectsConfig('showStatusbar') && updateVisibility
);

export default statusBar;
