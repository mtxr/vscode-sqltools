import ConfigManager from '@sqltools/core/config-manager';
import { window, StatusBarItem, StatusBarAlignment } from 'vscode';
import { EXT_NAME } from '@sqltools/core/constants';

let statusBar: StatusBarItem & { setText: (text?: string) => void };

statusBar = <typeof statusBar>window.createStatusBarItem(StatusBarAlignment.Left, 10);
statusBar.tooltip = 'Select a connection';
statusBar.command = `${EXT_NAME}.selectConnection`;

statusBar.setText = text => (statusBar.text = `$(database) ${text || 'Connect'}`);

statusBar.setText();

const updateVisibility = () => ConfigManager.showStatusbar ? statusBar.show() : statusBar.hide();

updateVisibility();

ConfigManager.addOnUpdateHook(updateVisibility);

export default statusBar;