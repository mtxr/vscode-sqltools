import { ILanguageServerPlugin } from '@sqltools/types';
import PostgreSQL from './driver';
import { DRIVER_ALIASES } from './../constants';

const PGDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, PostgreSQL);
    });
  },
};

export default PGDriverPlugin;
