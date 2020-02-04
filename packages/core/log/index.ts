import productLogger from './base';
import ConfigRO from '../config-manager';

ConfigRO.addOnUpdateHook(() => {
  const currentNS = (productLogger._debug as any).load && (productLogger._debug as any).load();
  let newNS = ConfigRO.get('debug', {}).namespaces;
  if (!newNS) {
    newNS = process.env.NODE_ENV === 'development' ? '*' : '*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug';
  }
  if (currentNS !== newNS) productLogger._debug.enable(newNS);
});

export default productLogger;