import telemetry from '@sqltools/language-server/telemetry';
import ConfigRO from '@sqltools/core/config-manager';

export default telemetry;

ConfigRO.addOnUpdateHook(() => {
  if (ConfigRO.telemetry) telemetry.enable();
  else telemetry.disable();
});
// @TODO move to language server package