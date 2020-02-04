import telemetry from '@sqltools/core/telemetry';
import Config from './config-manager';

export default telemetry;

Config.addOnUpdateHook((ev) => {
  if (ev.affectsConfig('telemetry')) {
    if (Config.telemetry) telemetry.enable();
    else telemetry.disable();
  }
});