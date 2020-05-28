import { ILanguageServerPlugin } from '@sqltools/types';
import MSSQL from './driver';
import { DRIVER_ALIASES } from './../constants';

const MSSQLDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, MSSQL);
    });
  }
}

export default MSSQLDriverPlugin;