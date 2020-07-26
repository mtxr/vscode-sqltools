import productLogger from '../base';
import ConfigRO from '@sqltools/util/config-manager';

ConfigRO.addOnUpdateHook(() => {
  const currentNS = (productLogger._debug as any).load && (productLogger._debug as any).load();
  let newNS = ConfigRO.get('debug', {}).namespaces;
  if (!newNS) {
    newNS = process.env.NODE_ENV === 'development' ? 'sql:*' : 'sql:*,-sql:*:debug,-sql:*:*:debug,-sql:*:*:*:debug,-sql:*:*:*:*:debug,-sql:*:*:*:*:*:debug';
  }
  if (currentNS !== newNS) productLogger._debug.enable(newNS);
  console.log('namespaces set to ', newNS);
});

export default productLogger;