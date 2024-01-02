import Config from '@sqltools/util/config-manager';
import { window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { EXT_NAMESPACE } from '@sqltools/util/constants';

let statusBar: StatusBarItem & { setText: (text?: string) => void };

statusBar = <typeof statusBar>window.createStatusBarItem(StatusBarAlignment.Left, 10);
statusBar.name = 'SQLTools Connection';
statusBar.tooltip = 'Select a SQLTools connection';
statusBar.command = `${EXT_NAMESPACE}.selectConnection`;

statusBar.setText = text => (statusBar.text = `$(database) ${text || 'Connect'}`);

statusBar.setText();

// The sqltools.showStatusbar setting has been deprecated. Use statusbar context menu option instead, which has priority over this one.
const updateVisibility = () => Config.showStatusbar ? statusBar.show() : statusBar.hide();

updateVisibility();

Config.addOnUpdateHook(({ event }) => event.affectsConfig('showStatusbar') && updateVisibility());

export default statusBar;