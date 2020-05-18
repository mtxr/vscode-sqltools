import { ILanguageServerPlugin } from '@sqltools/types';
import PostgreSQL from './driver';

const PGDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    server.getContext().drivers.set('PostgreSQL', PostgreSQL);
    server.getContext().drivers.set('AWS Redshift', PostgreSQL);
  }
}

export default PGDriverPlugin;