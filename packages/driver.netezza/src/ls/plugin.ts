import { ILanguageServerPlugin } from '@sqltools/types';
import Netezza from './driver';
import { DRIVER_ALIASES } from './../constants';

const NetezzaDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, Netezza);
    });
  }
}

export default NetezzaDriverPlugin;