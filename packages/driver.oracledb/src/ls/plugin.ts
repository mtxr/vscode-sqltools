import { ILanguageServerPlugin } from '@sqltools/types';
import YourDriver from './driver';
import { DRIVER_ALIASES } from './../constants';

const YourDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, YourDriver as any);
    });
  }
}

export default YourDriverPlugin;
