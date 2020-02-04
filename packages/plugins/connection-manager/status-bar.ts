import Config from '@sqltools/vscode/config-manager';
import { window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { EXT_NAMESPACE } from '@sqltools/core/constants';

let statusBar: StatusBarItem & { setText: (text?: string) => void };

statusBar = <typeof statusBar>window.createStatusBarItem(StatusBarAlignment.Left, 10);
statusBar.tooltip = 'Select a connection';
statusBar.command = `${EXT_NAMESPACE}.selectConnection`;

statusBar.setText = text => (statusBar.text = `$(database) ${text || 'Connect'}`);

statusBar.setText();

const updateVisibility = () => Config.showStatusbar ? statusBar.show() : statusBar.hide();

updateVisibility();

Config.addOnUpdateHook(ev => ev.affectsConfig('showStatusbar') && updateVisibility);

export default statusBar;