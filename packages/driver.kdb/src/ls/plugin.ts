import { ILanguageServerPlugin } from '@sqltools/types';
import KdbDriver from './driver';
import { DRIVER_ALIASES } from './../constants';

const KdbDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, KdbDriver as any);
    });
  }
}

export default KdbDriverPlugin;
