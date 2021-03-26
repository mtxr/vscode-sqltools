import { ILanguageServerPlugin } from '@sqltools/types';
import SQLite from './driver';
import { DRIVER_ALIASES } from './../constants';

const SQLiteDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, SQLite as any);
    });
  },
};

export default SQLiteDriverPlugin;
