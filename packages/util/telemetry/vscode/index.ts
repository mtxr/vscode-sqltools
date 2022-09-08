if (process.env.PRODUCT !== 'ext') { throw 'Cant use telemetry module outside of VS Code context. User @sqltools/util/telemetry instead'; }

import telemetry from './../generic';
import Config from '@sqltools/util/config-manager';
import { workspace } from 'vscode';

export default telemetry;

Config.addOnUpdateHook(({ event }) => {
  if (event.affectsConfiguration('telemetry.enableTelemetry')) {
    if (workspace.getConfiguration().get('telemetry.enableTelemetry')) telemetry.enable();
    else telemetry.disable();
  }
});