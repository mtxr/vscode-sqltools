import { ILanguageServerPlugin } from '@sqltools/types';
import MySQL from './driver';
import { DRIVER_ALIASES } from './../constants';

const MySQLDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, MySQL);
    });
  }
}

export default MySQLDriverPlugin;